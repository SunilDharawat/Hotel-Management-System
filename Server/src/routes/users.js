const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { isAdmin, hasPermission } = require("../middleware/permission");
const {
  validateUserId,
  validateUpdateUser,
} = require("../validators/userValidator");
const { validateRegister } = require("../validators/authValidator");

// All routes require authentication
router.use(authenticate);

// Get all users (admin or manager)
router.get("/", hasPermission("users", "view"), userController.getAllUsers);

// Get user by ID
router.get(
  "/:id",
  validateUserId,
  hasPermission("users", "view"),
  userController.getUserById
);

// Create user (admin only)
router.post(
  "/",
  validateRegister,
  hasPermission("users", "create"),
  userController.createUser
);

// Update user (admin only)
router.put(
  "/:id",
  validateUserId,
  validateUpdateUser,
  hasPermission("users", "edit"),
  userController.updateUser
);

// Delete user (admin only)
router.delete(
  "/:id",
  validateUserId,
  hasPermission("users", "delete"),
  userController.deleteUser
);

// Reset user password (admin only)
router.post(
  "/:id/reset-password",
  validateUserId,
  hasPermission("users", "edit"),
  userController.resetPassword
);

module.exports = router;
