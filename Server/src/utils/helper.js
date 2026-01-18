const crypto = require("crypto");
const {
  BOOKING_PREFIX,
  INVOICE_PREFIX,
  PAYMENT_PREFIX,
} = require("../config/constants");
const Setting = require("../models/Setting");

/**
 * Generate unique booking number
 */
const generateBookingNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${BOOKING_PREFIX}${timestamp}${random}`;
};

/**
 * Generate unique invoice number
 */
const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${INVOICE_PREFIX}${timestamp}${random}`;
};

/**
 * Generate unique payment number
 */
const generatePaymentNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${PAYMENT_PREFIX}${timestamp}${random}`;
};

/**
 * Calculate number of nights between two dates
 */
const calculateNights = (checkIn, checkOut) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    Math.abs((new Date(checkOut) - new Date(checkIn)) / oneDay)
  );
  return diffDays;
};

/**
 * Calculate GST amounts
 */
// const calculateGST = (amount, cgstRate = 6, sgstRate = 6, igstRate = 0) => {
//   const cgst = (amount * cgstRate) / 100;
//   const sgst = (amount * sgstRate) / 100;
//   const igst = (amount * igstRate) / 100;

//   return {
//     cgst_rate: cgstRate,
//     cgst_amount: parseFloat(cgst.toFixed(2)),
//     sgst_rate: sgstRate,
//     sgst_amount: parseFloat(sgst.toFixed(2)),
//     igst_rate: igstRate,
//     igst_amount: parseFloat(igst.toFixed(2)),
//     total_gst: parseFloat((cgst + sgst + igst).toFixed(2)),
//   };
// };
const calculateGST = (amount, gstRates = {}) => {
  console.log(gstRates, "g");

  const cgstRate = Number(gstRates.cgstRate ?? 0);
  const sgstRate = Number(gstRates.sgstRate ?? 0);
  const igstRate = Number(gstRates.igstRate ?? 0);

  const cgst = (amount * cgstRate) / 100;
  const sgst = (amount * sgstRate) / 100;
  const igst = (amount * igstRate) / 100;

  return {
    cgst_rate: cgstRate,
    cgst_amount: Number(cgst.toFixed(2)),

    sgst_rate: sgstRate,
    sgst_amount: Number(sgst.toFixed(2)),

    igst_rate: igstRate,
    igst_amount: Number(igst.toFixed(2)),

    total_gst: Number((cgst + sgst + igst).toFixed(2)),
  };
};
/**
 * Format currency
 */
const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Validate date range
 */
const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

module.exports = {
  generateBookingNumber,
  generateInvoiceNumber,
  generatePaymentNumber,
  calculateNights,
  calculateGST,
  formatCurrency,
  isValidDateRange,
};
