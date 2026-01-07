const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const ApiResponse = require("../utils/response");

/**
 * Get all payments
 */
const getAllPayments = async (req, res, next) => {
  try {
    const {
      invoice_id,
      customer_id,
      payment_method,
      start_date,
      end_date,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      invoice_id,
      customer_id,
      payment_method,
      start_date,
      end_date,
      search,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const payments = await Payment.findAll(filters);
    const total = await Payment.count({
      invoice_id,
      customer_id,
      payment_method,
    });

    ApiResponse.success(res, {
      payments,
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
 * Get payment by ID
 */
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return ApiResponse.notFound(res, "Payment not found");
    }

    ApiResponse.success(res, payment);
  } catch (error) {
    next(error);
  }
};

/**
 * Create payment
 */
const createPayment = async (req, res, next) => {
  try {
    const { invoice_id, amount } = req.body;

    // Verify invoice exists
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return ApiResponse.notFound(res, "Invoice not found");
    }

    // Check if payment amount is valid
    const amountDue = parseFloat(invoice.amount_due);
    const paymentAmount = parseFloat(amount);

    if (paymentAmount <= 0) {
      return ApiResponse.badRequest(
        res,
        "Payment amount must be greater than zero"
      );
    }

    if (paymentAmount > amountDue) {
      return ApiResponse.badRequest(
        res,
        `Payment amount cannot exceed due amount of ₹${amountDue}`
      );
    }

    const paymentData = {
      ...req.body,
      customer_id: invoice.customer_id,
    };

    const payment = await Payment.create(paymentData, req.user.id);

    ApiResponse.created(res, payment, "Payment recorded successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get payments by invoice
 */
const getPaymentsByInvoice = async (req, res, next) => {
  try {
    const { invoice_id } = req.params;

    // Verify invoice exists
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return ApiResponse.notFound(res, "Invoice not found");
    }

    const payments = await Payment.getByInvoice(invoice_id);

    ApiResponse.success(res, {
      invoice_number: invoice.invoice_number,
      grand_total: invoice.grand_total,
      amount_paid: invoice.amount_paid,
      amount_due: invoice.amount_due,
      payment_status: invoice.payment_status,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get today's payment summary
 */
const getTodaysSummary = async (req, res, next) => {
  try {
    const summary = await Payment.getTodaysSummary();

    ApiResponse.success(res, {
      date: new Date().toISOString().split("T")[0],
      ...summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  getPaymentsByInvoice,
  getTodaysSummary,
};
