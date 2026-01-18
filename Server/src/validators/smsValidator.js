const { body, param, query, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateSendSMS = [
  body("phone_number")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Invalid phone number format"),

  body("customer_id").optional().isUUID().withMessage("Invalid customer ID"),

  body("message_type")
    .optional()
    .isIn([
      "booking_confirmation",
      "check_in_reminder",
      "check_out_reminder",
      "promotional",
      "invoice",
      "payment_reminder",
      "custom",
    ])
    .withMessage("Invalid message type"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message content must be 1-1000 characters"),

  body("template_id").optional().isInt().withMessage("Invalid template ID"),

  body("template_variables")
    .optional()
    .isObject()
    .withMessage("Template variables must be an object"),

  body().custom((value) => {
    if (!value.customer_id && !value.phone_number) {
      throw new Error("Either customer_id or phone_number is required");
    }
    if (!value.content && !value.template_id) {
      throw new Error("Either content or template_id is required");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateBulkSMS = [
  body("customer_ids")
    .optional()
    .isArray({ min: 1 })
    .withMessage("customer_ids must be an array with at least one ID"),

  body("phone_numbers")
    .optional()
    .isArray({ min: 1 })
    .withMessage("phone_numbers must be an array with at least one number"),

  body().custom((value) => {
    if (!value.customer_ids && !value.phone_numbers) {
      throw new Error("Either customer_ids or phone_numbers is required");
    }
    if (!value.content && !value.template_id) {
      throw new Error("Either content or template_id is required");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateSMSId = [
  param("id").isUUID().withMessage("Invalid SMS message ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validateSendSMS,
  validateBulkSMS,
  validateSMSId,
};
