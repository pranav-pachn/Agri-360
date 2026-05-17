const logger = require('../utils/logger');
const weatherService = require('../services/weather.service');
const { calculateWeatherImpact } = require('../services/weatherImpact.service');

const getCurrentWeather = async (req, res, next) => {
  try {
    const location = String(req.query.location || '').trim();

    if (!location) {
      return res.status(400).json({
        error: 'Missing query parameter: location is required',
      });
    }

    logger.info(`Fetching live weather for location: ${location}`);
    const weather = await weatherService.getWeatherSnapshotByLocation(location);
    const impact = calculateWeatherImpact(weather);

    return res.status(200).json({ weather, impact });
  } catch (error) {
    logger.error('Weather fetch error:', error);
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
};
