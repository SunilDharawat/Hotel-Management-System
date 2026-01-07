const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/response");
const config = require("../config/env");
const User = require("../models/User");

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Check if user still exists and is active
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.unauthorized(res, "User not found");
    }

    if (!user.is_active) {
      return ApiResponse.forbidden(res, "User account is inactive");
    }

    // Attach user to request
    req.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return ApiResponse.unauthorized(res, "Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      return ApiResponse.unauthorized(res, "Token expired");
    }
    return ApiResponse.error(res, "Authentication failed");
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.id);

      if (user && user.is_active) {
        req.user = {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
