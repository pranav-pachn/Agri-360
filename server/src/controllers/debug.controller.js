const logger = require('../utils/logger');

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
  tfService = require('../../ai/crop-intelligence/tensorflow-service');
} catch (err) {
  logger.warn('Debug: tensorflow-service not available to debug endpoint:', err.message);
  tfService = null;
}

const smoke = async (req, res, next) => {
  try {
    const sampleLocation = 'Pune, Maharashtra';

    const weather = weatherService
      ? await weatherService.getWeatherSnapshotByLocation(sampleLocation)
      : { available: false, normalizedCondition: 'normal', location: sampleLocation };

    let inference = null;
    if (tfService && typeof tfService.analyzeCropImage === 'function') {
      // Intentionally pass null imageUrl to trigger mock fallback if TF not loaded
      inference = await tfService.analyzeCropImage(null, 'Wheat', sampleLocation).catch((err) => ({ error: err.message }));
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
