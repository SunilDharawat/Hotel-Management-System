const db = require("../config/database");

class State {
  /**
   * Get all states
   */
  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM states ORDER BY name");
    return rows;
  }

  /**
   * Find state by ID
   */
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM states WHERE id = ?", [id]);
    return rows[0];
  }

  /**
   * Find state by state code
   */
  static async findByStateCode(code) {
    const [rows] = await db.execute(
      "SELECT * FROM states WHERE state_code = ? OR gst_state_code = ?",
      [code, code],
    );
    return rows[0];
  }
}

module.exports = State;
