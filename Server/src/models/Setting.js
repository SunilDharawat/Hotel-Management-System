const db = require("../config/database");

class Setting {
  /**
   * Get all settings
   */
  static async getAll() {
    const [rows] = await db.execute(
      "SELECT * FROM hotel_settings ORDER BY setting_key"
    );

    // Parse JSON values
    return rows.map((row) => ({
      ...row,
      setting_value:
        typeof row.setting_value === "string"
          ? JSON.parse(row.setting_value)
          : row.setting_value,
    }));
  }

  /**
   * Get setting by key
   */
  static async getByKey(key) {
    const [rows] = await db.execute(
      "SELECT * FROM hotel_settings WHERE setting_key = ?",
      [key]
    );

    if (rows.length === 0) return null;

    return {
      ...rows[0],
      setting_value:
        typeof rows[0].setting_value === "string"
          ? JSON.parse(rows[0].setting_value)
          : rows[0].setting_value,
    };
  }

  /**
   * Update setting
   */
  static async update(key, value, updatedBy) {
    const [result] = await db.execute(
      `UPDATE hotel_settings 
       SET setting_value = ?, updated_by = ?, updated_at = NOW()
       WHERE setting_key = ?`,
      [JSON.stringify(value), updatedBy, key]
    );

    if (result.affectedRows === 0) {
      throw new Error("Setting not found");
    }

    return this.getByKey(key);
  }

  /**
   * Create new setting
   */
  static async create(settingData, createdBy) {
    const [result] = await db.execute(
      `INSERT INTO hotel_settings (setting_key, setting_value, description, updated_by)
       VALUES (?, ?, ?, ?)`,
      [
        settingData.setting_key,
        JSON.stringify(settingData.setting_value),
        settingData.description || null,
        createdBy,
      ]
    );

    return this.getByKey(settingData.setting_key);
  }

  /**
   * Delete setting
   */
  static async delete(key) {
    const [result] = await db.execute(
      "DELETE FROM hotel_settings WHERE setting_key = ?",
      [key]
    );

    if (result.affectedRows === 0) {
      throw new Error("Setting not found");
    }

    return true;
  }

  /**
   * Get settings as key-value object
   */
  static async getAllAsObject() {
    const settings = await this.getAll();

    return settings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});
  }

  /**
   * Update multiple settings at once
   */
  static async updateMultiple(updates, updatedBy) {
    const connection = await db.pool.promise().getConnection();

    try {
      await connection.beginTransaction();

      for (const [key, value] of Object.entries(updates)) {
        await connection.execute(
          `UPDATE hotel_settings 
           SET setting_value = ?, updated_by = ?, updated_at = NOW()
           WHERE setting_key = ?`,
          [JSON.stringify(value), updatedBy, key]
        );
      }

      await connection.commit();

      return this.getAllAsObject();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Reset settings to default
   */
  static async resetToDefaults(updatedBy) {
    const defaults = {
      general: {
        name: "Vrindavan Palace",
        address: "123 Main Street, City",
        phone: "+91-9876543210",
        email: "info@vrindavanpalace.com",
        gst_number: "29ABCDE1234F1Z5",
      },
      gst_rates: {
        cgst: 6,
        sgst: 6,
        igst: 12,
      },
      room_pricing: {
        single: 2500,
        double: 4000,
        suite: 7500,
        deluxe: 10000,
      },
      policies: {
        cancellation_hours: 24,
        late_checkout_charge: 500,
        early_checkout_refund_percent: 10,
      },
      currency: {
        code: "INR",
        symbol: "₹",
        format: "en-IN",
      },
    };

    return this.updateMultiple(defaults, updatedBy);
  }
}

module.exports = Setting;
