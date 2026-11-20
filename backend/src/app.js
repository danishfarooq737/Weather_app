// Express app factory (no listening here — that is server.js).
// Keeping the app separate makes it testable with supertest.
const express = require('express');
const config = require('./config');
const securityMiddleware = require('./middleware/security');
const { globalLimiter } = require('./middleware/rateLimit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const weatherRoutes = require('./routes/weatherRoutes');

function createApp() {
  const app = express();

  // Trust the first proxy hop (Render / Vercel / nginx) so rate
  // limiting sees the real client IP.
  app.set('trust proxy', 1);

  // Security headers + strict CORS allowlist.
  securityMiddleware(app);

  // JSON parsing with a small, safe body limit (this API is GET-only,
  // so bodies should never be large).
  app.use(express.json({ limit: '10kb' }));

  // Global rate limit on every route.
  app.use(globalLimiter);

  // Health check — used by Render and by monitoring.
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'df-weather-telemetry-backend',
      mode: config.isDemoMode ? 'demo' : 'live',
      timestamp: new Date().toISOString(),
    });
  });

  // Weather endpoints.
  app.use('/api/weather', weatherRoutes);

  // 404 for anything else, then the global error handler.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
