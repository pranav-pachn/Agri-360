/**
 * Weather Service
 * ===============
 * Integrates with OpenWeatherMap API to fetch real-time weather data
 * and normalize it for risk calculation in the agricultural context.
 *
 * Features:
 * - Geolocation via OpenWeatherMap Geocoding API
 * - Real-time weather data fetching
 * - Weather condition normalization (dry, normal, humid, rainy)
 * - Simple in-memory caching (expires on server restart)
 * - Graceful fallback to 'normal' weather on API failure
 */

const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

// In-memory cache: { 'location_string': { weather, timestamp } }
// Cache expires after 1 hour (3600 seconds)
const WEATHER_CACHE = {};
const CACHE_TTL = 3600; // seconds

/**
 * Normalize OpenWeatherMap weather data to agricultural context
 * @param {Object} weatherData - OpenWeatherMap weather response
 * @returns {string} - Normalized weather: 'dry', 'normal', 'humid', 'rainy'
 */
const normalizeWeather = (weatherData) => {
  if (!weatherData) return 'normal';

  const humidity = weatherData.main?.humidity || 50;
  const cloudiness = weatherData.clouds?.all || 0;
  const description = String(weatherData.weather?.[0]?.main || '').toLowerCase();

  // Classification logic:
  // - Rain/Drizzle/Thunderstorm → 'rainy'
  // - High humidity (>75%) + clouds → 'humid'
  // - Low humidity (<35%) → 'dry'
  // - Default → 'normal'

  if (
    description.includes('rain') ||
    description.includes('drizzle') ||
    description.includes('thunderstorm')
  ) {
    return 'rainy';
  }

  if (humidity > 75 && cloudiness > 50) {
    return 'humid';
  }

  if (humidity < 35) {
    return 'dry';
  }

  return 'normal';
};

/**
 * Get coordinates (lat/lon) from location string via Geocoding API
 * @param {string} location - Location string (e.g., "Punjab, India")
 * @returns {Promise<{lat: number, lon: number}>} - Coordinates or null
 */
const getCoordinatesFromLocation = async (location) => {
  try {
    if (!location || !OPENWEATHER_API_KEY) {
      return null;
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/geo/1.0/direct`,
      {
        params: {
          q: location,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        },
        timeout: 5000
      }
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat, lon };
    }

    return null;
  } catch (error) {
    console.error(`❌ Geocoding API error for location "${location}":`, error.message);
    return null;
  }
};

/**
 * Fetch weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Weather data from OpenWeatherMap
 */
const fetchWeatherByCoordinates = async (lat, lon) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.warn('⚠️ OPENWEATHER_API_KEY not configured');
      return null;
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather`,
      {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        },
        timeout: 5000
      }
    );

    return response.data;
  } catch (error) {
    console.error(`❌ Weather API error for coordinates (${lat}, ${lon}):`, error.message);
    return null;
  }
};

/**
 * Get weather by location string (with caching)
 * @param {string} location - Location string (e.g., "Punjab, India")
 * @returns {Promise<string>} - Normalized weather condition
 */
const getWeatherByLocation = async (location) => {
  try {
    if (!location) {
      return 'normal';
    }

    const locationKey = location.toLowerCase().trim();

    // Check cache
    if (WEATHER_CACHE[locationKey]) {
      const { weather, timestamp } = WEATHER_CACHE[locationKey];
      const ageSeconds = (Date.now() - timestamp) / 1000;

      if (ageSeconds < CACHE_TTL) {
        console.log(`✅ Weather cache hit for "${location}": ${weather}`);
        return weather;
      }

      // Cache expired, delete entry
      delete WEATHER_CACHE[locationKey];
    }

    console.log(`🌦️  Fetching weather for location: "${location}"`);

    // Get coordinates from location string
    const coords = await getCoordinatesFromLocation(location);
    if (!coords) {
      console.log(`⚠️  Could not geocode location "${location}", using 'normal' weather`);
      return 'normal';
    }

    // Fetch weather data
    const weatherData = await fetchWeatherByCoordinates(coords.lat, coords.lon);
    if (!weatherData) {
      console.log(`⚠️  Could not fetch weather for "${location}", using 'normal' weather`);
      return 'normal';
    }

    // Normalize weather
    const normalizedWeather = normalizeWeather(weatherData);

    // Cache result
    WEATHER_CACHE[locationKey] = {
      weather: normalizedWeather,
      timestamp: Date.now()
    };

    console.log(`✅ Weather for "${location}": ${normalizedWeather}`);
    return normalizedWeather;
  } catch (error) {
    console.error(`❌ Error getting weather for location "${location}":`, error.message);
    return 'normal'; // Fallback to neutral weather
  }
};

/**
 * Get weather by coordinates (with caching)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} - Normalized weather condition
 */
const getWeatherByCoordinates = async (lat, lon) => {
  try {
    if (!lat || !lon) {
      return 'normal';
    }

    const coordKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;

    // Check cache
    if (WEATHER_CACHE[coordKey]) {
      const { weather, timestamp } = WEATHER_CACHE[coordKey];
      const ageSeconds = (Date.now() - timestamp) / 1000;

      if (ageSeconds < CACHE_TTL) {
        console.log(`✅ Weather cache hit for coordinates (${lat}, ${lon}): ${weather}`);
        return weather;
      }

      delete WEATHER_CACHE[coordKey];
    }

    console.log(`🌦️  Fetching weather for coordinates: (${lat}, ${lon})`);

    // Fetch weather data
    const weatherData = await fetchWeatherByCoordinates(lat, lon);
    if (!weatherData) {
      console.log(`⚠️  Could not fetch weather for coordinates, using 'normal' weather`);
      return 'normal';
    }

    // Normalize weather
    const normalizedWeather = normalizeWeather(weatherData);

    // Cache result
    WEATHER_CACHE[coordKey] = {
      weather: normalizedWeather,
      timestamp: Date.now()
    };

    console.log(`✅ Weather for (${lat}, ${lon}): ${normalizedWeather}`);
    return normalizedWeather;
  } catch (error) {
    console.error(`❌ Error getting weather for coordinates:`, error.message);
    return 'normal'; // Fallback to neutral weather
  }
};

/**
 * Clear the weather cache (useful for testing)
 */
const clearCache = () => {
  Object.keys(WEATHER_CACHE).forEach(key => delete WEATHER_CACHE[key]);
  console.log('✅ Weather cache cleared');
};

module.exports = {
  getWeatherByLocation,
  getWeatherByCoordinates,
  normalizeWeather,
  clearCache,
  // For testing purposes
  _getCache: () => WEATHER_CACHE,
  _fetchWeatherByCoordinates: fetchWeatherByCoordinates,
  _getCoordinatesFromLocation: getCoordinatesFromLocation
};
