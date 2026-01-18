const express = require("express");
const router = express.Router();
const smsController = require("../controllers/smsController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validateSendSMS,
  validateBulkSMS,
  validateSMSId,
} = require("../validators/smsValidator");

// All routes require authentication
router.use(authenticate);

// Get all SMS messages
router.get("/", hasPermission("sms", "view"), smsController.getAllMessages);

// Get SMS statistics
router.get("/stats", hasPermission("sms", "view"), smsController.getStats);

// Get SMS by customer
router.get(
  "/customer/:customer_id",
  hasPermission("sms", "view"),
  smsController.getMessagesByCustomer
);

// Get SMS by ID
router.get(
  "/:id",
  validateSMSId,
  hasPermission("sms", "view"),
  smsController.getMessageById
);

// Send SMS
router.post(
  "/send",
  validateSendSMS,
  hasPermission("sms", "create"),
  smsController.sendMessage
);

// Send bulk SMS
router.post(
  "/send-bulk",
  validateBulkSMS,
  hasPermission("sms", "create"),
  smsController.sendBulkMessages
);

// Delete SMS
router.delete(
  "/:id",
  validateSMSId,
  hasPermission("sms", "delete"),
  smsController.deleteMessage
);

module.exports = router;
