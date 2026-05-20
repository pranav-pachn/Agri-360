const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Try to require the server weather service; it should exist.
let weatherService;
try {
  weatherService = require('../services/weather.service');
} catch (err) {
  logger.warn('Debug: weather.service not available:', err.message);
  weatherService = null;
}

// Try to require the TensorFlow AI service from the AI folder. This is optional
// and may fall back to the enhanced mock service when not present or not loaded.
let tfService;
try {
  tfService = require('../../../ai/crop-intelligence/tensorflow-service');
} catch (err) {
  logger.warn('Debug: tensorflow-service not available to debug endpoint:', err.message);
  tfService = null;
}

const SAMPLE_IMAGE_PATH = path.resolve(__dirname, '../assets/smoke-sample-crop.svg');

const loadSmokeImageBuffer = () => {
  try {
    return fs.readFileSync(SAMPLE_IMAGE_PATH);
  } catch (err) {
    logger.warn('Debug: smoke sample image not available:', err.message);
    return null;
  }
};

const smoke = async (req, res, next) => {
  try {
    const sampleLocation = 'Pune, Maharashtra';

    const weather = weatherService
      ? await weatherService.getWeatherSnapshotByLocation(sampleLocation)
      : { available: false, normalizedCondition: 'normal', location: sampleLocation };

    let inference = null;
    if (tfService && typeof tfService.analyzeCropImage === 'function') {
      const imageBuffer = loadSmokeImageBuffer();
      if (imageBuffer) {
        inference = await tfService.analyzeCropImage(null, 'Wheat', sampleLocation, { imageBuffer })
          .catch((err) => ({ error: err.message }));
      } else {
        inference = { warning: 'smoke sample image unavailable', fallback: true };
      }
    } else {
      inference = { warning: 'tensorflow-service unavailable', fallback: true };
    }

    return res.status(200).json({ ok: true, weather, inference });
  } catch (error) {
    logger.error('Debug smoke endpoint failed:', error);
    return res.status(500).json({ ok: false, error: String(error.message || error) });
  }
};

module.exports = {
  smoke,
};
