const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { generatePaymentNumber } = require("../utils/helper");

class Payment {
  /**
   * Find payment by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT p.*, 
        i.invoice_number,
        c.full_name as customer_name,
        u.name as received_by_name
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN customers c ON p.customer_id = c.id
       LEFT JOIN users u ON p.received_by = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  /**
   * Find payment by payment number
   */
  static async findByPaymentNumber(paymentNumber) {
    const [rows] = await db.execute(
      `SELECT p.*, 
        i.invoice_number,
        c.full_name as customer_name
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN customers c ON p.customer_id = c.id
       WHERE p.payment_number = ?`,
      [paymentNumber]
    );
    return rows[0];
  }

  /**
   * Create payment
   */
  //   static async create(paymentData, receivedBy) {
  //     const connection = await db.pool.promise().getConnection();

  //     try {
  //       await connection.beginTransaction();

  //       const paymentId = uuidv4();
  //       const paymentNumber = generatePaymentNumber();

  //       await connection.execute(
  //         `INSERT INTO payments (
  //           id, payment_number, invoice_id, customer_id, amount,
  //           payment_method, payment_reference, transaction_id, notes,
  //           payment_date, received_by
  //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //         [
  //           paymentId,
  //           paymentNumber,
  //           paymentData.invoice_id,
  //           paymentData.customer_id,
  //           paymentData.amount,
  //           paymentData.payment_method,
  //           paymentData.payment_reference || null,
  //           paymentData.transaction_id || null,
  //           paymentData.notes || null,
  //           paymentData.payment_date || new Date(),
  //           receivedBy,
  //         ]
  //       );

  //       // Update invoice payment status
  //       const Invoice = require("./Invoice");
  //       await Invoice.updatePaymentStatus(paymentData.invoice_id);

  //       await connection.commit();

  //       return this.findById(paymentId);
  //     } catch (error) {
  //       await connection.rollback();
  //       throw error;
  //     } finally {
  //       connection.release();
  //     }
  //   }
  static async create(paymentData, receivedBy) {
    const connection = await db.pool.promise().getConnection();

    try {
      await connection.beginTransaction();

      const paymentId = uuidv4();
      const paymentNumber = generatePaymentNumber();

      await connection.execute(
        `INSERT INTO payments (
        id, payment_number, invoice_id, customer_id, amount,
        payment_method, payment_reference, transaction_id, notes,
        payment_date, received_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          paymentId,
          paymentNumber,
          paymentData.invoice_id,
          paymentData.customer_id,
          paymentData.amount,
          paymentData.payment_method,
          paymentData.payment_reference || null,
          paymentData.transaction_id || null,
          paymentData.notes || null,
          paymentData.payment_date || new Date(),
          receivedBy,
        ]
      );

      // ✅ SAME connection passed
      const Invoice = require("./Invoice");
      await Invoice.updatePaymentStatus(paymentData.invoice_id, connection);

      await connection.commit();

      const [[payment]] = await connection.execute(
        "SELECT * FROM payments WHERE id = ?",
        [paymentId]
      );

      return payment;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get all payments
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, 
        i.invoice_number,
        c.full_name as customer_name,
        u.name as received_by_name
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN customers c ON p.customer_id = c.id
      LEFT JOIN users u ON p.received_by = u.id
      WHERE 1=1
    `;
    const values = [];

    if (filters.invoice_id) {
      query += " AND p.invoice_id = ?";
      values.push(filters.invoice_id);
    }

    if (filters.customer_id) {
      query += " AND p.customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.payment_method) {
      query += " AND p.payment_method = ?";
      values.push(filters.payment_method);
    }

    if (filters.start_date) {
      query += " AND DATE(p.payment_date) >= ?";
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += " AND DATE(p.payment_date) <= ?";
      values.push(filters.end_date);
    }

    if (filters.search) {
      query += " AND (p.payment_number LIKE ? OR c.full_name LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    query += " ORDER BY p.payment_date DESC";

    if (filters.limit && filters.limit > 0) {
      query += " LIMIT ?";
      values.push(parseInt(filters.limit));

      if (filters.offset && filters.offset > 0) {
        query += " OFFSET ?";
        values.push(parseInt(filters.offset));
      }
    }

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count payments
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM payments p WHERE 1=1";
    const values = [];

    if (filters.invoice_id) {
      query += " AND p.invoice_id = ?";
      values.push(filters.invoice_id);
    }

    if (filters.customer_id) {
      query += " AND p.customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.payment_method) {
      query += " AND p.payment_method = ?";
      values.push(filters.payment_method);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }

  /**
   * Get payments by invoice
   */
  static async getByInvoice(invoiceId) {
    const [rows] = await db.execute(
      `SELECT p.*, u.name as received_by_name
       FROM payments p
       LEFT JOIN users u ON p.received_by = u.id
       WHERE p.invoice_id = ?
       ORDER BY p.payment_date DESC`,
      [invoiceId]
    );
    return rows;
  }

  /**
   * Get today's payments summary
   */
  static async getTodaysSummary() {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as total_amount,
        payment_method,
        COUNT(*) as method_count
       FROM payments
       WHERE DATE(payment_date) = CURDATE()
       GROUP BY payment_method`,
      []
    );

    const [total] = await db.execute(
      `SELECT 
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total
       FROM payments
       WHERE DATE(payment_date) = CURDATE()`,
      []
    );

return {
      total_transactions: total[0].count,
      total_amount: parseFloat(total[0].total),
      by_method: rows,
    };
  }

  /**
   * Get payments by date range
   */
  static async getByDateRange(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT p.*, 
        i.booking_id,
        b.customer_id,
        c.full_name as customer_name,
        r.type as room_type
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN bookings b ON i.booking_id = b.id
       LEFT JOIN customers c ON b.customer_id = c.id
       LEFT JOIN rooms r ON b.room_id = r.id
       WHERE DATE(p.payment_date) BETWEEN ? AND ?
       ORDER BY p.payment_date DESC`,
      [startDate, endDate]
    );
    return rows;
  }
}

module.exports = Payment;
