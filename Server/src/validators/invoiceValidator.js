const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateInvoiceId = [
  param("id").isUUID().withMessage("Invalid invoice ID format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateCreateFromBooking = [
  body("booking_id").isUUID().withMessage("Invalid booking ID"),

  body("additional_items")
    .optional()
    .isArray()
    .withMessage("Additional items must be an array"),

  body("additional_items.*.description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Item description is required"),

  body("additional_items.*.category")
    .optional()
    .isIn(["room", "food", "service", "minibar", "laundry", "other"])
    .withMessage("Invalid item category"),

  body("additional_items.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("additional_items..unit_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a positive number"),
  body("additional_items.*.total_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateManualInvoice = [
  body("customer_id").isUUID().withMessage("Invalid customer ID"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.description")
    .trim()
    .notEmpty()
    .withMessage("Item description is required"),
  body("items.*.category")
    .optional()
    .isIn(["room", "food", "service", "minibar", "laundry", "other"])
    .withMessage("Invalid item category"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.unit_price")
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a positive number"),
  body("items.*.total_price")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
  body("discount_amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be a positive number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];
module.exports = {
  validateInvoiceId,
  validateCreateFromBooking,
  validateManualInvoice,
};
