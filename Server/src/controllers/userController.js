const User = require("../models/User");
const ApiResponse = require("../utils/response");

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, is_active, search, page = 1, limit = 10 } = req.query;

    const filters = {
      role,
      is_active: is_active !== undefined ? is_active === "true" : undefined,
      search,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const users = await User.findAll(filters);
    const total = await User.count({ role, is_active: filters.is_active });

    ApiResponse.success(res, {
      users,
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
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user
 */
const createUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    // Check if username exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return ApiResponse.conflict(res, "Username already exists");
    }

    // Check if email exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return ApiResponse.conflict(res, "Email already exists");
    }

    const user = await User.create(req.body);

    ApiResponse.created(res, user, "User created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Check username conflict
    if (req.body.username && req.body.username !== existingUser.username) {
      const usernameExists = await User.findByUsername(req.body.username);
      if (usernameExists) {
        return ApiResponse.conflict(res, "Username already exists");
      }
    }

    // Check email conflict
    if (req.body.email && req.body.email !== existingUser.email) {
      const emailExists = await User.findByEmail(req.body.email);
      if (emailExists) {
        return ApiResponse.conflict(res, "Email already exists");
      }
    }

    const user = await User.update(userId, req.body);

    ApiResponse.success(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (soft delete)
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion
    if (userId === req.user.id) {
      return ApiResponse.badRequest(res, "You cannot delete your own account");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    await User.delete(userId);

    ApiResponse.success(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Reset user password (admin only)
 */
const resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Prevent self-password reset
    if (userId === req.user.id) {
      return ApiResponse.badRequest(res, "You cannot reset your own password. Use the profile settings instead.");
    }

    // Validate new password
    if (!newPassword) {
      return ApiResponse.badRequest(res, "New password is required");
    }

    if (newPassword.length < 6) {
      return ApiResponse.badRequest(res, "Password must be at least 6 characters long");
    }

    // Update password
    await User.update(userId, { password: newPassword });

    ApiResponse.success(res, null, "Password reset successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
};
