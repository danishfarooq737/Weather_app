// Global error handler — the last stop for every error.
// Silent failure by design: full details (message + stack) are logged
// server-side for debugging, but the client only ever receives a
// generic, safe message. Stack traces and internals never leak in
// production responses.
const ApiError = require('../utils/errors');
const config = require('../config');

function errorHandler(err, req, res, next) {
  // Log everything server-side (never sent to the client).
  // eslint-disable-next-line no-console
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    stack: err.stack,
  });

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
  }

  // CORS rejections and other unexpected errors -> generic 500.
  const status = err.status || 500;
  const message =
    status === 500
      ? 'Something went wrong on our side. Please try again later.'
      : err.message || 'Something went wrong. Please try again later.';
  return res.status(status).json({
    error: { code: 'INTERNAL_ERROR', message },
  });
}

function notFoundHandler(req, res) {
  return res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
  });
}

module.exports = { errorHandler, notFoundHandler };
