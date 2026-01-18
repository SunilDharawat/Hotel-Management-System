const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Notification {
  /**
   * Create new notification
   */
  static async create(notificationData) {
    const id = uuidv4();

    const [result] = await db.execute(
      `INSERT INTO notifications (id, user_id, title, message, type, entity_type, entity_id, is_read, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        notificationData.user_id,
        notificationData.title,
        notificationData.message,
        notificationData.type || "info",
        notificationData.entity_type || null,
        notificationData.entity_id || null,
        notificationData.is_read || false,
        new Date(),
      ]
    );

    return this.findById(id);
  }

  /**
   * Find notification by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, user_id, title, message, type, entity_type, entity_id, is_read, created_at 
       FROM notifications WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  /**
   * Get notifications for a user with pagination
   */
  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT id, user_id, title, message, type, entity_type, entity_id, is_read, created_at 
      FROM notifications 
      WHERE user_id = ?
    `;
    const values = [userId];

    // Add is_read filter if specified
    if (filters.is_read !== undefined) {
      query += " AND is_read = ?";
      values.push(filters.is_read);
    }

    // Add type filter if specified
    if (filters.type) {
      query += " AND type = ?";
      values.push(filters.type);
    }

    // Order by created_at desc and add pagination
    query += " ORDER BY created_at DESC";
    
    const limit = Number.isInteger(filters.limit) ? filters.limit : 20;
    const offset = Number.isInteger(filters.offset) ? filters.offset : 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count unread notifications for a user
   */
  static async countUnread(userId) {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false",
      [userId]
    );
    return rows[0].count;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id) {
    await db.execute(
      "UPDATE notifications SET is_read = true WHERE id = ?",
      [id]
    );
    return this.findById(id);
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    const [result] = await db.execute(
      "UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false",
      [userId]
    );
    return result.affectedRows;
  }

  /**
   * Delete notification
   */
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM notifications WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Create notification for multiple users (bulk)
   */
  static async createBulk(notificationData) {
    const notifications = [];
    
    for (const userId of notificationData.user_ids) {
      const notification = await this.create({
        ...notificationData,
        user_id: userId,
      });
      notifications.push(notification);
    }
    
    return notifications;
  }

  /**
   * Get recent notifications for dashboard
   */
  static async getRecent(userId, limit = 5) {
    const [rows] = await db.execute(
      `SELECT id, user_id, title, message, type, entity_type, entity_id, is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  /**
   * Clean up old notifications (older than 30 days)
   */
  static async cleanupOld() {
    const [result] = await db.execute(
      "DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );
    return result.affectedRows;
  }
}

module.exports = Notification;