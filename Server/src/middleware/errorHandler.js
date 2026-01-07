const ApiResponse = require("../utils/response");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // MySQL errors
  if (err.code === "ER_DUP_ENTRY") {
    return ApiResponse.conflict(res, "Duplicate entry found", {
      field: err.sqlMessage,
    });
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return ApiResponse.badRequest(res, "Referenced record not found");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.unauthorized(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, "Token expired");
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return ApiResponse.badRequest(res, "Validation error", err.details);
  }

  // Default error
  return ApiResponse.error(
    res,
    err.message || "Internal server error",
    err.statusCode || 500
  );
};

module.exports = errorHandler;
