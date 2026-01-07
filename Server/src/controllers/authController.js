const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiResponse = require("../utils/response");
const config = require("../config/env");

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

/**
 * Register new user
 */
const register = async (req, res, next) => {
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

    // Create user
    const user = await User.create(req.body);

    // Generate token
    const token = generateToken(user.id, user.role);

    ApiResponse.created(
      res,
      {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      "User registered successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return ApiResponse.unauthorized(res, "Invalid credentials");
    }

    // Check if user is active
    if (!user.is_active) {
      return ApiResponse.forbidden(res, "Account is inactive");
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return ApiResponse.unauthorized(res, "Invalid credentials");
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id, user.role);

    ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          last_login: user.last_login,
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    ApiResponse.success(res, {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      last_login: user.last_login,
      created_at: user.created_at,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ["name", "email", "phone", "password"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return ApiResponse.badRequest(res, "No valid fields to update");
    }

    const user = await User.update(req.user.id, updates);

    ApiResponse.success(
      res,
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      "Profile updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return ApiResponse.badRequest(
        res,
        "Current and new password are required"
      );
    }

    // Get user with password
    const user = await User.findById(req.user.id);

    if (!user || !user.password_hash) {
      return ApiResponse.unauthorized(res, "User not found");
    }

    // Verify current password
    const isValidPassword = await User.verifyPassword(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      return ApiResponse.unauthorized(res, "Current password is incorrect");
    }

    // Update password
    await User.update(req.user.id, { password: newPassword });

    ApiResponse.success(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
