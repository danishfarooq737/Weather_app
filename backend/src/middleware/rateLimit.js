// Rate limiting (express-rate-limit) — the anti-abuse / anti-DDoS
// layer. Two tiers: a generous global limiter and a stricter one on
// the weather endpoints, because those call a paid upstream API.
// Responses are JSON with a generic message; headers expose the
// standard RateLimit-* fields so clients can back off gracefully.
const rateLimit = require('express-rate-limit');
const config = require('../config');

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.globalWindowMs,
  max: config.rateLimit.globalMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please slow down and try again shortly.',
    },
  },
});

const weatherLimiter = rateLimit({
  windowMs: config.rateLimit.weatherWindowMs,
  max: config.rateLimit.weatherMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many weather requests. Please wait a moment and try again.',
    },
  },
});

module.exports = { globalLimiter, weatherLimiter };
