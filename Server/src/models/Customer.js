const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Customer {
  /**
   * Find customer by ID
   */
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM customers WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  /**
   * Find customer by contact number
   */
  static async findByContact(contactNumber) {
    const [rows] = await db.execute(
      "SELECT * FROM customers WHERE contact_number = ?",
      [contactNumber]
    );
    return rows[0];
  }

  /**
   * Find customer by ID proof
   */
  static async findByIdProof(idProofType, idProofNumber) {
    const [rows] = await db.execute(
      "SELECT * FROM customers WHERE id_proof_type = ? AND id_proof_number = ?",
      [idProofType, idProofNumber]
    );
    return rows[0];
  }

  /**
   * Create new customer
   */
  static async create(customerData) {
    const id = uuidv4();

    const [result] = await db.execute(
      `INSERT INTO customers (
        id, full_name, contact_number, email, id_proof_type, 
        id_proof_number, address, date_of_birth, gender, preferences, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        customerData.full_name,
        customerData.contact_number,
        customerData.email || null,
        customerData.id_proof_type,
        customerData.id_proof_number,
        customerData.address || null,
        customerData.date_of_birth || null,
        customerData.gender || null,
        customerData.preferences
          ? JSON.stringify(customerData.preferences)
          : null,
        customerData.notes || null,
      ]
    );

    return this.findById(id);
  }

  /**
   * Update customer
   */
  static async update(id, customerData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      "full_name",
      "contact_number",
      "email",
      "id_proof_type",
      "id_proof_number",
      "address",
      "date_of_birth",
      "gender",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (customerData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(customerData[field]);
      }
    });

    if (customerData.preferences !== undefined) {
      updates.push("preferences = ?");
      values.push(JSON.stringify(customerData.preferences));
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.execute(
      `UPDATE customers SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Delete customer
   */
  static async delete(id) {
    await db.execute("DELETE FROM customers WHERE id = ?", [id]);
    return true;
  }

  /**
   * Get all customers with pagination and filters
   */
  // static async findAll(filters = {}) {
  //   let query = "SELECT * FROM customers WHERE 1=1";
  //   const values = [];

  //   if (filters.search) {
  //     query +=
  //       " AND (full_name LIKE ? OR contact_number LIKE ? OR email LIKE ?)";
  //     const searchTerm = `%${filters.search}%`;
  //     values.push(searchTerm, searchTerm, searchTerm);
  //   }

  //   if (filters.gender) {
  //     query += " AND gender = ?";
  //     values.push(filters.gender);
  //   }

  //   query += " ORDER BY created_at DESC";

  //   if (filters.limit && filters.limit > 0) {
  //     query += " LIMIT ?";
  //     values.push(parseInt(filters.limit));

  //     if (filters.offset && filters.offset > 0) {
  //       query += " OFFSET ?";
  //       values.push(parseInt(filters.offset));
  //     }
  //   }

  //   const [rows] = await db.execute(query, values);

  //   // Parse preferences JSON
  //   return rows.map((row) => ({
  //     ...row,
  //     preferences: row.preferences ? JSON.parse(row.preferences) : {},
  //   }));
  // }

  static async findAll(filters = {}) {
    let query = "SELECT * FROM customers WHERE 1=1";
    const values = [];

    if (filters.search) {
      query +=
        " AND (full_name LIKE ? OR contact_number LIKE ? OR email LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.gender) {
      query += " AND gender = ?";
      values.push(filters.gender);
    }

    query += " ORDER BY created_at DESC";

    // ✅ SAFE numeric pagination
    const limit = Number.isInteger(filters.limit) ? filters.limit : 10;
    const offset = Number.isInteger(filters.offset) ? filters.offset : 0;

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);

    return rows.map((row) => ({
      ...row,
      preferences:
        typeof row.preferences === "string"
          ? JSON.parse(row.preferences)
          : row.preferences || {},
    }));
  }

  /**
   * Count total customers
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM customers WHERE 1=1";
    const values = [];

    if (filters.search) {
      query +=
        " AND (full_name LIKE ? OR contact_number LIKE ? OR email LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.gender) {
      query += " AND gender = ?";
      values.push(filters.gender);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }

  /**
   * Update customer stats (total stays and spending)
   */
  static async updateStats(
    customerId,
    additionalStays = 1,
    additionalSpent = 0
  ) {
    await db.execute(
      `UPDATE customers 
       SET total_stays = total_stays + ?, 
           total_spent = total_spent + ?
       WHERE id = ?`,
      [additionalStays, additionalSpent, customerId]
    );
  }

  /**
   * Get customer booking history
   */
  static async getBookingHistory(customerId) {
    const [rows] = await db.execute(
      `SELECT 
        b.id, b.booking_number, b.check_in_date, b.check_out_date,
        b.status, b.total_amount, r.room_number, r.type as room_type
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.customer_id = ?
       ORDER BY b.created_at DESC`,
      [customerId]
    );
    return rows;
  }
}

module.exports = Customer;
