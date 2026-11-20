// Tiny in-memory TTL cache. Keys are always built from a validated,
// normalised city name (lower-cased, trimmed) — never from raw user
// input — so there is no injection surface through cache keys.
class TtlCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value) {
    this.store.set(key, { value, createdAt: Date.now() });
    return value;
  }

  clear() {
    this.store.clear();
  }

  get size() {
    return this.store.size;
  }
}

module.exports = TtlCache;
