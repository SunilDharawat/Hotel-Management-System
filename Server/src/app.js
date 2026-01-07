const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const config = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// API Routes
app.use(`/api/${config.apiVersion}`, routes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Hotel Management System API",
    version: config.apiVersion,
    documentation: `/api/${config.apiVersion}/health`,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
