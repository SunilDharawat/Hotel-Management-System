const Setting = require("../models/Setting");
const ApiResponse = require("../utils/response");

/**
 * Get all settings
 */
const getAllSettings = async (req, res, next) => {
  try {
    const settings = await Setting.getAllAsObject();

    ApiResponse.success(res, settings);
  } catch (error) {
    next(error);
  }
};

/**
 * Get settings list (with metadata)
 */
const getSettingsList = async (req, res, next) => {
  try {
    const settings = await Setting.getAll();

    ApiResponse.success(res, { settings });
  } catch (error) {
    next(error);
  }
};

/**
 * Get setting by key
 */
const getSettingByKey = async (req, res, next) => {
  try {
    const { key } = req.params;

    const setting = await Setting.getByKey(key);

    if (!setting) {
      return ApiResponse.notFound(res, "Setting not found");
    }

    ApiResponse.success(res, setting);
  } catch (error) {
    next(error);
  }
};

/**
 * Update setting
 */
const updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return ApiResponse.badRequest(res, "Setting value is required");
    }

    const setting = await Setting.update(key, value, req.user.id);

    ApiResponse.success(res, setting, "Setting updated successfully");
  } catch (error) {
    if (error.message === "Setting not found") {
      return ApiResponse.notFound(res, error.message);
    }
    next(error);
  }
};

/**
 * Update multiple settings
 */
const updateMultipleSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return ApiResponse.badRequest(res, "No settings provided");
    }

    const settings = await Setting.updateMultiple(updates, req.user.id);

    ApiResponse.success(res, settings, "Settings updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Create new setting
 */
const createSetting = async (req, res, next) => {
  try {
    const { setting_key, setting_value, description } = req.body;

    // Check if setting already exists
    const existing = await Setting.getByKey(setting_key);
    if (existing) {
      return ApiResponse.conflict(res, "Setting with this key already exists");
    }

    const setting = await Setting.create(
      { setting_key, setting_value, description },
      req.user.id
    );

    ApiResponse.created(res, setting, "Setting created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete setting
 */
const deleteSetting = async (req, res, next) => {
  try {
    const { key } = req.params;

    // Prevent deletion of core settings
    const coreSettings = [
      "general",
      "gst_rates",
      "room_pricing",
      "policies",
      "currency",
    ];
    if (coreSettings.includes(key)) {
      return ApiResponse.badRequest(res, "Cannot delete core system settings");
    }

    await Setting.delete(key);

    ApiResponse.success(res, null, "Setting deleted successfully");
  } catch (error) {
    if (error.message === "Setting not found") {
      return ApiResponse.notFound(res, error.message);
    }
    next(error);
  }
};

/**
 * Reset settings to defaults
 */
const resetToDefaults = async (req, res, next) => {
  try {
    const settings = await Setting.resetToDefaults(req.user.id);

    ApiResponse.success(
      res,
      settings,
      "Settings reset to defaults successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get general info (public endpoint)
 */
const getGeneralInfo = async (req, res, next) => {
  try {
    const general = await Setting.getByKey("general");
    const currency = await Setting.getByKey("currency");

    ApiResponse.success(res, {
      hotel: general?.setting_value || {},
      currency: currency?.setting_value || {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSettings,
  getSettingsList,
  getSettingByKey,
  updateSetting,
  updateMultipleSettings,
  createSetting,
  deleteSetting,
  resetToDefaults,
  getGeneralInfo,
};
