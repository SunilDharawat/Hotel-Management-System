const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { generateInvoiceNumber, calculateGST } = require("../utils/helper");
const Setting = require("./Setting");

class Invoice {
  /**
   * Find invoice by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT i.*, 
        c.full_name as customer_name, 
        c.contact_number as customer_phone,
        c.email as customer_email,
        b.booking_number,
        u.name as created_by_name
       FROM invoices i
       LEFT JOIN customers c ON i.customer_id = c.id
       LEFT JOIN bookings b ON i.booking_id = b.id
       LEFT JOIN users u ON i.created_by = u.id
       WHERE i.id = ?`,
      [id]
    );
    return rows[0];
  }

  /**
   * Find invoice by invoice number
   */
  static async findByInvoiceNumber(invoiceNumber) {
    const [rows] = await db.execute(
      `SELECT i.*, 
        c.full_name as customer_name, 
        c.contact_number as customer_phone,
        b.booking_number
       FROM invoices i
       LEFT JOIN customers c ON i.customer_id = c.id
       LEFT JOIN bookings b ON i.booking_id = b.id
       WHERE i.invoice_number = ?`,
      [invoiceNumber]
    );
    return rows[0];
  }

  /**
   * Get invoice with items
   */
  static async findByIdWithItems(id) {
    const invoice = await this.findById(id);
    if (!invoice) return null;

    const [items] = await db.execute(
      `SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY created_at`,
      [id]
    );

    invoice.items = items;
    return invoice;
  }

