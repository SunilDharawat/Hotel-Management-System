const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class SMS {
  /**
   * Find SMS by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT s.*, c.full_name as customer_name, u.name as created_by_name
       FROM sms_messages s
       LEFT JOIN customers c ON s.customer_id = c.id
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0];
  }

  /**
   * Create SMS message
   */
  static async create(smsData, createdBy = null) {
    const id = uuidv4();

    const [result] = await db.execute(
      `INSERT INTO sms_messages (
        id, customer_id, phone_number, message_type, content,
        status, provider_message_id, error_message, sent_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        smsData.customer_id || null,
        smsData.phone_number,
        smsData.message_type,
        smsData.content,
        smsData.status || "pending",
        smsData.provider_message_id || null,
        smsData.error_message || null,
        smsData.status === "sent" ? new Date() : null,
        createdBy,
      ]
    );

    return this.findById(id);
  }

  /**
   * Update SMS status
   */
  static async updateStatus(
    id,
    status,
    providerMessageId = null,
    errorMessage = null
  ) {
    await db.execute(
      `UPDATE sms_messages 
       SET status = ?, 
           provider_message_id = ?,
           error_message = ?,
           sent_at = ?
       WHERE id = ?`,
      [
        status,
        providerMessageId,
        errorMessage,
        status === "sent" ? new Date() : null,
        id,
      ]
    );

    return this.findById(id);
  }

  /**
   * Get all SMS messages
   */
  // static async findAll(filters = {}) {
  //   let query = `
  //     SELECT s.*, c.full_name as customer_name, u.name as created_by_name
  //     FROM sms_messages s
  //     LEFT JOIN customers c ON s.customer_id = c.id
  //     LEFT JOIN users u ON s.created_by = u.id
  //     WHERE 1=1
  //   `;
  //   const values = [];

  //   if (filters.customer_id) {
  //     query += " AND s.customer_id = ?";
  //     values.push(filters.customer_id);
  //   }

  //   if (filters.message_type) {
  //     query += " AND s.message_type = ?";
  //     values.push(filters.message_type);
  //   }

  //   if (filters.status) {
  //     query += " AND s.status = ?";
  //     values.push(filters.status);
  //   }

  //   if (filters.phone_number) {
  //     query += " AND s.phone_number LIKE ?";
  //     values.push(`%${filters.phone_number}%`);
  //   }

  //   if (filters.start_date) {
  //     query += " AND DATE(s.created_at) >= ?";
  //     values.push(filters.start_date);
  //   }

  //   if (filters.end_date) {
  //     query += " AND DATE(s.created_at) <= ?";
  //     values.push(filters.end_date);
  //   }

  //   query += " ORDER BY s.created_at DESC";

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
    SELECT s.*, c.full_name as customer_name, u.name as created_by_name
    FROM sms_messages s
    LEFT JOIN customers c ON s.customer_id = c.id
    LEFT JOIN users u ON s.created_by = u.id
    WHERE 1=1
  `;
    const values = [];

    if (filters.customer_id) {
      query += " AND s.customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.message_type) {
      query += " AND s.message_type = ?";
      values.push(filters.message_type);
    }

    if (filters.status) {
      query += " AND s.status = ?";
      values.push(filters.status);
    }

    if (filters.phone_number) {
      query += " AND s.phone_number LIKE ?";
      values.push(`%${filters.phone_number}%`);
    }

    if (filters.start_date) {
      query += " AND DATE(s.created_at) >= ?";
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += " AND DATE(s.created_at) <= ?";
      values.push(filters.end_date);
    }

    query += " ORDER BY s.created_at DESC";

    // FIX: Check if limit exists AND is greater than 0
    const limit = parseInt(filters.limit);
    const offset = parseInt(filters.offset);

    if (limit && limit > 0) {
      query += " LIMIT ?";
      values.push(limit);

      if (offset && offset > 0) {
        query += " OFFSET ?";
        values.push(offset);
      }
    }

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count SMS messages
   */
  // static async count(filters = {}) {
  //   let query = "SELECT COUNT(*) as total FROM sms_messages WHERE 1=1";
  //   const values = [];

  //   if (filters.customer_id) {
  //     query += " AND customer_id = ?";
  //     values.push(filters.customer_id);
  //   }

  //   if (filters.message_type) {
  //     query += " AND message_type = ?";
  //     values.push(filters.message_type);
  //   }

  //   if (filters.status) {
  //     query += " AND status = ?";
  //     values.push(filters.status);
  //   }

  //   const [rows] = await db.execute(query, values);
  //   return rows[0].total;
  // }

  /**
   * Count SMS messages
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM sms_messages WHERE 1=1";
    const values = [];

    // Only add filters if they have actual values
    if (filters.customer_id) {
      query += " AND customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.message_type) {
      query += " AND message_type = ?";
      values.push(filters.message_type);
    }

    if (filters.status) {
      query += " AND status = ?";
      values.push(filters.status);
    }

    // Don't add search filters here
    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }

  /**
   * Get SMS statistics
   */
  static async getStats(startDate = null, endDate = null) {
    let query = `
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        message_type,
        COUNT(*) as type_count
      FROM sms_messages
      WHERE 1=1
    `;
    const values = [];

    if (startDate) {
      query += " AND DATE(created_at) >= ?";
      values.push(startDate);
    }

    if (endDate) {
      query += " AND DATE(created_at) <= ?";
      values.push(endDate);
    }

    query += " GROUP BY message_type";

    const [rows] = await db.execute(query, values);

    // Get overall stats
    const [overall] = await db.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM sms_messages
       WHERE ${startDate ? "DATE(created_at) >= ?" : "1=1"}
       ${endDate ? "AND DATE(created_at) <= ?" : ""}`,
      values
    );

    return {
      overall: overall[0],
      by_type: rows,
    };
  }

  /**
   * Get recent SMS for customer
   */
  static async getByCustomer(customerId, limit = 10) {
    const [rows] = await db.execute(
      `SELECT * FROM sms_messages 
       WHERE customer_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [customerId, limit]
    );
    return rows;
  }

  /**
   * Delete SMS message
   */
  static async delete(id) {
    await db.execute("DELETE FROM sms_messages WHERE id = ?", [id]);
    return true;
  }
}

module.exports = SMS;
