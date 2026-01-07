const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateCustomerId = [
  param("id").isUUID().withMessage("Invalid customer ID format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateCreateCustomer = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("contact_number")
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Contact number must be 10-15 digits"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("id_proof_type")
    .isIn(["aadhar", "pan", "passport", "driving_license"])
    .withMessage("Invalid ID proof type"),

  body("id_proof_number")
    .trim()
    .notEmpty()
    .withMessage("ID proof number is required")
    .isLength({ max: 50 })
    .withMessage("ID proof number too long"),

  body("address").optional().trim(),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),

  body("notes").optional().trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateUpdateCustomer = [
  body("full_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("contact_number")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Contact number must be 10-15 digits"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("id_proof_type")
    .optional()
    .isIn(["aadhar", "pan", "passport", "driving_license"])
    .withMessage("Invalid ID proof type"),

  body("id_proof_number")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("ID proof number too long"),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validateCustomerId,
  validateCreateCustomer,
  validateUpdateCustomer,
};
