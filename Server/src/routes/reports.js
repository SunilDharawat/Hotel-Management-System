const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

// Occupancy reports
router.get('/occupancy', authenticate, ReportController.getOccupancyReport);
router.get('/occupancy/export', authenticate, ReportController.exportOccupancyReport);

// Revenue reports
router.get('/revenue', authenticate, ReportController.getRevenueReport);
router.get('/revenue/export', authenticate, ReportController.exportRevenueReport);

// Booking reports
router.get('/bookings', authenticate, ReportController.getBookingReport);

// Customer reports
router.get('/customers', authenticate, ReportController.getCustomerReport);

module.exports = router;