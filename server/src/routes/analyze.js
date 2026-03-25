const express = require("express");
const analysisService = require("../services/analysisService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { crop, location, imageUrl = null } = req.body;

    if (!crop || !location) {
      return res.status(400).json({
        error: "Missing required fields: crop and location"
      });
    }

    const result = await analysisService.generateAnalysis(crop, location, imageUrl);
    return res.status(201).json({
      success: true,
      message: "Analysis completed successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Analysis failed"
    });
  }
});

module.exports = router;