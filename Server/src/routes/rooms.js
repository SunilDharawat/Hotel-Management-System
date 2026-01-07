const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");

// All routes require authentication
router.use(authenticate);

// Check availability (public for all authenticated users)
router.get("/availability", roomController.checkAvailability);

// Get all rooms
router.get("/", hasPermission("rooms", "view"), roomController.getAllRooms);

// Get room by ID
router.get("/:id", hasPermission("rooms", "view"), roomController.getRoomById);

// Create room
router.post("/", hasPermission("rooms", "create"), roomController.createRoom);

// Update room
router.put("/:id", hasPermission("rooms", "edit"), roomController.updateRoom);

// Update room status
router.patch(
  "/:id/status",
  hasPermission("rooms", "edit"),
  roomController.updateRoomStatus
);

// Update housekeeping status
router.patch(
  "/:id/housekeeping",
  hasPermission("rooms", "edit"),
  roomController.updateHousekeepingStatus
);

// Delete room
router.delete(
  "/:id",
  hasPermission("rooms", "delete"),
  roomController.deleteRoom
);

module.exports = router;
