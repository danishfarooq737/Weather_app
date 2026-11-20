// Security middleware: Helmet headers + strict CORS allowlist.
// No wildcard origin is ever used — only origins listed in CORS_ORIGIN
// (comma-separated) may call the API from a browser.
const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');

function securityMiddleware(app) {
  app.use(helmet());

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (curl, server-to-server, tests)
        // which send no Origin header.
        if (!origin) return callback(null, true);
        if (config.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET'],
      allowedHeaders: ['Content-Type', 'Idempotency-Key'],
      exposedHeaders: ['X-Idempotency-Replayed'],
      credentials: false,
      maxAge: 86400,
    })
  );
}

module.exports = securityMiddleware;
