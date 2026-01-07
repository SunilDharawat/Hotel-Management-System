const db = require("../config/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

class User {
  /**
   * Find user by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, username, password_hash, name, email, phone, role, is_active, last_login, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [result] = await db.execute(
      `INSERT INTO users (id, username, password_hash, name, email, phone, role, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.username,
        hashedPassword,
        userData.name,
        userData.email,
        userData.phone || null,
        userData.role || "receptionist",
        userData.is_active !== undefined ? userData.is_active : true,
      ]
    );

    return this.findById(id);
  }

  /**
   * Update user
   */
  static async update(id, userData) {
    const updates = [];
    const values = [];

    if (userData.name) {
      updates.push("name = ?");
      values.push(userData.name);
    }
    if (userData.email) {
      updates.push("email = ?");
      values.push(userData.email);
    }
    if (userData.phone !== undefined) {
      updates.push("phone = ?");
      values.push(userData.phone);
    }
    if (userData.role) {
      updates.push("role = ?");
      values.push(userData.role);
    }
    if (userData.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(userData.is_active);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updates.push("password_hash = ?");
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Delete user (soft delete by setting is_active = false)
   */
  static async delete(id) {
    await db.execute("UPDATE users SET is_active = false WHERE id = ?", [id]);
    return true;
  }

  /**
   * Get all users with pagination
   */
  // static async findAll(filters = {}) {
  //   let query = `
  //     SELECT id, username, name, email, phone, role, is_active, last_login, created_at
  //     FROM users WHERE 1=1
  //   `;
  //   const values = [];

  //   // Only add filters if they have actual values
  //   if (filters.role) {
  //     query += " AND role = ?";
  //     values.push(filters.role);
  //   }

  //   if (filters.is_active !== undefined && filters.is_active !== null) {
  //     query += " AND is_active = ?";
  //     values.push(filters.is_active);
  //   }

  //   if (filters.search) {
  //     query += " AND (name LIKE ? OR email LIKE ? OR username LIKE ?)";
  //     const searchTerm = `%${filters.search}%`;
  //     values.push(searchTerm, searchTerm, searchTerm);
  //   }

  //   query += " ORDER BY created_at DESC";

  //   // Add pagination only if limit is provided
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
    SELECT id, username, name, email, phone, role, is_active, last_login, created_at
    FROM users
    WHERE 1=1
  `;
    const values = [];

    if (filters.role) {
      query += " AND role = ?";
      values.push(filters.role);
    }

    if (filters.is_active !== undefined && filters.is_active !== null) {
      query += " AND is_active = ?";
      values.push(filters.is_active);
    }

    if (filters.search) {
      query += " AND (name LIKE ? OR email LIKE ? OR username LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC";

    // ✅ FIXED PAGINATION
    const limit = Number.isInteger(filters.limit) ? filters.limit : 10;
    const offset = Number.isInteger(filters.offset) ? filters.offset : 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count total users
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const values = [];

    if (filters.role) {
      query += " AND role = ?";
      values.push(filters.role);
    }

    if (filters.is_active !== undefined && filters.is_active !== null) {
      query += " AND is_active = ?";
      values.push(filters.is_active);
    }

    if (filters.search) {
      query += " AND (name LIKE ? OR email LIKE ? OR username LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }
  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id) {
    await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [id]);
  }
}

module.exports = User;
