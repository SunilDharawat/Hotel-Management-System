const Notification = require("../models/Notification");

// Test notification creation
async function testNotification() {
  try {
    console.log("Testing notification creation...");
    
    // Create a test notification
    const notification = await Notification.create({
      user_id: "550e8400-e29b-41d4-a716-446655440001", // Sample user ID
      title: "Test Notification",
      message: "This is a test notification to verify the system is working",
      type: "info",
      entity_type: "system",
      entity_id: null
    });
    
    console.log("Test notification created:", notification);
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testNotification();