  /**
   * Create invoice from booking
   */
  static async createFromBooking(bookingId, additionalItems = [], createdBy) {
    const connection = await db.pool.promise().getConnection();

    try {
      await connection.beginTransaction();

      // Get booking details
      const [bookings] = await connection.execute(
        `SELECT b.*, r.room_number, r.type as room_type, c.id as customer_id
         FROM bookings b
         JOIN rooms r ON b.room_id = r.id
         JOIN customers c ON b.customer_id = c.id
         WHERE b.id = ?`,
        [bookingId]
      );

      if (bookings.length === 0) {
        throw new Error("Booking not found");
      }

      const booking = bookings[0];

      // Calculate subtotal (room charges + additional items)
      let subtotal = parseFloat(booking.total_amount);

      additionalItems.forEach((item) => {
        subtotal += parseFloat(item.total_price);
      });

      const gstSetting = await Setting.getByKey("gst_rates");

      // Calculate GST
      const gstData = calculateGST(subtotal, {
        cgstRate: Number(gstSetting?.setting_value?.cgst || 0),
        sgstRate: Number(gstSetting?.setting_value?.sgst || 0),
        igstRate: Number(gstSetting?.setting_value?.igst || 0),
      });

      // Calculate grand total
      const grandTotal = subtotal + gstData.total_gst;
      const amountDue = grandTotal - parseFloat(booking.advance_payment || 0);

      // Create invoice
      const invoiceId = uuidv4();
      const invoiceNumber = generateInvoiceNumber();

      await connection.execute(
        `INSERT INTO invoices (
          id, invoice_number, booking_id, customer_id,
          subtotal, cgst_rate, cgst_amount, sgst_rate, sgst_amount,
          igst_rate, igst_amount, total_gst, discount_amount, grand_total,
          payment_status, amount_paid, amount_due, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceId,
          invoiceNumber,
          bookingId,
          booking.customer_id,
          subtotal,
          gstData.cgst_rate,
          gstData.cgst_amount,
          gstData.sgst_rate,
          gstData.sgst_amount,
          gstData.igst_rate,
          gstData.igst_amount,
          gstData.total_gst,
          0,
          grandTotal,
          booking.advance_payment > 0 ? "partial" : "pending",
          booking.advance_payment || 0,
          amountDue,
          createdBy,
        ]
      );

      // Add room charges as invoice item
      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, description, category, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          invoiceId,
          `Room ${booking.room_number} (${booking.room_type}) - ${booking.total_nights} nights`,
          "room",
          booking.total_nights,
          booking.room_rate,
          booking.total_amount,
        ]
      );

      // Add additional items
      for (const item of additionalItems) {
        await connection.execute(
          `INSERT INTO invoice_items (invoice_id, description, category, quantity, unit_price, total_price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            invoiceId,
            item.description,
            item.category || "other",
            item.quantity,
            item.unit_price,
            item.total_price,
          ]
        );
      }

      await connection.commit();

      return this.findByIdWithItems(invoiceId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Create manual invoice (without booking)
   */
  static async create(invoiceData, items, createdBy) {
    const connection = await db.pool.promise().getConnection();

    try {
      await connection.beginTransaction();

      // Calculate subtotal
      let subtotal = items.reduce(
        (sum, item) => sum + parseFloat(item.total_price),
        0
      );

      // Apply discount
      const discount = parseFloat(invoiceData.discount_amount || 0);
      subtotal = subtotal - discount;

      // Calculate GST
      const gstData = calculateGST(subtotal);

      // Calculate grand total
      const grandTotal = subtotal + gstData.total_gst;

      // Create invoice
      const invoiceId = uuidv4();
      const invoiceNumber = generateInvoiceNumber();

      await connection.execute(
        `INSERT INTO invoices (
          id, invoice_number, booking_id, customer_id,
          subtotal, cgst_rate, cgst_amount, sgst_rate, sgst_amount,
          igst_rate, igst_amount, total_gst, discount_amount, grand_total,
          payment_status, amount_paid, amount_due, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceId,
          invoiceNumber,
          invoiceData.booking_id || null,
          invoiceData.customer_id,
          subtotal,
          gstData.cgst_rate,
          gstData.cgst_amount,
          gstData.sgst_rate,
          gstData.sgst_amount,
          gstData.igst_rate,
          gstData.igst_amount,
          gstData.total_gst,
          discount,
          grandTotal,
          "pending",
          0,
          grandTotal,
          createdBy,
        ]
      );

      // Add items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO invoice_items (invoice_id, description, category, quantity, unit_price, total_price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            invoiceId,
            item.description,
            item.category || "other",
            item.quantity,
            item.unit_price,
            item.total_price,
          ]
        );
      }

      await connection.commit();

      return this.findByIdWithItems(invoiceId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update invoice payment status
   */
  //   static async updatePaymentStatus(invoiceId) {
  //     // Get total payments
  //     const [payments] = await db.execute(
  //       "SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE invoice_id = ?",
  //       [invoiceId]
  //     );

  //     const totalPaid = parseFloat(payments[0].total_paid);

  //     // Get invoice
  //     const invoice = await this.findById(invoiceId);
  //     const grandTotal = parseFloat(invoice.grand_total);

  //     let paymentStatus;
  //     if (totalPaid >= grandTotal) {
  //       paymentStatus = "paid";
  //     } else if (totalPaid > 0) {
  //       paymentStatus = "partial";
  //     } else {
  //       paymentStatus = "pending";
  //     }

  //     const amountDue = grandTotal - totalPaid;

  //     await db.execute(
  //       `UPDATE invoices
  //        SET payment_status = ?, amount_paid = ?, amount_due = ?
  //        WHERE id = ?`,
  //       [paymentStatus, totalPaid, amountDue, invoiceId]
  //     );

  //     return this.findById(invoiceId);
  //   }
  /**
   * Update invoice payment status (transaction-safe)
   */
  static async updatePaymentStatus(invoiceId, connection) {
    // 🔒 Lock invoice row first
    const [[invoice]] = await connection.execute(
      "SELECT grand_total FROM invoices WHERE id = ? FOR UPDATE",
      [invoiceId]
    );

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const grandTotal = parseFloat(invoice.grand_total);

    // Get total payments
    const [[paymentRow]] = await connection.execute(
      "SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE invoice_id = ?",
      [invoiceId]
    );

    const totalPaid = parseFloat(paymentRow.total_paid);

    let paymentStatus = "pending";
    if (totalPaid >= grandTotal) paymentStatus = "paid";
    else if (totalPaid > 0) paymentStatus = "partial";

    const amountDue = grandTotal - totalPaid;

    await connection.execute(
      `UPDATE invoices 
     SET payment_status = ?, amount_paid = ?, amount_due = ?
     WHERE id = ?`,
      [paymentStatus, totalPaid, amountDue, invoiceId]
    );

    const [[updatedInvoice]] = await connection.execute(
      "SELECT * FROM invoices WHERE id = ?",
      [invoiceId]
    );

    return updatedInvoice;
  }

  // /**
  //  * Get all invoices
  //  */
  // static async findAll(filters = {}) {
  //   let query = `
  //     SELECT i.*,
  //       c.full_name as customer_name,
  //       c.contact_number as customer_phone,
  //       b.booking_number
  //     FROM invoices i
  //     LEFT JOIN customers c ON i.customer_id = c.id
  //     LEFT JOIN bookings b ON i.booking_id = b.id
  //     WHERE 1=1
  //   `;
  //   const values = [];

  //   if (filters.payment_status) {
  //     query += " AND i.payment_status = ?";
  //     values.push(filters.payment_status);
  //   }

  //   if (filters.customer_id) {
  //     query += " AND i.customer_id = ?";
  //     values.push(filters.customer_id);
  //   }

  //   if (filters.booking_id) {
  //     query += " AND i.booking_id = ?";
  //     values.push(filters.booking_id);
  //   }

  //   if (filters.search) {
  //     query += " AND (i.invoice_number LIKE ? OR c.full_name LIKE ?)";
  //     const searchTerm = `%${filters.search}%`;
  //     values.push(searchTerm, searchTerm);
  //   }

  //   query += " ORDER BY i.created_at DESC";

  //   if (filters.limit && filters.limit > 0) {
  //     query += " LIMIT ?";
  //     values.push(parseInt(filters.limit));

  //     if (filters.offset && filters.offset > 0) {
  //       query += " OFFSET ?";
  //       values.push(parseInt(filters.offset));
  //     }
  //   }

  //   const [rows] = await db.execute(query, values);
  //   return rows;
  // }
  static async findAll(filters = {}) {
    let query = `
    SELECT i.*, 
      c.full_name AS customer_name, 
      c.contact_number AS customer_phone,
      b.booking_number
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    LEFT JOIN bookings b ON i.booking_id = b.id
    WHERE 1=1
  `;

    const values = [];

    if (filters.payment_status) {
      query += " AND i.payment_status = ?";
      values.push(filters.payment_status);
    }

    if (filters.customer_id) {
      query += " AND i.customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.booking_id) {
      query += " AND i.booking_id = ?";
      values.push(filters.booking_id);
    }

    if (filters.search) {
      query += " AND (i.invoice_number LIKE ? OR c.full_name LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    query += " ORDER BY i.created_at DESC";

    // ✅ SAFE pagination (NO placeholders)
    const limit = Number.isInteger(+filters.limit) ? +filters.limit : 10;
    const offset = Number.isInteger(+filters.offset) ? +filters.offset : 0;

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count invoices
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM invoices i WHERE 1=1";
    const values = [];

    if (filters.payment_status) {
      query += " AND i.payment_status = ?";
      values.push(filters.payment_status);
    }

    if (filters.customer_id) {
      query += " AND i.customer_id = ?";
      values.push(filters.customer_id);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }

  /**
   * Get pending invoices
   */
  static async getPendingInvoices() {
    const [rows] = await db.execute(
      `SELECT i.*, 
        c.full_name as customer_name, 
        c.contact_number as customer_phone
       FROM invoices i
       JOIN customers c ON i.customer_id = c.id
       WHERE i.payment_status IN ('pending', 'partial')
       ORDER BY i.created_at DESC`,
      []
    );
    return rows;
  }
}

module.exports = Invoice;
