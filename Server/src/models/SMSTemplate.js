const db = require("../config/database");

class SMSTemplate {
  /**
   * Find template by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM sms_templates WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  /**
   * Find template by type
   */
  static async findByType(type) {
    const [rows] = await db.execute(
      "SELECT * FROM sms_templates WHERE type = ? AND is_active = TRUE",
      [type]
    );
    return rows[0];
  }

  /**
   * Get all templates
   */
  static async findAll(filters = {}) {
    let query = "SELECT * FROM sms_templates WHERE 1=1";
    const values = [];

    if (filters.type) {
      query += " AND type = ?";
      values.push(filters.type);
    }

    if (filters.is_active !== undefined) {
      query += " AND is_active = ?";
      values.push(filters.is_active);
    }

    query += " ORDER BY type, name";

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Create template
   */
  static async create(templateData) {
    const [result] = await db.execute(
      `INSERT INTO sms_templates (type, name, content, is_active)
       VALUES (?, ?, ?, ?)`,
      [
        templateData.type,
        templateData.name,
        templateData.content,
        templateData.is_active !== undefined ? templateData.is_active : true,
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Update template
   */
  static async update(id, templateData) {
    const updates = [];
    const values = [];

    if (templateData.name !== undefined) {
      updates.push("name = ?");
      values.push(templateData.name);
    }

    if (templateData.content !== undefined) {
      updates.push("content = ?");
      values.push(templateData.content);
    }

    if (templateData.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(templateData.is_active);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.execute(
      `UPDATE sms_templates SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Delete template
   */
  static async delete(id) {
    await db.execute("DELETE FROM sms_templates WHERE id = ?", [id]);
    return true;
  }

  /**
   * Parse template with variables
   */
  static parseTemplate(template, variables) {
    let content = template.content;

    // Replace variables in format {{variable_name}}
    Object.keys(variables).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      content = content.replace(placeholder, variables[key]);
    });

    return content;
  }
}

module.exports = SMSTemplate;
