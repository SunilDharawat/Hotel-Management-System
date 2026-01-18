const Notification = require("../models/Notification");
const ApiResponse = require("../utils/response");

/**
 * Get notifications for the authenticated user
 */
const getUserNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, is_read, type } = req.query;
    const userId = req.user.id;

    const filters = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    if (is_read !== undefined) {
      filters.is_read = is_read === "true";
    }

    if (type) {
      filters.type = type;
    }

    const notifications = await Notification.findByUserId(userId, filters);
    const unreadCount = await Notification.countUnread(userId);

    ApiResponse.success(res, {
      notifications,
      unread_count: unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notifications.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications count
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Notification.countUnread(userId);

    ApiResponse.success(res, {
      unread_count: unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if notification belongs to user
    const notification = await Notification.findById(id);
    if (!notification) {
      return ApiResponse.notFound(res, "Notification not found");
    }

    if (notification.user_id !== userId) {
      return ApiResponse.forbidden(res, "Access denied");
    }

    const updatedNotification = await Notification.markAsRead(id);

    ApiResponse.success(
      res,
      updatedNotification,
      "Notification marked as read"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const affectedRows = await Notification.markAllAsRead(userId);

    ApiResponse.success(
      res,
      {
        affected_rows: affectedRows,
      },
      "All notifications marked as read"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if notification belongs to user
    const notification = await Notification.findById(id);
    if (!notification) {
      return ApiResponse.notFound(res, "Notification not found");
    }

    if (notification.user_id !== userId) {
      return ApiResponse.forbidden(res, "Access denied");
    }

    const deleted = await Notification.delete(id);

    if (deleted) {
      ApiResponse.success(res, null, "Notification deleted successfully");
    } else {
      ApiResponse.badRequest(res, "Failed to delete notification");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent notifications for dashboard
 */
const getRecentNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;

    const notifications = await Notification.getRecent(userId, parseInt(limit));

    ApiResponse.success(res, {
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getRecentNotifications,
};
