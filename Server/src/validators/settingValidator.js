const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateSettingKey = [
  param("key")
    .trim()
    .notEmpty()
    .withMessage("Setting key is required")
    .isLength({ max: 100 })
    .withMessage("Setting key too long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateUpdateSetting = [
  body("value")
    .notEmpty()
    .withMessage("Setting value is required")
    .custom((value) => {
      // Ensure value is a valid object or primitive
      if (typeof value === "object" && value !== null) {
        return true;
      }
      if (["string", "number", "boolean"].includes(typeof value)) {
        return true;
      }
      throw new Error("Invalid setting value format");
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateCreateSetting = [
  body("setting_key")
    .trim()
    .notEmpty()
    .withMessage("Setting key is required")
    .isLength({ max: 100 })
    .withMessage("Setting key too long")
    .matches(/^[a-z_]+$/)
    .withMessage(
      "Setting key can only contain lowercase letters and underscores"
    ),

  body("setting_value").notEmpty().withMessage("Setting value is required"),

  body("description").optional().trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateGeneralSettings = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Hotel name cannot be empty"),

  body("address").optional().trim(),

  body("phone")
    .optional()
    .matches(/^[\+]?[0-9\-\s]+$/)
    .withMessage("Invalid phone number format"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("gst_number")
    .optional()
    .trim()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage("Invalid GST number format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateGSTRates = [
  body("cgst")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("CGST rate must be between 0 and 100"),

  body("sgst")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("SGST rate must be between 0 and 100"),

  body("igst")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("IGST rate must be between 0 and 100"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateRoomPricing = [
  body("single")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Single room price must be positive"),

  body("double")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Double room price must be positive"),

  body("suite")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Suite price must be positive"),

  body("deluxe")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Deluxe room price must be positive"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validatePolicies = [
  body("cancellation_hours")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Cancellation hours must be a positive number"),

  body("late_checkout_charge")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Late checkout charge must be positive"),

  body("early_checkout_refund_percent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Refund percent must be between 0 and 100"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validateSettingKey,
  validateUpdateSetting,
  validateCreateSetting,
  validateGeneralSettings,
  validateGSTRates,
  validateRoomPricing,
  validatePolicies,
};
