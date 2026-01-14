const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { generateBookingNumber, calculateNights } = require("../utils/helper");

class Booking {
  /**
   * Find booking by ID
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT b.*, 
        c.full_name as customer_name, c.contact_number as customer_phone,
        r.room_number, r.type as room_type,
        u.name as created_by_name
       FROM bookings b
       LEFT JOIN customers c ON b.customer_id = c.id
       LEFT JOIN rooms r ON b.room_id = r.id
       LEFT JOIN users u ON b.created_by = u.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  /**
   * Find booking by booking number
   */
  static async findByBookingNumber(bookingNumber) {
    const [rows] = await db.execute(
      `SELECT b.*, 
        c.full_name as customer_name, c.contact_number as customer_phone,
        r.room_number, r.type as room_type
       FROM bookings b
       LEFT JOIN customers c ON b.customer_id = c.id
       LEFT JOIN rooms r ON b.room_id = r.id
       WHERE b.booking_number = ?`,
      [bookingNumber]
    );
    return rows[0];
  }

  /**
   * Check if room is available for dates
   */
  static async checkAvailability(
    roomId,
    checkInDate,
    checkOutDate,
    excludeBookingId = null
  ) {
    let query = `
      SELECT COUNT(*) as count FROM bookings
      WHERE room_id = ?
      AND status NOT IN ('cancelled', 'checked_out')
      AND (
        (? BETWEEN check_in_date AND check_out_date - INTERVAL 1 DAY)
        OR (? - INTERVAL 1 DAY BETWEEN check_in_date AND check_out_date - INTERVAL 1 DAY)
        OR (check_in_date BETWEEN ? AND ? - INTERVAL 1 DAY)
      )
    `;
    const values = [
      roomId,
      checkInDate,
      checkOutDate,
      checkInDate,
      checkOutDate,
    ];

    if (excludeBookingId) {
      query += " AND id != ?";
      values.push(excludeBookingId);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].count === 0;
  }

