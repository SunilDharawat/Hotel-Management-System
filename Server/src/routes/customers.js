const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validateCustomerId,
  validateCreateCustomer,
  validateUpdateCustomer,
} = require("../validators/customerValidator");

// All routes require authentication
router.use(authenticate);

// Get all customers
router.get(
  "/",
  hasPermission("customers", "view"),
  customerController.getAllCustomers
);

// Get customer by ID
router.get(
  "/:id",
  validateCustomerId,
  hasPermission("customers", "view"),
  customerController.getCustomerById
);

// Get customer booking history
router.get(
  "/:id/history",
  validateCustomerId,
  hasPermission("customers", "view"),
  customerController.getCustomerHistory
);

// Create customer
router.post(
  "/",
  validateCreateCustomer,
  hasPermission("customers", "create"),
  customerController.createCustomer
);

// Update customer
router.put(
  "/:id",
  validateCustomerId,
  validateUpdateCustomer,
  hasPermission("customers", "edit"),
  customerController.updateCustomer
);

// Delete customer
router.delete(
  "/:id",
  validateCustomerId,
  hasPermission("customers", "delete"),
  customerController.deleteCustomer
);

module.exports = router;
