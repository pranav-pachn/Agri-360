const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_BASE_URL = process.env.OPENWEATHER_GEO_BASE_URL || 'https://api.openweathermap.org/geo/1.0';

const WEATHER_CACHE = {};
const CACHE_TTL = 3600; // seconds

const uniqueStrings = (values = []) => Array.from(
  new Set(
    values
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  )
);

const buildWeatherLocationCandidates = (location) => {
  const rawLocation = String(location || '').trim();
  if (!rawLocation) return [];

  const parts = rawLocation.split(',').map((part) => part.trim()).filter(Boolean);

  const candidates = [rawLocation];

  if (parts.length >= 2) {
    const district = parts[0];
    const state = parts[1];
    const combined = [district, state].filter(Boolean).join(', ');

    candidates.push(combined);
    candidates.push(`${combined}, India`);
    candidates.push(`${combined}, IN`);
    candidates.push([state, 'India'].filter(Boolean).join(', '));
    candidates.push([state, 'IN'].filter(Boolean).join(', '));
  } else {
    candidates.push(`${rawLocation}, India`);
    candidates.push(`${rawLocation}, IN`);
  }

  return uniqueStrings(candidates);
};

const buildUnavailableWeatherSnapshot = (location = '') => ({
  temperatureC: null,
  humidity: null,
  windSpeed: null,
  condition: 'Unavailable',
  normalizedCondition: 'normal',
  location: location || 'Unknown location',
  fetchedAt: new Date().toISOString(),
  available: false,
});

const normalizeWeather = (weatherData) => {
  if (!weatherData) return 'normal';

  const humidity = Number(weatherData.main?.humidity || 50);
  const cloudiness = Number(weatherData.clouds?.all || 0);
  const description = String(weatherData.weather?.[0]?.main || weatherData.weather?.[0]?.description || '').toLowerCase();

  if (description.includes('rain') || description.includes('drizzle') || description.includes('thunderstorm')) {
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

const toWeatherSnapshot = (weatherData, location = '') => ({
  temperatureC: Number.isFinite(Number(weatherData?.main?.temp)) ? Number(weatherData.main.temp) : null,
  humidity: Number.isFinite(Number(weatherData?.main?.humidity)) ? Number(weatherData.main.humidity) : null,
  windSpeed: Number.isFinite(Number(weatherData?.wind?.speed)) ? Number(weatherData.wind.speed) : null,
  condition: weatherData?.weather?.[0]?.main || weatherData?.weather?.[0]?.description || 'Unknown',
  normalizedCondition: normalizeWeather(weatherData),
  location: location || weatherData?.name || 'Unknown location',
  fetchedAt: new Date().toISOString(),
  available: true,
});

const getCoordinatesFromLocation = async (location) => {
  try {
    if (!location || !OPENWEATHER_API_KEY) {
      return null;
    }

    const candidates = buildWeatherLocationCandidates(location);

    for (const candidate of candidates) {
      try {
        const response = await axios.get(`${OPENWEATHER_GEO_BASE_URL}/direct`, {
          params: {
            q: candidate,
            limit: 1,
            appid: OPENWEATHER_API_KEY,
          },
          timeout: 5000,
        });

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return { lat, lon };
        }
      } catch (error) {
        console.error(`Geocoding API error for location "${candidate}":`, error.message);
      }
    }

    return null;
  } catch (error) {
    console.error(`Geocoding API error for location "${location}":`, error.message);
    return null;
  }
};

const fetchWeatherByCoordinates = async (lat, lon) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.warn('OPENWEATHER_API_KEY not configured');
      return null;
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    console.error(`Weather API error for coordinates (${lat}, ${lon}):`, error.message);
    return null;
  }
};

const readCache = (key) => {
  const entry = WEATHER_CACHE[key];
  if (!entry) return null;

  const ageSeconds = (Date.now() - entry.timestamp) / 1000;
  if (ageSeconds < CACHE_TTL) {
    return entry.snapshot;
  }

  delete WEATHER_CACHE[key];
  return null;
};

const writeCache = (key, snapshot) => {
  WEATHER_CACHE[key] = {
    snapshot,
    timestamp: Date.now(),
  };
};

const getWeatherSnapshotByCoordinates = async (lat, lon, location = '') => {
  try {
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) {
      return buildUnavailableWeatherSnapshot(location);
    }

    const coordKey = `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
    const cached = readCache(coordKey);
    if (cached) {
      return cached;
    }

    const weatherData = await fetchWeatherByCoordinates(lat, lon);
    if (!weatherData) {
      return buildUnavailableWeatherSnapshot(location);
    }

    const snapshot = toWeatherSnapshot(weatherData, location);
    writeCache(coordKey, snapshot);
    return snapshot;
  } catch (error) {
    console.error('Error getting weather snapshot by coordinates:', error.message);
    return buildUnavailableWeatherSnapshot(location);
  }
};

const getWeatherSnapshotByLocation = async (location) => {
  try {
    if (!location) {
      return buildUnavailableWeatherSnapshot(location);
    }

    const locationKey = String(location).toLowerCase().trim();
    const cached = readCache(locationKey);
    if (cached) {
      return cached;
    }

    const coords = await getCoordinatesFromLocation(location);
    if (!coords) {
      return buildUnavailableWeatherSnapshot(location);
    }

    const snapshot = await getWeatherSnapshotByCoordinates(coords.lat, coords.lon, location);
    if (snapshot?.available) {
      writeCache(locationKey, snapshot);
    }
    return snapshot;
  } catch (error) {
    console.error(`Error getting weather snapshot for location "${location}":`, error.message);
    return buildUnavailableWeatherSnapshot(location);
  }
};

const getWeatherByLocation = async (location) => {
  const snapshot = await getWeatherSnapshotByLocation(location);
  return snapshot.normalizedCondition || 'normal';
};

const getWeatherByCoordinates = async (lat, lon) => {
  const snapshot = await getWeatherSnapshotByCoordinates(lat, lon);
  return snapshot.normalizedCondition || 'normal';
};

const clearCache = () => {
  Object.keys(WEATHER_CACHE).forEach((key) => delete WEATHER_CACHE[key]);
};

module.exports = {
  getWeatherByLocation,
  getWeatherByCoordinates,
  getWeatherSnapshotByLocation,
  getWeatherSnapshotByCoordinates,
  normalizeWeather,
  clearCache,
  buildUnavailableWeatherSnapshot,
  _getCache: () => WEATHER_CACHE,
  _fetchWeatherByCoordinates: fetchWeatherByCoordinates,
  _getCoordinatesFromLocation: getCoordinatesFromLocation,
};
