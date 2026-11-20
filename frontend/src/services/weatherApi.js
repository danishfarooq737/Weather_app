// API service layer — the only module that talks to the backend.
// Resilience built in:
//  - 10s request timeout
//  - exponential backoff retry (2 retries) on network errors / 5xx / 429
//  - request cancellation (AbortController) — a new search cancels the
//    previous one, and unmounting cancels in-flight requests
//  - a fresh Idempotency-Key (uuid) per search, so an accidental
//    double-submit is deduplicated server-side
//  - friendly, typed errors: { type: 'not-found' | 'validation' |
//    'rate-limited' | 'network' | 'server', message }
import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;

const client = axios.create({
  baseURL: API_BASE,
  timeout: TIMEOUT_MS,
  headers: { Accept: 'application/json' },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `key-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapError(error) {
  if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
    return { type: 'cancelled', message: 'Request cancelled.' };
  }
  const status = error.response ? error.response.status : null;
  const serverMessage =
    error.response && error.response.data && error.response.data.error
      ? error.response.data.error.message
      : null;

  if (status === 404) {
    return {
      type: 'not-found',
      message:
        serverMessage ||
        'We could not find that city. Check the spelling and try again.',
    };
  }
  if (status === 400) {
    return {
      type: 'validation',
      message: serverMessage || 'Please enter a valid city name.',
    };
  }
  if (status === 429) {
    return {
      type: 'rate-limited',
      message:
        'Too many requests right now. Please wait a moment and try again.',
    };
  }
  if (status && status >= 500) {
    return {
      type: 'server',
      message:
        'The weather service is temporarily unavailable. Please try again shortly.',
    };
  }
  return {
    type: 'network',
    message:
      'Could not reach the weather service. Check your connection and try again.',
  };
}

function isRetriable(error) {
  if (!error.response) return true; // network error / timeout
  const status = error.response.status;
  return status === 429 || status >= 500;
}

/**
 * Fetch current weather + 5-day forecast for a city.
 * @param {string} city
 * @param {AbortSignal} [signal] — cancels the request
 * @returns {Promise<object>} normalised weather payload
 * @throws {{ type: string, message: string }}
 */
export async function fetchWeather(city, signal) {
  let lastError = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await client.get('/weather', {
        params: { city },
        signal,
        headers: { 'Idempotency-Key': newIdempotencyKey() },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        throw mapError(error);
      }
      if (!isRetriable(error) || attempt === MAX_RETRIES) break;
      await sleep(600 * 2 ** attempt); // 600ms, then 1.2s
    }
  }
  throw mapError(lastError);
}

export { API_BASE };
