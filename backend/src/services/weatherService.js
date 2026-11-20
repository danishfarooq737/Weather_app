// Weather service — the only place that talks to OpenWeatherMap.
// Responsibilities: demo-mode fallback, live current + forecast fetch,
// response normalisation, caching. It never touches HTTP plumbing of
// the Express layer and never sees raw user input (only a validated
// city name from the controller).
const config = require('../config');
const ApiError = require('../utils/errors');
const TtlCache = require('../utils/cache');
const { getWithRetry } = require('../utils/http');
const { seedCities } = require('../seed/seedWeather');
const { normaliseCity } = require('../validation/weatherValidation');

const cache = new TtlCache(config.cacheTtlMs);

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function normaliseCurrent(city, data) {
  const weather = (data.weather && data.weather[0]) || {};
  return {
    city: data.name || city,
    country: (data.sys && data.sys.country) || '',
    current: {
      temp: Math.round((data.main.temp ?? 0) * 10) / 10,
      feels_like: Math.round((data.main.feels_like ?? 0) * 10) / 10,
      condition: weather.main || 'Unknown',
      description: weather.description || '',
      icon: weather.icon || '01d',
      humidity: data.main.humidity ?? 0,
      pressure: data.main.pressure ?? 0,
      wind_speed: Math.round((data.wind.speed ?? 0) * 10) / 10,
      sunrise: data.sys ? data.sys.sunrise : 0,
      sunset: data.sys ? data.sys.sunset : 0,
      dt: data.dt || Math.floor(Date.now() / 1000),
    },
  };
}

function normaliseForecast(data) {
  // OpenWeatherMap forecast is 3-hourly (40 entries). Aggregate by day:
  // min/max temperature, the midday condition, average humidity/wind.
  const byDay = new Map();
  for (const item of data.list || []) {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0, 10);
    const weather = (item.weather && item.weather[0]) || {};
    const existing = byDay.get(key) || {
      date: key,
      day: DAY_NAMES[date.getUTCDay()],
      temp_min: Infinity,
      temp_max: -Infinity,
      condition: weather.main || 'Unknown',
      description: weather.description || '',
      icon: weather.icon || '01d',
      humiditySum: 0,
      humidityCount: 0,
      windSum: 0,
      windCount: 0,
      middayScore: Infinity,
    };
    existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
    existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
    existing.humiditySum += item.main.humidity ?? 0;
    existing.humidityCount += 1;
    existing.windSum += item.wind.speed ?? 0;
    existing.windCount += 1;
    // Prefer the entry closest to midday (12:00 UTC) for the day's icon.
    const hour = date.getUTCHours();
    const score = Math.abs(hour - 12);
    if (score < existing.middayScore) {
      existing.middayScore = score;
      existing.condition = weather.main || existing.condition;
      existing.description = weather.description || existing.description;
      existing.icon = weather.icon || existing.icon;
    }
    byDay.set(key, existing);
  }
  return [...byDay.values()]
    .slice(0, 5)
    .map((day) => ({
      date: day.date,
      day: day.day,
      temp_min: Math.round(day.temp_min),
      temp_max: Math.round(day.temp_max),
      condition: day.condition,
      description: day.description,
      icon: day.icon,
      humidity: day.humidityCount
        ? Math.round(day.humiditySum / day.humidityCount)
        : 0,
      wind_speed: day.windCount
        ? Math.round((day.windSum / day.windCount) * 10) / 10
        : 0,
    }));
}

async function fetchLive(city) {
  const common = {
    q: city,
    appid: config.openWeatherApiKey,
    units: 'metric',
  };
  const timeoutMs = config.openWeatherTimeoutMs;
  const maxRetries = config.openWeatherMaxRetries;

  let currentData;
  let forecastData;
  try {
    [currentData, forecastData] = await Promise.all([
      getWithRetry(`${config.openWeatherBaseUrl}/weather`, {
        params: common,
        timeoutMs,
        maxRetries,
      }),
      getWithRetry(`${config.openWeatherBaseUrl}/forecast`, {
        params: common,
        timeoutMs,
        maxRetries,
      }),
    ]);
  } catch (error) {
    const status = error.response ? error.response.status : null;
    if (status === 404) {
      throw ApiError.notFound(
        `We could not find weather for "${city}". Please check the spelling and try again.`,
        'CITY_NOT_FOUND'
      );
    }
    if (status === 401) {
      throw ApiError.upstream(
        'The weather service is not configured correctly. Please try again later.',
        'UPSTREAM_AUTH'
      );
    }
    throw ApiError.upstream(
      'The weather service is temporarily unavailable. Please try again in a moment.',
      'UPSTREAM_UNAVAILABLE'
    );
  }

  const current = normaliseCurrent(city, currentData);
  return {
    demo: false,
    city: current.city,
    country: current.country,
    current: current.current,
    forecast: normaliseForecast(forecastData),
  };
}

function fetchDemo(city) {
  const record = seedCities[normaliseCity(city)];
  if (!record) {
    throw ApiError.notFound(
      `We could not find weather for "${city}" in demo mode. Try London, Islamabad, New York, Tokyo or Dubai — or add a real API key for any city.`,
      'CITY_NOT_FOUND'
    );
  }
  return { demo: true, ...record };
}

/**
 * Get current weather + 5-day forecast for a validated city.
 * Order: cache -> demo seed -> live API. Results are cached per city.
 */
async function getWeather(city) {
  const key = normaliseCity(city);
  const cached = cache.get(key);
  if (cached) return cached;

  const result = config.isDemoMode ? fetchDemo(city) : await fetchLive(city);
  cache.set(key, result);
  return result;
}

/** Test helper: clear the in-memory cache between tests. */
function clearCache() {
  cache.clear();
}

module.exports = {
  getWeather,
  clearCache,
  normaliseCurrent,
  normaliseForecast,
};
