const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateCreateTemplate = [
  body("type")
    .isIn([
      "booking_confirmation",
      "check_in_reminder",
      "check_out_reminder",
      "promotional",
      "invoice",
      "payment_reminder",
      "custom",
    ])
    .withMessage("Invalid template type"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Template name is required")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Template content is required")
    .isLength({ max: 1000 })
    .withMessage("Content must not exceed 1000 characters"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateUpdateTemplate = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("content")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Content must not exceed 1000 characters"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateTemplateId = [
  param("id").isInt().withMessage("Invalid template ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validatePreviewTemplate = [
  body("template_id").isInt().withMessage("Invalid template ID"),

  body("variables")
    .optional()
    .isObject()
    .withMessage("Variables must be an object"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validateCreateTemplate,
  validateUpdateTemplate,
  validateTemplateId,
  validatePreviewTemplate,
};
