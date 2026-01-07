const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const ApiResponse = require("../utils/response");

/**
 * Get all invoices
 */
const getAllInvoices = async (req, res, next) => {
  try {
    const {
      payment_status,
      customer_id,
      booking_id,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      payment_status,
      customer_id,
      booking_id,
      search,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const invoices = await Invoice.findAll(filters);
    const total = await Invoice.count({
      payment_status,
      customer_id,
      booking_id,
    });

    ApiResponse.success(res, {
      invoices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice by ID
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdWithItems(req.params.id);

    if (!invoice) {
      return ApiResponse.notFound(res, "Invoice not found");
    }

    // Get payments for this invoice
    const Payment = require("../models/Payment");
    const payments = await Payment.getByInvoice(req.params.id);
    invoice.payments = payments;

    ApiResponse.success(res, invoice);
  } catch (error) {
    next(error);
  }
};

/**
 * Create invoice from booking
 */
const createInvoiceFromBooking = async (req, res, next) => {
  try {
    const { booking_id, additional_items } = req.body;

    // Verify booking exists
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    // Check if invoice already exists for this booking
    const [existing] = await require("../config/database").execute(
      "SELECT id FROM invoices WHERE booking_id = ?",
      [booking_id]
    );

    if (existing.length > 0) {
      return ApiResponse.conflict(
        res,
        "Invoice already exists for this booking"
      );
    }

    const invoice = await Invoice.createFromBooking(
      booking_id,
      additional_items || [],
      req.user.id
    );

    ApiResponse.created(res, invoice, "Invoice created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Create manual invoice
 */
const createManualInvoice = async (req, res, next) => {
  try {
    const { customer_id, items, discount_amount } = req.body;

    // Verify customer exists
    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return ApiResponse.notFound(res, "Customer not found");
    }

    if (!items || items.length === 0) {
      return ApiResponse.badRequest(res, "At least one item is required");
    }

    const invoice = await Invoice.create(
      { customer_id, discount_amount },
      items,
      req.user.id
    );

    ApiResponse.created(res, invoice, "Invoice created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending invoices
 */
const getPendingInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.getPendingInvoices();

    ApiResponse.success(res, {
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice statistics
 */
const getInvoiceStats = async (req, res, next) => {
  try {
    const [stats] = await require("../config/database").execute(
      `SELECT 
        COUNT(*) as total_invoices,
        COALESCE(SUM(grand_total), 0) as total_amount,
        COALESCE(SUM(amount_paid), 0) as total_paid,
        COALESCE(SUM(amount_due), 0) as total_due,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN payment_status = 'partial' THEN 1 END) as partial_count
       FROM invoices
       WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      []
    );

    ApiResponse.success(res, stats[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoiceFromBooking,
  createManualInvoice,
  getPendingInvoices,
  getInvoiceStats,
};
