const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");
const userRoutes = require("./users");
const customerRoutes = require("./customers");
const roomRoutes = require("./rooms");
const bookingRoutes = require("./bookings");
const invoiceRoutes = require("./invoices");
const paymentRoutes = require("./payments");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/customers", customerRoutes);
router.use("/rooms", roomRoutes);
router.use("/bookings", bookingRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
