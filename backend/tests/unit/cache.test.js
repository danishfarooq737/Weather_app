const TtlCache = require('../../src/utils/cache');

describe('TtlCache', () => {
  it('stores and returns values', () => {
    const cache = new TtlCache(1000);
    cache.set('london', { temp: 14 });
    expect(cache.get('london')).toEqual({ temp: 14 });
  });

  it('returns null for missing keys', () => {
    const cache = new TtlCache(1000);
    expect(cache.get('nowhere')).toBeNull();
  });

  it('expires entries after the TTL', async () => {
    const cache = new TtlCache(20);
    cache.set('london', { temp: 14 });
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(cache.get('london')).toBeNull();
  });

  it('clears all entries', () => {
    const cache = new TtlCache(1000);
    cache.set('a', 1);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});
