const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Room {
  /**
   * Find room by ID
   */
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM rooms WHERE id = ?", [id]);
    return rows[0];
  }

  /**
   * Find room by room number
   */
  static async findByRoomNumber(roomNumber) {
    const [rows] = await db.execute(
      "SELECT * FROM rooms WHERE room_number = ?",
      [roomNumber]
    );
    return rows[0];
  }

  /**
   * Create new room
   */
  static async create(roomData) {
    const id = uuidv4();

    const [result] = await db.execute(
      `INSERT INTO rooms (
        id, room_number, type, floor, base_price, max_occupancy,
        size_sqft, view_type, status, housekeeping_status, description, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        roomData.room_number,
        roomData.type,
        roomData.floor,
        roomData.base_price,
        roomData.max_occupancy || 2,
        roomData.size_sqft || null,
        roomData.view_type || null,
        roomData.status || "available",
        roomData.housekeeping_status || "clean",
        roomData.description || null,
        roomData.is_active !== undefined ? roomData.is_active : true,
      ]
    );

    return this.findById(id);
  }

  /**
   * Update room
   */
  static async update(id, roomData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      "room_number",
      "type",
      "floor",
      "base_price",
      "max_occupancy",
      "size_sqft",
      "view_type",
      "status",
      "housekeeping_status",
      "description",
      "is_active",
    ];

    allowedFields.forEach((field) => {
      if (roomData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(roomData[field]);
      }
    });

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.execute(
      `UPDATE rooms SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Delete room
   */
  static async delete(id) {
    await db.execute("UPDATE rooms SET is_active = false WHERE id = ?", [id]);
    return true;
  }

  /**
   * Get all rooms with filters
   */
  // static async findAll(filters = {}) {
  //   let query = "SELECT * FROM rooms WHERE 1=1";
  //   const values = [];

  //   if (filters.type) {
  //     query += " AND type = ?";
  //     values.push(filters.type);
  //   }

  //   if (filters.status) {
  //     query += " AND status = ?";
  //     values.push(filters.status);
  //   }

  //   if (filters.floor !== undefined && filters.floor !== null) {
  //     query += " AND floor = ?";
  //     values.push(filters.floor);
  //   }

  //   if (filters.is_active !== undefined && filters.is_active !== null) {
  //     query += " AND is_active = ?";
  //     values.push(filters.is_active);
  //   }

  //   if (filters.search) {
  //     query += " AND (room_number LIKE ? OR description LIKE ?)";
  //     const searchTerm = `%${filters.search}%`;
  //     values.push(searchTerm, searchTerm);
  //   }

  //   query += " ORDER BY room_number ASC";

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
    let query = "SELECT * FROM rooms WHERE 1=1";
    const values = [];

    if (filters.type) {
      query += " AND type = ?";
      values.push(filters.type);
    }

    if (filters.status) {
      query += " AND status = ?";
      values.push(filters.status);
    }

    if (filters.floor !== undefined && filters.floor !== null) {
      query += " AND floor = ?";
      values.push(filters.floor);
    }

    if (filters.is_active !== undefined && filters.is_active !== null) {
      query += " AND is_active = ?";
      values.push(filters.is_active);
    }

    if (filters.search) {
      query += " AND (room_number LIKE ? OR description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    query += " ORDER BY room_number ASC";

    // ✅ FIXED PAGINATION
    const limit = Number.isInteger(filters.limit) ? filters.limit : 10;
    const offset = Number.isInteger(filters.offset) ? filters.offset : 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count total rooms
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM rooms WHERE 1=1";
    const values = [];

    if (filters.type) {
      query += " AND type = ?";
      values.push(filters.type);
    }

    if (filters.status) {
      query += " AND status = ?";
      values.push(filters.status);
    }

    if (filters.floor !== undefined && filters.floor !== null) {
      query += " AND floor = ?";
      values.push(filters.floor);
    }

    if (filters.is_active !== undefined && filters.is_active !== null) {
      query += " AND is_active = ?";
      values.push(filters.is_active);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }

  /**
   * Get room with amenities
   */
  static async findByIdWithAmenities(id) {
    const room = await this.findById(id);
    if (!room) return null;

    const [amenities] = await db.execute(
      `SELECT a.* FROM amenities a
       JOIN room_amenities ra ON a.id = ra.amenity_id
       WHERE ra.room_id = ?`,
      [id]
    );

    room.amenities = amenities;
    return room;
  }

  /**
   * Add amenity to room
   */
  static async addAmenity(roomId, amenityId) {
    await db.execute(
      "INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)",
      [roomId, amenityId]
    );
  }

  /**
   * Remove amenity from room
   */
  static async removeAmenity(roomId, amenityId) {
    await db.execute(
      "DELETE FROM room_amenities WHERE room_id = ? AND amenity_id = ?",
      [roomId, amenityId]
    );
  }

  /**
   * Get available rooms for date range
   */
  static async getAvailableRooms(checkInDate, checkOutDate, roomType = null) {
    let query = `
      SELECT * FROM rooms 
      WHERE is_active = true
      AND status NOT IN ('maintenance')
    `;
    const values = [];

    if (roomType) {
      query += " AND type = ?";
      values.push(roomType);
    }

    query += ` AND id NOT IN (
      SELECT room_id FROM bookings
      WHERE status NOT IN ('cancelled', 'checked_out')
      AND (
        (? BETWEEN check_in_date AND check_out_date - INTERVAL 1 DAY)
        OR (? - INTERVAL 1 DAY BETWEEN check_in_date AND check_out_date - INTERVAL 1 DAY)
        OR (check_in_date BETWEEN ? AND ? - INTERVAL 1 DAY)
      )
    )`;

    values.push(checkInDate, checkOutDate, checkInDate, checkOutDate);

    query += " ORDER BY type, room_number";

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Update room status
   */
  static async updateStatus(id, status) {
    await db.execute("UPDATE rooms SET status = ? WHERE id = ?", [status, id]);
    return this.findById(id);
  }

/**
   * Update housekeeping status
   */
  static async updateHousekeepingStatus(id, status) {
    await db.execute("UPDATE rooms SET housekeeping_status = ? WHERE id = ?", [
      status,
      id,
    ]);
    return this.findById(id);
  }

  /**
   * Get all rooms
   */
  static async getAll() {
    const [rows] = await db.execute(
      "SELECT * FROM rooms ORDER BY type, room_number"
    );
    return rows;
  }
}

module.exports = Room;
