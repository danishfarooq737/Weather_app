const express = require('express');
const weatherController = require('../controllers/weatherController');
const { weatherLimiter } = require('../middleware/rateLimit');
const { idempotency } = require('../middleware/idempotency');

const router = express.Router();

// Stricter rate limit + idempotency on the weather endpoints.
router.use(weatherLimiter);
router.use(idempotency);

// Current weather + 5-day forecast, combined in one response.
router.get('/', weatherController.getWeather);

// Forecast only (same data, forecast slice).
router.get('/forecast', weatherController.getForecast);

module.exports = router;
