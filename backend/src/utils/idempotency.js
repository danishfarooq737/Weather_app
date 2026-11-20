// Idempotency store: deduplicates duplicate submissions (the classic
// "double-click" problem). A client sends an `Idempotency-Key` header
// with a search; if the same key + city arrives again within the TTL,
// the stored response is replayed instead of re-running the request.
//
// Keys are scoped per route + city, and only replay when the payload
// matches, so a key can never return another city's data.
class IdempotencyStore {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  static buildKey(route, key, fingerprint) {
    return `${route}:${key}:${fingerprint}`;
  }

  get(route, key, fingerprint) {
    if (!key) return null;
    const entry = this.store.get(IdempotencyStore.buildKey(route, key, fingerprint));
    if (!entry) return null;
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.store.delete(IdempotencyStore.buildKey(route, key, fingerprint));
      return null;
    }
    return entry.value;
  }

  set(route, key, fingerprint, value) {
    if (!key) return;
    this.store.set(IdempotencyStore.buildKey(route, key, fingerprint), {
      value,
      createdAt: Date.now(),
    });
  }

  clear() {
    this.store.clear();
  }
}

module.exports = IdempotencyStore;
