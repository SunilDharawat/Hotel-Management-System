const { Vonage } = require("@vonage/server-sdk");
const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// Initialize Vonage
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const from = process.env.VONAGE_FROM_NUMBER || "VrindavanPalace";

class SMSService {
  /**
   * Send SMS using Vonage
   */
  static async sendSMS(phoneNumber, content, customer = null) {
    try {
      // Format phone number (add country code if not present)
      const to = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      // Send SMS via Vonage
      const result = await vonage.sms.send({
        to,
        from,
        text: content,
      });

      if (result.messages[0].status === "0") {
        return {
          success: true,
          provider_message_id: result.messages[0]["message-id"],
        };
      } else {
        throw new Error(result.messages[0]["error-text"] || "SMS send failed");
      }
    } catch (error) {
      console.error("Vonage SMS Error:", error);
      throw error;
    }
  }

  /**
   * Send booking confirmation SMS
   */
  static async sendBookingConfirmation(booking, customer) {
    const message = `Dear ${customer.full_name},

Your booking at Vrindavan Palace is confirmed!

Booking #: ${booking.booking_number}
Room: ${booking.room_number}
Check-in: ${booking.check_in_date}
Check-out: ${booking.check_out_date}
Amount: ₹${booking.total_amount}

We look forward to welcoming you!

- Vrindavan Palace Team`;

    try {
      const result = await this.sendSMS(customer.contact_number, message);

      // Save to database
      await this.saveSMSRecord({
        customer_id: customer.id,
        phone_number: customer.contact_number,
        message_type: "booking_confirmation",
        content: message,
        status: "sent",
        provider_message_id: result.provider_message_id,
      });

      return result;
    } catch (error) {
      // Save failed SMS
      await this.saveSMSRecord({
        customer_id: customer.id,
        phone_number: customer.contact_number,
        message_type: "booking_confirmation",
        content: message,
        status: "failed",
        error_message: error.message,
      });

      throw error;
    }
  }

  /**
   * Send thank you message after checkout
   */
  static async sendThankYouMessage(booking, customer) {
    const message = `Dear ${customer.full_name},

Thank you for choosing Vrindavan Palace!

We hope you enjoyed your stay. Your feedback is valuable to us.

Booking #: ${booking.booking_number}

We look forward to welcoming you again!

- Vrindavan Palace Team`;

    try {
      const result = await this.sendSMS(customer.contact_number, message);

      await this.saveSMSRecord({
        customer_id: customer.id,
        phone_number: customer.contact_number,
        message_type: "custom",
        content: message,
        status: "sent",
        provider_message_id: result.provider_message_id,
      });

      return result;
    } catch (error) {
      await this.saveSMSRecord({
        customer_id: customer.id,
        phone_number: customer.contact_number,
        message_type: "custom",
        content: message,
        status: "failed",
        error_message: error.message,
      });

      throw error;
    }
  }

  /**
   * Save SMS record to database
   */
  static async saveSMSRecord(smsData) {
    const id = uuidv4();

    await db.execute(
      `INSERT INTO sms_messages (
        id, customer_id, phone_number, message_type, content,
        status, provider_message_id, error_message, sent_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        smsData.customer_id || null,
        smsData.phone_number,
        smsData.message_type,
        smsData.content,
        smsData.status,
        smsData.provider_message_id || null,
        smsData.error_message || null,
        smsData.status === "sent" ? new Date() : null,
      ]
    );
  }
}

module.exports = SMSService;
