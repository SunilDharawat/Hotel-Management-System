const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateBookingId = [
  param("id").isUUID().withMessage("Invalid booking ID format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateCreateBooking = [
  body("customer_id").isUUID().withMessage("Invalid customer ID"),

  body("room_id").isUUID().withMessage("Invalid room ID"),

  body("check_in_date")
    .isISO8601()
    .withMessage("Invalid check-in date format")
    .custom((value) => {
      const checkIn = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkIn < today) {
        throw new Error("Check-in date cannot be in the past");
      }
      return true;
    }),

  body("check_out_date")
    .isISO8601()
    .withMessage("Invalid check-out date format")
    .custom((value, { req }) => {
      const checkOut = new Date(value);
      const checkIn = new Date(req.body.check_in_date);
      if (checkOut <= checkIn) {
        throw new Error("Check-out date must be after check-in date");
      }
      return true;
    }),

  body("number_of_guests")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Number of guests must be between 1 and 10"),

  body("room_rate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Room rate must be a positive number"),

  body("advance_payment")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Advance payment must be a positive number"),

  body("special_requests").optional().trim(),

  body("status")
    .optional()
    .isIn(["pending", "confirmed"])
    .withMessage("Status must be pending or confirmed"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateUpdateBooking = [
  body("check_in_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid check-in date format"),

  body("check_out_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid check-out date format"),

  body("number_of_guests")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Number of guests must be between 1 and 10"),

  body("room_rate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Room rate must be a positive number"),

  body("advance_payment")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Advance payment must be a positive number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateCancelBooking = [
  body("cancellation_reason")
    .trim()
    .notEmpty()
    .withMessage("Cancellation reason is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Cancellation reason must be between 10 and 500 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validateBookingId,
  validateCreateBooking,
  validateUpdateBooking,
  validateCancelBooking,
};
