const { validateCityQuery, normaliseCity } = require('../../src/validation/weatherValidation');

describe('city validation (Zod schema)', () => {
  it('accepts a normal city name', () => {
    expect(validateCityQuery({ city: 'London' })).toEqual({ city: 'London' });
  });

  it('trims surrounding whitespace', () => {
    expect(validateCityQuery({ city: '  Islamabad  ' })).toEqual({ city: 'Islamabad' });
  });

  it('accepts accented letters, hyphens and apostrophes', () => {
    expect(validateCityQuery({ city: "Saint-Étienne" }).city).toBe("Saint-Étienne");
    expect(validateCityQuery({ city: "O'Brien" }).city).toBe("O'Brien");
  });

  it('rejects an empty city', () => {
    expect(() => validateCityQuery({ city: '' })).toThrow();
    expect(() => validateCityQuery({})).toThrow();
  });

  it('rejects script tags and injection attempts', () => {
    expect(() => validateCityQuery({ city: '<script>alert(1)</script>' })).toThrow();
    expect(() => validateCityQuery({ city: 'London; DROP TABLE users' })).toThrow();
    expect(() => validateCityQuery({ city: 'London/$ne' })).toThrow();
    expect(() => validateCityQuery({ city: 'https://evil.example' })).toThrow();
  });

  it('rejects names longer than 100 characters', () => {
    expect(() => validateCityQuery({ city: 'A'.repeat(101) })).toThrow();
  });

  it('normalises cities for cache keys', () => {
    expect(normaliseCity('  LONDON ')).toBe('london');
  });
});