  /**
   * Create new booking
   */
  static async create(bookingData, createdBy) {
    const id = uuidv4();
    const bookingNumber = generateBookingNumber();
    const totalNights = calculateNights(
      bookingData.check_in_date,
      bookingData.check_out_date
    );
    const totalAmount = bookingData.room_rate * totalNights;

    // Check availability before creating
    const isAvailable = await this.checkAvailability(
      bookingData.room_id,
      bookingData.check_in_date,
      bookingData.check_out_date
    );

    if (!isAvailable) {
      throw new Error("Room is not available for the selected dates");
    }

    const [result] = await db.execute(
      `INSERT INTO bookings (
        id, booking_number, customer_id, room_id, 
        check_in_date, check_out_date, number_of_guests, special_requests,
        room_rate, total_nights, total_amount, advance_payment, 
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        bookingNumber,
        bookingData.customer_id,
        bookingData.room_id,
        bookingData.check_in_date,
        bookingData.check_out_date,
        bookingData.number_of_guests || 1,
        bookingData.special_requests || null,
        bookingData.room_rate,
        totalNights,
        totalAmount,
        bookingData.advance_payment || 0,
        bookingData.status || "pending",
        createdBy,
      ]
    );

    // Update room status to reserved
    await db.execute("UPDATE rooms SET status = ? WHERE id = ?", [
      "reserved",
      bookingData.room_id,
    ]);

    return this.findById(id);
  }

  /**
   * Update booking
   */
  static async update(id, bookingData) {
    const updates = [];
    const values = [];

    // If dates or room changed, check availability
    if (
      bookingData.room_id ||
      bookingData.check_in_date ||
      bookingData.check_out_date
    ) {
      const currentBooking = await this.findById(id);

      const roomId = bookingData.room_id || currentBooking.room_id;
      const checkIn = bookingData.check_in_date || currentBooking.check_in_date;
      const checkOut =
        bookingData.check_out_date || currentBooking.check_out_date;

      const isAvailable = await this.checkAvailability(
        roomId,
        checkIn,
        checkOut,
        id
      );
      if (!isAvailable) {
        throw new Error("Room is not available for the selected dates");
      }
    }

    const allowedFields = [
      "customer_id",
      "room_id",
      "check_in_date",
      "check_out_date",
      "number_of_guests",
      "special_requests",
      "room_rate",
      "advance_payment",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (bookingData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(bookingData[field]);
      }
    });

    // Recalculate if dates or rate changed
    if (
      bookingData.check_in_date ||
      bookingData.check_out_date ||
      bookingData.room_rate
    ) {
      const currentBooking = await this.findById(id);
      const checkIn = bookingData.check_in_date || currentBooking.check_in_date;
      const checkOut =
        bookingData.check_out_date || currentBooking.check_out_date;
      const rate = bookingData.room_rate || currentBooking.room_rate;

      const totalNights = calculateNights(checkIn, checkOut);
      const totalAmount = rate * totalNights;

      updates.push("total_nights = ?", "total_amount = ?");
      values.push(totalNights, totalAmount);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.execute(
      `UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Cancel booking
   */
  static async cancel(id, reason, cancelledBy) {
    const booking = await this.findById(id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "checked_in") {
      throw new Error("Cannot cancel a checked-in booking");
    }

    if (booking.status === "checked_out") {
      throw new Error("Cannot cancel a completed booking");
    }

    await db.execute(
      `UPDATE bookings 
       SET status = 'cancelled', 
           cancellation_reason = ?, 
           cancelled_at = NOW(), 
           cancelled_by = ?
       WHERE id = ?`,
      [reason, cancelledBy, id]
    );

    // Update room status back to available
    await db.execute("UPDATE rooms SET status = ? WHERE id = ?", [
      "available",
      booking.room_id,
    ]);

    return this.findById(id);
  }

  /**
   * Check-in
   */
  static async checkIn(id) {
    const booking = await this.findById(id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new Error("Cannot check-in a cancelled booking");
    }

    if (booking.status === "checked_in") {
      throw new Error("Booking already checked in");
    }

    await db.execute(
      `UPDATE bookings 
       SET status = 'checked_in', actual_check_in = NOW()
       WHERE id = ?`,
      [id]
    );

    // Update room status to occupied
    await db.execute("UPDATE rooms SET status = ? WHERE id = ?", [
      "occupied",
      booking.room_id,
    ]);

    return this.findById(id);
  }

  /**
   * Check-out
   */
  static async checkOut(id) {
    const booking = await this.findById(id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "checked_in") {
      throw new Error("Booking must be checked in before checkout");
    }

    await db.execute(
      `UPDATE bookings 
       SET status = 'checked_out', actual_check_out = NOW()
       WHERE id = ?`,
      [id]
    );

    // Update room status to cleaning
    await db.execute(
      "UPDATE rooms SET status = ?, housekeeping_status = ? WHERE id = ?",
      ["cleaning", "dirty", booking.room_id]
    );

    // Update customer stats
    await db.execute(
      `UPDATE customers 
       SET total_stays = total_stays + 1, 
           total_spent = total_spent + ?
       WHERE id = ?`,
      [booking.total_amount, booking.customer_id]
    );

    return this.findById(id);
  }

  /**
   * Get all bookings with filters
   */
  // static async findAll(filters = {}) {
  //   let query = `
  //     SELECT b.*,
  //       c.full_name as customer_name, c.contact_number as customer_phone,
  //       r.room_number, r.type as room_type
  //     FROM bookings b
  //     LEFT JOIN customers c ON b.customer_id = c.id
  //     LEFT JOIN rooms r ON b.room_id = r.id
  //     WHERE 1=1
  //   `;
  //   const values = [];

  //   if (filters.status) {
  //     query += " AND b.status = ?";
  //     values.push(filters.status);
  //   }

  //   if (filters.customer_id) {
  //     query += " AND b.customer_id = ?";
  //     values.push(filters.customer_id);
  //   }

  //   if (filters.room_id) {
  //     query += " AND b.room_id = ?";
  //     values.push(filters.room_id);
  //   }

  //   if (filters.check_in_date) {
  //     query += " AND b.check_in_date = ?";
  //     values.push(filters.check_in_date);
  //   }

  //   if (filters.search) {
  //     query +=
  //       " AND (b.booking_number LIKE ? OR c.full_name LIKE ? OR r.room_number LIKE ?)";
  //     const searchTerm = `%${filters.search}%`;
  //     values.push(searchTerm, searchTerm, searchTerm);
  //   }

  //   query += " ORDER BY b.created_at DESC";

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
    SELECT b.*, 
      c.full_name as customer_name, c.contact_number as customer_phone,
      r.room_number, r.type as room_type
    FROM bookings b
    LEFT JOIN customers c ON b.customer_id = c.id
    LEFT JOIN rooms r ON b.room_id = r.id
    WHERE 1=1
  `;
    const values = [];

    if (filters.status) {
      query += " AND b.status = ?";
      values.push(filters.status);
    }

    if (filters.customer_id) {
      query += " AND b.customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.room_id) {
      query += " AND b.room_id = ?";
      values.push(filters.room_id);
    }

    if (filters.check_in_date) {
      query += " AND b.check_in_date = ?";
      values.push(filters.check_in_date);
    }

    if (filters.search) {
      query +=
        " AND (b.booking_number LIKE ? OR c.full_name LIKE ? OR r.room_number LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY b.created_at DESC";

    // ✅ FIXED PAGINATION
    const limit = Number.isInteger(filters.limit) ? filters.limit : 10;
    const offset = Number.isInteger(filters.offset) ? filters.offset : 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);
    return rows;
  }

  /**
   * Count bookings
   */
  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM bookings b WHERE 1=1";
    const values = [];

    if (filters.status) {
      query += " AND b.status = ?";
      values.push(filters.status);
    }

    if (filters.customer_id) {
      query += " AND b.customer_id = ?";
      values.push(filters.customer_id);
    }

    if (filters.room_id) {
      query += " AND b.room_id = ?";
      values.push(filters.room_id);
    }

    const [rows] = await db.execute(query, values);
    return rows[0].total;
  }

  /**
   * Get today's check-ins
   */
  static async getTodayCheckIns() {
    const [rows] = await db.execute(
      `SELECT b.*, 
        c.full_name as customer_name, c.contact_number as customer_phone,
        r.room_number, r.type as room_type
       FROM bookings b
       JOIN customers c ON b.customer_id = c.id
       JOIN rooms r ON b.room_id = r.id
       WHERE DATE(b.check_in_date) = CURDATE()
       AND b.status IN ('confirmed', 'pending')
       ORDER BY b.check_in_date`,
      []
    );
    return rows;
  }

  /**
   * Get today's check-outs
   */
  static async getTodayCheckOuts() {
    const [rows] = await db.execute(
      `SELECT b.*, 
        c.full_name as customer_name, c.contact_number as customer_phone,
        r.room_number, r.type as room_type
       FROM bookings b
       JOIN customers c ON b.customer_id = c.id
       JOIN rooms r ON b.room_id = r.id
       WHERE DATE(b.check_out_date) = CURDATE()
       AND b.status = 'checked_in'
       ORDER BY b.check_out_date`,
      []
    );
    return rows;
  }
}

module.exports = Booking;
