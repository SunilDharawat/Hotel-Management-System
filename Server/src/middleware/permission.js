const ApiResponse = require("../utils/response");
const db = require("../config/database");
const { USER_ROLES } = require("../config/constants");

/**
 * Check if user has specific role
 */
const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, "Insufficient permissions");
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = hasRole(USER_ROLES.ADMIN);

/**
 * Check if user is admin or manager
 */
const isAdminOrManager = hasRole(USER_ROLES.ADMIN, USER_ROLES.MANAGER);

/**
 * Check object-level permissions from database
 */
const hasPermission = (objectKey, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res, "Authentication required");
      }

      // Admin always has access
      if (req.user.role === USER_ROLES.ADMIN) {
        return next();
      }

      // Check permission from database
      const [rows] = await db.execute(
        `SELECT p.can_view, p.can_create, p.can_edit, p.can_delete
         FROM object_role_permissions p
         JOIN system_objects o ON p.object_id = o.id
         WHERE o.object_key = ? AND p.role = ?`,
        [objectKey, req.user.role]
      );

      if (rows.length === 0) {
        return ApiResponse.forbidden(
          res,
          "No permissions configured for this resource"
        );
      }

      const permission = rows[0];
      const actionMap = {
        view: permission.can_view,
        create: permission.can_create,
        edit: permission.can_edit,
        delete: permission.can_delete,
      };

      if (!actionMap[action]) {
        return ApiResponse.forbidden(
          res,
          `You don't have permission to ${action} this resource`
        );
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return ApiResponse.error(res, "Permission check failed");
    }
  };
};

/**
 * Check if user can modify their own resource
 */
const isOwnerOrAdmin = (resourceUserIdField = "created_by") => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required");
    }

    // Admin can modify anything
    if (req.user.role === USER_ROLES.ADMIN) {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.body[resourceUserIdField] || req.params.userId;

    if (resourceUserId !== req.user.id) {
      return ApiResponse.forbidden(
        res,
        "You can only modify your own resources"
      );
    }

    next();
  };
};

module.exports = {
  hasRole,
  isAdmin,
  isAdminOrManager,
  hasPermission,
  isOwnerOrAdmin,
};
