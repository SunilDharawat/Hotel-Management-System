const Customer = require("../models/Customer");
const ApiResponse = require("../utils/response");

/**
 * Get all customers
 */
const getAllCustomers = async (req, res, next) => {
  try {
    const { search, gender, page = 1, limit = 10 } = req.query;

    const filters = {
      search,
      gender,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const customers = await Customer.findAll(filters);
    const total = await Customer.count({ search, gender });

    ApiResponse.success(res, {
      customers,
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
 * Get customer by ID
 */
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return ApiResponse.notFound(res, "Customer not found");
    }

    // Parse preferences if it's a string
    if (typeof customer.preferences === "string") {
      customer.preferences = JSON.parse(customer.preferences);
    }

    ApiResponse.success(res, customer);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new customer
 */
const createCustomer = async (req, res, next) => {
  try {
    const { contact_number, id_proof_type, id_proof_number } = req.body;

    // Check if contact number exists
    const existingContact = await Customer.findByContact(contact_number);
    if (existingContact) {
      return ApiResponse.conflict(res, "Contact number already exists");
    }

    // Check if ID proof exists
    const existingIdProof = await Customer.findByIdProof(
      id_proof_type,
      id_proof_number
    );
    if (existingIdProof) {
      return ApiResponse.conflict(res, "ID proof already registered");
    }

    const customer = await Customer.create(req.body);

    ApiResponse.created(res, customer, "Customer created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update customer
 */
const updateCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const existingCustomer = await Customer.findById(customerId);
    if (!existingCustomer) {
      return ApiResponse.notFound(res, "Customer not found");
    }

    // Check contact number conflict
    if (
      req.body.contact_number &&
      req.body.contact_number !== existingCustomer.contact_number
    ) {
      const contactExists = await Customer.findByContact(
        req.body.contact_number
      );
      if (contactExists) {
        return ApiResponse.conflict(res, "Contact number already exists");
      }
    }

    // Check ID proof conflict
    if (req.body.id_proof_number && req.body.id_proof_type) {
      if (
        req.body.id_proof_number !== existingCustomer.id_proof_number ||
        req.body.id_proof_type !== existingCustomer.id_proof_type
      ) {
        const idProofExists = await Customer.findByIdProof(
          req.body.id_proof_type,
          req.body.id_proof_number
        );
        if (idProofExists) {
          return ApiResponse.conflict(res, "ID proof already registered");
        }
      }
    }

    const customer = await Customer.update(customerId, req.body);

    ApiResponse.success(res, customer, "Customer updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete customer
 */
const deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return ApiResponse.notFound(res, "Customer not found");
    }

    // Check if customer has active bookings
    const [activeBookings] = await require("../config/database").execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE customer_id = ? AND status IN ('pending', 'confirmed', 'checked_in')`,
      [customerId]
    );

    if (activeBookings[0].count > 0) {
      return ApiResponse.badRequest(
        res,
        "Cannot delete customer with active bookings"
      );
    }

    await Customer.delete(customerId);

    ApiResponse.success(res, null, "Customer deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Get customer booking history
 */
const getCustomerHistory = async (req, res, next) => {
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return ApiResponse.notFound(res, "Customer not found");
    }

    const bookings = await Customer.getBookingHistory(customerId);

    ApiResponse.success(res, {
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        contact_number: customer.contact_number,
        total_stays: customer.total_stays,
        total_spent: customer.total_spent,
      },
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory,
};
