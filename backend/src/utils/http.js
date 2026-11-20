// Outbound HTTP helper with resilience baked in:
//  - per-request timeout via AbortController (no hanging requests)
//  - exponential backoff retry (up to maxRetries) on transient failures
//    (network errors, 429, 5xx). 4xx errors are NOT retried — they are
//    the caller's fault, not a transient problem.
const axios = require('axios');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransient(error) {
  if (!error.response) return true; // network error / timeout
  const status = error.response.status;
  return status === 429 || status >= 500;
}

/**
 * GET with timeout + exponential backoff.
 * @param {string} url
 * @param {object} options { params, timeoutMs, maxRetries }
 * @returns {Promise<object>} response data
 */
async function getWithRetry(url, { params = {}, timeoutMs = 8000, maxRetries = 3 } = {}) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await axios.get(url, {
        params,
        timeout: timeoutMs,
        headers: { Accept: 'application/json' },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      if (!isTransient(error) || attempt === maxRetries) break;
      const delay = 500 * 2 ** attempt; // 500ms, 1s, 2s
      await sleep(delay);
    }
  }
  throw lastError;
}

module.exports = { getWithRetry, sleep };
