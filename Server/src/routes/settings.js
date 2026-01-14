const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validateSettingKey,
  validateUpdateSetting,
  validateCreateSetting,
} = require("../validators/settingValidator");

// Public endpoint - get general hotel info
router.get("/public/general", settingsController.getGeneralInfo);

// All other routes require authentication
router.use(authenticate);

// Get all settings (as key-value object)
router.get(
  "/",
  hasPermission("settings", "view"),
  settingsController.getAllSettings
);

// Get settings list (with metadata)
router.get(
  "/list",
  hasPermission("settings", "view"),
  settingsController.getSettingsList
);

// Get specific setting
router.get(
  "/:key",
  validateSettingKey,
  hasPermission("settings", "view"),
  settingsController.getSettingByKey
);

// Update specific setting
router.put(
  "/:key",
  validateSettingKey,
  validateUpdateSetting,
  hasPermission("settings", "edit"),
  settingsController.updateSetting
);

// Update multiple settings at once
router.put(
  "/",
  hasPermission("settings", "edit"),
  settingsController.updateMultipleSettings
);

// Create new setting
router.post(
  "/",
  validateCreateSetting,
  hasPermission("settings", "edit"),
  settingsController.createSetting
);

// Delete setting
router.delete(
  "/:key",
  validateSettingKey,
  hasPermission("settings", "delete"),
  settingsController.deleteSetting
);

// Reset to defaults
router.post(
  "/reset",
  hasPermission("settings", "edit"),
  settingsController.resetToDefaults
);

module.exports = router;
