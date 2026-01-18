const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");

// All routes require authentication
router.use(authenticate);

// Get notifications for authenticated user
router.get("/", notificationController.getUserNotifications);

// Get unread notifications count
router.get("/unread-count", notificationController.getUnreadCount);

// Get recent notifications for dashboard
router.get("/recent", notificationController.getRecentNotifications);

// Mark notification as read
router.put("/:id/read", notificationController.markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", notificationController.markAllAsRead);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;