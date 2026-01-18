const Notification = require("../models/Notification");
const User = require("../models/User");

class NotificationService {
  /**
   * Create notification for a specific user
   */
  static async createNotification(userId, title, message, type = "info", entityType = null, entityId = null) {
    try {
      const notification = await Notification.create({
        user_id: userId,
        title,
        message,
        type,
        entity_type: entityType,
        entity_id: entityId,
      });
      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      return null;
    }
  }

  /**
   * Create notification for multiple users
   */
  static async createBulkNotification(userIds, title, message, type = "info", entityType = null, entityId = null) {
    try {
      const notifications = await Notification.createBulk({
        user_ids: userIds,
        title,
        message,
        type,
        entity_type: entityType,
        entity_id: entityId,
      });
      return notifications;
    } catch (error) {
      console.error("Failed to create bulk notification:", error);
      return null;
    }
  }

  /**
   * Create notification for all users of a specific role
   */
  static async createRoleNotification(role, title, message, type = "info", entityType = null, entityId = null) {
    try {
      // Get all users with the specified role
      const users = await User.findAll({ role, is_active: true });
      const userIds = users.map(user => user.id);

      if (userIds.length === 0) {
        return [];
      }

      return await this.createBulkNotification(userIds, title, message, type, entityType, entityId);
    } catch (error) {
      console.error("Failed to create role notification:", error);
      return null;
    }
  }

  /**
   * Booking created notification
   */
  static async onBookingCreated(booking, customerName, roomNumber) {
    // Notify receptionists and managers about new booking
    await this.createRoleNotification(
      "receptionist",
      "New Booking Created",
      `${customerName} booked Room ${roomNumber}`,
      "success",
      "booking",
      booking.id
    );

    await this.createRoleNotification(
      "manager",
      "New Booking Created",
      `${customerName} booked Room ${roomNumber}`,
      "success",
      "booking",
      booking.id
    );
  }

  /**
   * Check-in notification
   */
  static async onCheckIn(booking, customerName, roomNumber) {
    // Notify receptionists about check-in
    await this.createRoleNotification(
      "receptionist",
      "Guest Checked In",
      `${customerName} has checked in to Room ${roomNumber}`,
      "success",
      "booking",
      booking.id
    );

    // Notify managers about check-in
    await this.createRoleNotification(
      "manager",
      "Guest Checked In",
      `${customerName} has checked in to Room ${roomNumber}`,
      "info",
      "booking",
      booking.id
    );
  }

  /**
   * Check-out notification
   */
  static async onCheckOut(booking, customerName, roomNumber) {
    // Notify receptionists about check-out
    await this.createRoleNotification(
      "receptionist",
      "Guest Checked Out",
      `${customerName} has checked out from Room ${roomNumber}`,
      "info",
      "booking",
      booking.id
    );

    // Notify managers about check-out
    await this.createRoleNotification(
      "manager",
      "Guest Checked Out",
      `${customerName} has checked out from Room ${roomNumber}`,
      "info",
      "booking",
      booking.id
    );

    // Notify housekeeping (if role exists)
    await this.createRoleNotification(
      "receptionist",
      "Room Ready for Cleaning",
      `Room ${roomNumber} is now available for housekeeping`,
      "warning",
      "room",
      booking.room_id
    );
  }

  /**
   * Booking cancelled notification
   */
  static async onBookingCancelled(booking, customerName, roomNumber) {
    // Notify receptionists about cancellation
    await this.createRoleNotification(
      "receptionist",
      "Booking Cancelled",
      `${customerName} cancelled booking for Room ${roomNumber}`,
      "error",
      "booking",
      booking.id
    );

    // Notify managers about cancellation
    await this.createRoleNotification(
      "manager",
      "Booking Cancelled",
      `${customerName} cancelled booking for Room ${roomNumber}`,
      "warning",
      "booking",
      booking.id
    );
  }

  /**
   * Payment received notification
   */
  static async onPaymentReceived(payment, customerName, amount) {
    // Notify managers about payment
    await this.createRoleNotification(
      "manager",
      "Payment Received",
      `Payment of ₹${amount} received from ${customerName}`,
      "success",
      "payment",
      payment.id
    );

    // Notify receptionists about payment
    await this.createRoleNotification(
      "receptionist",
      "Payment Received",
      `Payment of ₹${amount} received from ${customerName}`,
      "info",
      "payment",
      payment.id
    );
  }

  /**
   * Invoice created notification
   */
  static async onInvoiceCreated(invoice, customerName, amount) {
    // Notify managers about new invoice
    await this.createRoleNotification(
      "manager",
      "New Invoice Created",
      `Invoice of ₹${amount} created for ${customerName}`,
      "info",
      "invoice",
      invoice.id
    );
  }

  /**
   * User created notification (for admins)
   */
  static async onUserCreated(user, createdBy) {
    // Notify admins about new user
    await this.createRoleNotification(
      "admin",
      "New User Created",
      `${createdBy} created new ${user.role} account: ${user.name}`,
      "info",
      "user",
      user.id
    );
  }

  /**
   * System maintenance notification
   */
  static async onSystemMaintenance(title, message) {
    // Notify all users about system maintenance
    await this.createRoleNotification(
      "admin",
      title,
      message,
      "warning",
      "system",
      null
    );

    await this.createRoleNotification(
      "manager",
      title,
      message,
      "warning",
      "system",
      null
    );

    await this.createRoleNotification(
      "receptionist",
      title,
      message,
      "warning",
      "system",
      null
    );
  }

  /**
   * Room status change notification
   */
  static async onRoomStatusChanged(room, oldStatus, newStatus) {
    // Notify receptionists about room status changes
    await this.createRoleNotification(
      "receptionist",
      "Room Status Changed",
      `Room ${room.room_number} status changed from ${oldStatus} to ${newStatus}`,
      "info",
      "room",
      room.id
    );

    // Notify managers about important status changes
    if (newStatus === "maintenance" || newStatus === "out_of_order") {
      await this.createRoleNotification(
        "manager",
        "Room Status Alert",
        `Room ${room.room_number} is now ${newStatus}`,
        "warning",
        "room",
        room.id
      );
    }
  }
}

module.exports = NotificationService;