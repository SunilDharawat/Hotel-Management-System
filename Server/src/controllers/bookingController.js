const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Customer = require("../models/Customer");
const ApiResponse = require("../utils/response");
const NotificationService = require("../services/NotificationService");

/**
 * Get all bookings
 */
const getAllBookings = async (req, res, next) => {
  try {
    const {
      status,
      customer_id,
      room_id,
      check_in_date,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      status,
      customer_id,
      room_id,
      check_in_date,
      search,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const bookings = await Booking.findAll(filters);
    const total = await Booking.count({ status, customer_id, room_id });

    ApiResponse.success(res, {
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    ApiResponse.success(res, booking);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new booking
 */
const createBooking = async (req, res, next) => {
  try {
    const { customer_id, room_id, check_in_date, check_out_date } = req.body;

    // Verify customer exists
    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return ApiResponse.notFound(res, "Customer not found");
    }

    // Verify room exists and get price
    const room = await Room.findById(room_id);
    if (!room) {
      return ApiResponse.notFound(res, "Room not found");
    }

    if (!room.is_active) {
      return ApiResponse.badRequest(res, "Room is not active");
    }

    // Use room's base price if not provided
    const bookingData = {
      ...req.body,
      room_rate: req.body.room_rate || room.base_price,
    };

    const booking = await Booking.create(bookingData, req.user.id);

    // Create notification for new booking
    const customerName = customer?.full_name || "Unknown Customer";
    const roomNumber = room?.room_number || "Unknown Room";
    await NotificationService.onBookingCreated(
      booking,
      customerName,
      roomNumber,
    );

    ApiResponse.created(res, booking, "Booking created successfully");
  } catch (error) {
    if (error.message === "Room is not available for the selected dates") {
      return ApiResponse.conflict(res, error.message);
    }
    next(error);
  }
};

/**
 * Update booking
 */
const updateBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    // Check if booking exists
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    // Prevent updating cancelled or checked-out bookings
    if (existingBooking.status === "cancelled") {
      return ApiResponse.badRequest(res, "Cannot update cancelled booking");
    }

    if (existingBooking.status === "checked_out") {
      return ApiResponse.badRequest(res, "Cannot update completed booking");
    }

    const booking = await Booking.update(bookingId, req.body);

    ApiResponse.success(res, booking, "Booking updated successfully");
  } catch (error) {
    if (error.message === "Room is not available for the selected dates") {
      return ApiResponse.conflict(res, error.message);
    }
    next(error);
  }
};

/**
 * Cancel booking
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { cancellation_reason } = req.body;

    if (!cancellation_reason) {
      return ApiResponse.badRequest(res, "Cancellation reason is required");
    }

    const booking = await Booking.cancel(
      req.params.id,
      cancellation_reason,
      req.user.id,
    );

    ApiResponse.success(res, booking, "Booking cancelled successfully");
  } catch (error) {
    if (error.message.includes("Cannot cancel")) {
      return ApiResponse.badRequest(res, error.message);
    }
    next(error);
  }
};

/**
 * Check-in booking
 */
const checkIn = async (req, res, next) => {
  try {
    // Get booking details before check-in for notification
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    const customer = await Customer.findById(existingBooking.customer_id);
    const room = await Room.findById(existingBooking.room_id);

    const booking = await Booking.checkIn(req.params.id);

    // Create notification for check-in
    const customerName = customer?.full_name || "Unknown Customer";
    const roomNumber = room?.room_number || "Unknown Room";
    await NotificationService.onCheckIn(booking, customerName, roomNumber);

    ApiResponse.success(res, booking, "Check-in successful");
  } catch (error) {
    if (
      error.message.includes("Cannot check-in") ||
      error.message.includes("already checked in")
    ) {
      return ApiResponse.badRequest(res, error.message);
    }
    next(error);
  }
};

/**
 * Check-out booking
 */
const checkOut = async (req, res, next) => {
  try {
    // Get booking details before check-out for notification
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    const customer = await Customer.findById(existingBooking.customer_id);
    const room = await Room.findById(existingBooking.room_id);

    const booking = await Booking.checkOut(req.params.id);

    // Create notification for check-out
    const customerName = customer?.full_name || "Unknown Customer";
    const roomNumber = room?.room_number || "Unknown Room";
    await NotificationService.onCheckOut(booking, customerName, roomNumber);

    ApiResponse.success(res, booking, "Check-out successful");
  } catch (error) {
    if (error.message.includes("must be checked in")) {
      return ApiResponse.badRequest(res, error.message);
    }
    next(error);
  }
};

/**
 * Get today's arrivals
 */
const getTodayArrivals = async (req, res, next) => {
  try {
    const arrivals = await Booking.getTodayCheckIns();

    ApiResponse.success(res, {
      date: new Date().toISOString().split("T")[0],
      count: arrivals.length,
      arrivals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get today's departures
 */
const getTodayDepartures = async (req, res, next) => {
  try {
    const departures = await Booking.getTodayCheckOuts();

    ApiResponse.success(res, {
      date: new Date().toISOString().split("T")[0],
      count: departures.length,
      departures,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active bookings (currently checked in)
 */
const getActiveBookings = async (req, res, next) => {
  try {
    const activeBookings = await Booking.getActive();

    ApiResponse.success(res, {
      bookings: activeBookings,
      count: activeBookings.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  checkIn,
  checkOut,
  getTodayArrivals,
  getTodayDepartures,
  getActiveBookings,
};
