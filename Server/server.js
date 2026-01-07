require("dotenv").config();
const app = require("./src/app");
const db = require("./src/config/database");
const config = require("./src/config/env");
const logger = require("./src/utils/logger");

const PORT = config.port;

// Test database connection
db.testConnection();

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  Hotel Management System API           ║
  ║  Environment: ${config.nodeEnv.padEnd(27)}║
  ║  Port: ${PORT.toString().padEnd(33)}║
  ║  API Version: ${config.apiVersion.padEnd(26)}║
  ╚════════════════════════════════════════╝
  `);
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
