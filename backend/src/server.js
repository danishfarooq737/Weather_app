// Server bootstrap — the only file that listens on a port.
const config = require('./config');
const createApp = require('./app');

const app = createApp();

const server = app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `DF Weather Telemetry backend running on port ${config.port} ` +
      `(${config.isDemoMode ? 'DEMO mode — no API key set' : 'LIVE mode'})`
  );
});

// Graceful shutdown on SIGTERM / SIGINT (Render, Docker, Ctrl+C).
function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal} — shutting down gracefully.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
