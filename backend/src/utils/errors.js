// Domain error type. Controllers throw ApiError; the global error
// handler turns it into a safe client response. Internal details are
// logged server-side only — never sent to the client.
class ApiError extends Error {
  constructor(status, message, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, code = 'BAD_REQUEST') {
    return new ApiError(400, message, code);
  }

  static notFound(message, code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static upstream(message, code = 'UPSTREAM_ERROR') {
    return new ApiError(502, message, code);
  }

  static tooManyRequests(message, code = 'RATE_LIMITED') {
    return new ApiError(429, message, code);
  }
}

module.exports = ApiError;
