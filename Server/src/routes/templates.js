const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const {
  validateCreateTemplate,
  validateUpdateTemplate,
  validateTemplateId,
  validatePreviewTemplate,
} = require("../validators/templateValidator");

// All routes require authentication
router.use(authenticate);

// Get all templates
router.get(
  "/",
  hasPermission("sms", "view"),
  templateController.getAllTemplates
);

// Get template by type
router.get(
  "/type/:type",
  hasPermission("sms", "view"),
  templateController.getTemplateByType
);

// Preview template
router.post(
  "/preview",
  validatePreviewTemplate,
  hasPermission("sms", "view"),
  templateController.previewTemplate
);

// Get template by ID
router.get(
  "/:id",
  validateTemplateId,
  hasPermission("sms", "view"),
  templateController.getTemplateById
);

// Create template
router.post(
  "/",
  validateCreateTemplate,
  hasPermission("sms", "create"),
  templateController.createTemplate
);

// Update template
router.put(
  "/:id",
  validateTemplateId,
  validateUpdateTemplate,
  hasPermission("sms", "edit"),
  templateController.updateTemplate
);

// Delete template
router.delete(
  "/:id",
  validateTemplateId,
  hasPermission("sms", "delete"),
  templateController.deleteTemplate
);

module.exports = router;
