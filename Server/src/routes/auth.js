const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

// Public routes
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

// Protected routes
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/change-password", authenticate, authController.changePassword);

module.exports = router;
