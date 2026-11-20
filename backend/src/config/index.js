// Centralised, validated configuration. Every value comes from the
// environment (see .env.example); no secret is ever hard-coded here.
require('dotenv').config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseOrigins = (raw) => {
  if (!raw) return ['http://localhost:5173'];
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const config = {
  env: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),

  // OpenWeatherMap. When missing (or still the placeholder) the service
  // runs in demo mode and serves realistic seed data — see seedWeather.js.
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  openWeatherBaseUrl:
    process.env.OPENWEATHER_BASE_URL ||
    'https://api.openweathermap.org/data/2.5',
  openWeatherTimeoutMs: toInt(process.env.OPENWEATHER_TIMEOUT_MS, 8000),
  openWeatherMaxRetries: toInt(process.env.OPENWEATHER_MAX_RETRIES, 3),

  // Strict CORS allowlist. Never '*' — only origins listed here are
  // allowed to call the API from a browser.
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),

  // Rate limits (requests per window, per IP).
  rateLimit: {
    globalWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    globalMax: toInt(process.env.RATE_LIMIT_GLOBAL_MAX, 100),
    weatherWindowMs: toInt(
      process.env.RATE_LIMIT_WEATHER_WINDOW_MS,
      15 * 60 * 1000
    ),
    weatherMax: toInt(process.env.RATE_LIMIT_WEATHER_MAX, 30),
  },

  // In-memory cache TTL for weather responses (ms).
  cacheTtlMs: toInt(process.env.CACHE_TTL_MS, 10 * 60 * 1000),

  // Idempotency-key store TTL (ms).
  idempotencyTtlMs: toInt(process.env.IDEMPOTENCY_TTL_MS, 10 * 60 * 1000),
};

config.isDemoMode =
  !config.openWeatherApiKey ||
  config.openWeatherApiKey === 'your_api_key_here';

module.exports = config;
