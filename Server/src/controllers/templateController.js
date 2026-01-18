const SMSTemplate = require("../models/SMSTemplate");
const ApiResponse = require("../utils/response");

/**
 * Get all templates
 */
const getAllTemplates = async (req, res, next) => {
  try {
    const { type, is_active } = req.query;

    const templates = await SMSTemplate.findAll({
      type,
      is_active: is_active !== undefined ? is_active === "true" : undefined,
    });

    ApiResponse.success(res, { templates });
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by ID
 */
const getTemplateById = async (req, res, next) => {
  try {
    const template = await SMSTemplate.findById(req.params.id);

    if (!template) {
      return ApiResponse.notFound(res, "Template not found");
    }

    ApiResponse.success(res, template);
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by type
 */
const getTemplateByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    const template = await SMSTemplate.findByType(type);

    if (!template) {
      return ApiResponse.notFound(res, "Template not found for this type");
    }

    ApiResponse.success(res, template);
  } catch (error) {
    next(error);
  }
};

/**
 * Create template
 */
const createTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.create(req.body);

    ApiResponse.created(res, template, "Template created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update template
 */
const updateTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.findById(req.params.id);

    if (!template) {
      return ApiResponse.notFound(res, "Template not found");
    }

    const updated = await SMSTemplate.update(req.params.id, req.body);

    ApiResponse.success(res, updated, "Template updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete template
 */
const deleteTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.findById(req.params.id);

    if (!template) {
      return ApiResponse.notFound(res, "Template not found");
    }

    await SMSTemplate.delete(req.params.id);

    ApiResponse.success(res, null, "Template deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Preview template with variables
 */
const previewTemplate = async (req, res, next) => {
  try {
    const { template_id, variables } = req.body;

    const template = await SMSTemplate.findById(template_id);

    if (!template) {
      return ApiResponse.notFound(res, "Template not found");
    }

    const preview = SMSTemplate.parseTemplate(template, variables || {});

    ApiResponse.success(res, {
      template_id: template.id,
      template_name: template.name,
      preview,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  getTemplateByType,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  previewTemplate,
};
