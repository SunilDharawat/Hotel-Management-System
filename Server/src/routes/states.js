const express = require("express");
const router = express.Router();
const State = require("../models/State");
const ApiResponse = require("../utils/response");

// Get all states (public endpoint)
router.get("/", async (req, res, next) => {
  try {
    const states = await State.findAll();
    ApiResponse.success(res, { states });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
