const Room = require("../models/Room");
const ApiResponse = require("../utils/response");

/**
 * Get all rooms
 */
const getAllRooms = async (req, res, next) => {
  try {
    const {
      type,
      status,
      floor,
      is_active,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      type,
      status,
      floor: floor ? parseInt(floor) : undefined,
      is_active: is_active !== undefined ? is_active === "true" : undefined,
      search,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const rooms = await Room.findAll(filters);
    const total = await Room.count({
      type,
      status,
      floor: filters.floor,
      is_active: filters.is_active,
    });

    ApiResponse.success(res, {
      rooms,
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
 * Get room by ID
 */
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findByIdWithAmenities(req.params.id);

    if (!room) {
      return ApiResponse.notFound(res, "Room not found");
    }

    ApiResponse.success(res, room);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new room
 */
const createRoom = async (req, res, next) => {
  try {
    const { room_number } = req.body;

    // Check if room number exists
    const existingRoom = await Room.findByRoomNumber(room_number);
    if (existingRoom) {
      return ApiResponse.conflict(res, "Room number already exists");
    }

    const room = await Room.create(req.body);

    ApiResponse.created(res, room, "Room created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update room
 */
const updateRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;

    // Check if room exists
    const existingRoom = await Room.findById(roomId);
    if (!existingRoom) {
      return ApiResponse.notFound(res, "Room not found");
    }

    // Check room number conflict
    if (
      req.body.room_number &&
      req.body.room_number !== existingRoom.room_number
    ) {
      const roomNumberExists = await Room.findByRoomNumber(
        req.body.room_number
      );
      if (roomNumberExists) {
        return ApiResponse.conflict(res, "Room number already exists");
      }
    }

    const room = await Room.update(roomId, req.body);

    ApiResponse.success(res, room, "Room updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete room
 */
const deleteRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return ApiResponse.notFound(res, "Room not found");
    }

    // Check if room has active bookings
    const [activeBookings] = await require("../config/database").execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE room_id = ? AND status IN ('pending', 'confirmed', 'checked_in')`,
      [roomId]
    );

    if (activeBookings[0].count > 0) {
      return ApiResponse.badRequest(
        res,
        "Cannot delete room with active bookings"
      );
    }

    await Room.delete(roomId);

    ApiResponse.success(res, null, "Room deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Check room availability
 */
const checkAvailability = async (req, res, next) => {
  try {
    const { check_in_date, check_out_date, room_type } = req.query;

    if (!check_in_date || !check_out_date) {
      return ApiResponse.badRequest(
        res,
        "Check-in and check-out dates are required"
      );
    }

    const availableRooms = await Room.getAvailableRooms(
      check_in_date,
      check_out_date,
      room_type
    );

    ApiResponse.success(res, {
      check_in_date,
      check_out_date,
      room_type: room_type || "all",
      available_rooms: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update room status
 */
const updateRoomStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return ApiResponse.badRequest(res, "Status is required");
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return ApiResponse.notFound(res, "Room not found");
    }

    const updatedRoom = await Room.updateStatus(req.params.id, status);

    ApiResponse.success(res, updatedRoom, "Room status updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update housekeeping status
 */
const updateHousekeepingStatus = async (req, res, next) => {
  try {
    const { housekeeping_status } = req.body;

    if (!housekeeping_status) {
      return ApiResponse.badRequest(res, "Housekeeping status is required");
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return ApiResponse.notFound(res, "Room not found");
    }

    const updatedRoom = await Room.updateHousekeepingStatus(
      req.params.id,
      housekeeping_status
    );

    ApiResponse.success(
      res,
      updatedRoom,
      "Housekeeping status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  updateRoomStatus,
  updateHousekeepingStatus,
};
