// Idempotency middleware for GET /api/weather.
// A client may send `Idempotency-Key: <uuid>`; identical keys for the
// same city within the TTL return the stored response with the
// `X-Idempotency-Replayed: true` header instead of re-running the
// request. This makes accidental duplicate submissions (double-click,
// retry storms) harmless.
const IdempotencyStore = require('../utils/idempotency');
const config = require('../config');

const store = new IdempotencyStore(config.idempotencyTtlMs);

function idempotency(req, res, next) {
  const key = req.get('Idempotency-Key');
  if (!key) return next();

  const fingerprint = (req.query.city || '').trim().toLowerCase();
  const replayed = store.get(req.path, key, fingerprint);
  if (replayed) {
    res.set('X-Idempotency-Replayed', 'true');
    return res.status(200).json(replayed);
  }

  // Wrap res.json so the first successful response is stored.
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      store.set(req.path, key, fingerprint, body);
    }
    return originalJson(body);
  };
  return next();
}

/** Test helper: clear the idempotency store between tests. */
function clearIdempotencyStore() {
  store.clear();
}

module.exports = { idempotency, clearIdempotencyStore };
