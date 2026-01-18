const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validateInvoiceId,
  validateCreateFromBooking,
  validateManualInvoice,
} = require("../validators/invoiceValidator");

// All routes require authentication
router.use(authenticate);

// Get invoice statistics
router.get(
  "/stats",
  hasPermission("invoices", "view"),
  invoiceController.getInvoiceStats
);

// Get pending invoices
router.get(
  "/pending",
  hasPermission("invoices", "view"),
  invoiceController.getPendingInvoices
);

// Get all invoices
router.get(
  "/",
  hasPermission("invoices", "view"),
  invoiceController.getAllInvoices
);

// Get invoice by ID
router.get(
  "/:id",
  validateInvoiceId,
  hasPermission("invoices", "view"),
  invoiceController.getInvoiceById
);

// Create invoice from booking
router.post(
  "/from-booking",
  validateCreateFromBooking,
  hasPermission("invoices", "create"),
  invoiceController.createInvoiceFromBooking
);

// Create manual invoice
router.post(
  "/manual",
  validateManualInvoice,
  hasPermission("invoices", "create"),
  invoiceController.createManualInvoice
);

// Download invoice PDF
router.get(
  "/:id/download",
  validateInvoiceId,
  hasPermission("invoices", "view"),
  invoiceController.downloadInvoicePDF
);

// View invoice PDF in browser
router.get(
  "/:id/pdf",
  validateInvoiceId,
  hasPermission("invoices", "view"),
  invoiceController.viewInvoicePDF
);

module.exports = router;
