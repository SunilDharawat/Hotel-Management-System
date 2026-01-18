const SMS = require("../models/SMS");
const SMSTemplate = require("../models/SMSTemplate");
const Customer = require("../models/Customer");
const SMSService = require("../services/smsService");
const ApiResponse = require("../utils/response");

/**
 * Get all SMS messages
 */
const getAllMessages = async (req, res, next) => {
  try {
    const {
      customer_id,
      message_type,
      status,
      phone_number,
      start_date,
      end_date,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      customer_id,
      message_type,
      status,
      phone_number,
      start_date,
      end_date,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const messages = await SMS.findAll(filters);
    const total = await SMS.count({
      customer_id,
      message_type,
      status,
    });

    ApiResponse.success(res, {
      messages,
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
 * Get SMS by ID
 */
const getMessageById = async (req, res, next) => {
  try {
    const message = await SMS.findById(req.params.id);

    if (!message) {
      return ApiResponse.notFound(res, "SMS message not found");
    }

    ApiResponse.success(res, message);
  } catch (error) {
    next(error);
  }
};

/**
 * Send SMS to customer
 */
const sendMessage = async (req, res, next) => {
  try {
    const {
      customer_id,
      phone_number,
      message_type,
      content,
      template_id,
      template_variables,
    } = req.body;

    let messageContent = content;

    // If template_id is provided, use template
    if (template_id) {
      const template = await SMSTemplate.findById(template_id);
      if (!template) {
        return ApiResponse.notFound(res, "Template not found");
      }
      messageContent = SMSTemplate.parseTemplate(
        template,
        template_variables || {}
      );
    }

    // Get customer details if customer_id provided
    let customer = null;
    let recipientPhone = phone_number;

    if (customer_id) {
      customer = await Customer.findById(customer_id);
      if (!customer) {
        return ApiResponse.notFound(res, "Customer not found");
      }
      recipientPhone = customer.contact_number;
    }

    // Create SMS record
    const sms = await SMS.create(
      {
        customer_id: customer_id || null,
        phone_number: recipientPhone,
        message_type: message_type || "custom",
        content: messageContent,
        status: "pending",
      },
      req.user.id
    );

    // Send SMS using service
    try {
      const result = await SMSService.sendSMS(
        recipientPhone,
        messageContent,
        customer
      );

      // Update SMS status
      await SMS.updateStatus(
        sms.id,
        "sent",
        result.provider_message_id || null
      );

      ApiResponse.created(
        res,
        {
          ...sms,
          status: "sent",
        },
        "SMS sent successfully"
      );
    } catch (smsError) {
      // Update SMS status to failed
      await SMS.updateStatus(sms.id, "failed", null, smsError.message);

      return ApiResponse.error(res, "Failed to send SMS", 500, {
        error: smsError.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Send bulk SMS
 */
const sendBulkMessages = async (req, res, next) => {
  try {
    const {
      customer_ids,
      phone_numbers,
      message_type,
      content,
      template_id,
      template_variables,
    } = req.body;

    let messageContent = content;

    // If template_id is provided, use template
    if (template_id) {
      const template = await SMSTemplate.findById(template_id);
      if (!template) {
        return ApiResponse.notFound(res, "Template not found");
      }
      messageContent = SMSTemplate.parseTemplate(
        template,
        template_variables || {}
      );
    }

    const results = {
      sent: [],
      failed: [],
    };

    // Send to customers
    if (customer_ids && customer_ids.length > 0) {
      for (const customerId of customer_ids) {
        try {
          const customer = await Customer.findById(customerId);
          if (!customer) continue;

          const sms = await SMS.create(
            {
              customer_id: customerId,
              phone_number: customer.contact_number,
              message_type: message_type || "promotional",
              content: messageContent,
              status: "pending",
            },
            req.user.id
          );

          try {
            await SMSService.sendSMS(
              customer.contact_number,
              messageContent,
              customer
            );
            await SMS.updateStatus(sms.id, "sent");
            results.sent.push(sms.id);
          } catch (err) {
            await SMS.updateStatus(sms.id, "failed", null, err.message);
            results.failed.push(sms.id);
          }
        } catch (err) {
          results.failed.push(customerId);
        }
      }
    }

    // Send to phone numbers
    if (phone_numbers && phone_numbers.length > 0) {
      for (const phone of phone_numbers) {
        try {
          const sms = await SMS.create(
            {
              phone_number: phone,
              message_type: message_type || "custom",
              content: messageContent,
              status: "pending",
            },
            req.user.id
          );

          try {
            await SMSService.sendSMS(phone, messageContent);
            await SMS.updateStatus(sms.id, "sent");
            results.sent.push(sms.id);
          } catch (err) {
            await SMS.updateStatus(sms.id, "failed", null, err.message);
            results.failed.push(sms.id);
          }
        } catch (err) {
          results.failed.push(phone);
        }
      }
    }

    ApiResponse.success(
      res,
      results,
      `Sent ${results.sent.length} messages, ${results.failed.length} failed`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get SMS statistics
 */
const getStats = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    const stats = await SMS.getStats(start_date, end_date);

    ApiResponse.success(res, stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get SMS by customer
 */
const getMessagesByCustomer = async (req, res, next) => {
  try {
    const { customer_id } = req.params;
    const { limit = 10 } = req.query;

    const messages = await SMS.getByCustomer(customer_id, parseInt(limit));

    ApiResponse.success(res, { messages });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete SMS message
 */
const deleteMessage = async (req, res, next) => {
  try {
    const message = await SMS.findById(req.params.id);

    if (!message) {
      return ApiResponse.notFound(res, "SMS message not found");
    }

    await SMS.delete(req.params.id);

    ApiResponse.success(res, null, "SMS message deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  sendMessage,
  sendBulkMessages,
  getStats,
  getMessagesByCustomer,
  deleteMessage,
};
