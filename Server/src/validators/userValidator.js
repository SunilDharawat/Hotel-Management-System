const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");

const validateUserId = [
  param("id").isUUID().withMessage("Invalid user ID format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

const validateUpdateUser = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("phone")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must be 10-15 digits"),

  body("role")
    .optional()
    .isIn(["admin", "manager", "receptionist"])
    .withMessage("Invalid role"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.badRequest(res, "Validation failed", errors.array());
    }
    next();
  },
];

module.exports = {
  validateUserId,
  validateUpdateUser,
};
