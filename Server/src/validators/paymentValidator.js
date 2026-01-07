const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validatePaymentId = [
  param("id").isUUID().withMessage("Invalid payment ID format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateCreatePayment = [
  body("invoice_id").isUUID().withMessage("Invalid invoice ID"),

  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than zero"),

  body("payment_method")
    .isIn(["cash", "upi", "credit_card", "debit_card", "net_banking"])
    .withMessage("Invalid payment method"),

  body("payment_reference")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Payment reference too long"),

  body("transaction_id")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Transaction ID too long"),

  body("notes").optional().trim(),

  body("payment_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid payment date format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validatePaymentId,
  validateCreatePayment,
};
