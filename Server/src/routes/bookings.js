const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validateBookingId,
  validateCreateBooking,
  validateUpdateBooking,
  validateCancelBooking,
} = require("../validators/bookingValidator");

// All routes require authentication
router.use(authenticate);

// Get today's arrivals
router.get(
  "/today/arrivals",
  hasPermission("bookings", "view"),
  bookingController.getTodayArrivals
);

// Get today's departures
router.get(
  "/today/departures",
  hasPermission("bookings", "view"),
  bookingController.getTodayDepartures
);

// Get all bookings
router.get(
  "/",
  hasPermission("bookings", "view"),
  bookingController.getAllBookings
);

// Get booking by ID
router.get(
  "/:id",
  validateBookingId,
  hasPermission("bookings", "view"),
  bookingController.getBookingById
);

// Create booking
router.post(
  "/",
  validateCreateBooking,
  hasPermission("bookings", "create"),
  bookingController.createBooking
);

// Update booking
router.put(
  "/:id",
  validateBookingId,
  validateUpdateBooking,
  hasPermission("bookings", "edit"),
  bookingController.updateBooking
);

// Cancel booking
router.post(
  "/:id/cancel",
  validateBookingId,
  validateCancelBooking,
  hasPermission("bookings", "edit"),
  bookingController.cancelBooking
);

// Check-in
router.post(
  "/:id/checkin",
  validateBookingId,
  hasPermission("bookings", "edit"),
  bookingController.checkIn
);

// Check-out
router.post(
  "/:id/checkout",
  validateBookingId,
  hasPermission("bookings", "edit"),
  bookingController.checkOut
);

module.exports = router;
