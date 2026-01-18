const Notification = require("../models/Notification");

// Test notification creation
async function testNotification() {
  try {
    console.log("Testing notification creation...");
    
    // Create a test notification
    const notification = await Notification.create({
      user_id: "test-user-id", // Replace with actual user ID
      title: "Test Notification",
      message: "This is a test notification to verify the system is working",
      type: "info",
      entity_type: "system",
      entity_id: null
    });
    
    console.log("Test notification created:", notification);
    
    // Get recent notifications
    const recentNotifications = await Notification.getRecent("test-user-id", 5);
    console.log("Recent notifications:", recentNotifications);
    
    // Get unread count
    const unreadCount = await Notification.countUnread("test-user-id");
    console.log("Unread count:", unreadCount);
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testNotification();