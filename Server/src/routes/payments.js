const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validatePaymentId,
  validateCreatePayment,
} = require("../validators/paymentValidator");

// All routes require authentication
router.use(authenticate);

// Get today's payment summary
router.get(
  "/today/summary",
  hasPermission("payments", "view"),
  paymentController.getTodaysSummary
);

// Get all payments
router.get(
  "/",
  hasPermission("payments", "view"),
  paymentController.getAllPayments
);

// Get payment by ID
router.get(
  "/:id",
  validatePaymentId,
  hasPermission("payments", "view"),
  paymentController.getPaymentById
);

// Get payments by invoice
router.get(
  "/invoice/:invoice_id",
  hasPermission("payments", "view"),
  paymentController.getPaymentsByInvoice
);

// Create payment
router.post(
  "/",
  validateCreatePayment,
  hasPermission("payments", "create"),
  paymentController.createPayment
);

module.exports = router;
