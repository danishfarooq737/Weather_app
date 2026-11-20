// Runs in demo mode (no real API key in .env), so these tests exercise
// the seed-data path and the normalisation helpers without network.
const {
  getWeather,
  clearCache,
  normaliseCurrent,
  normaliseForecast,
} = require('../../src/services/weatherService');

describe('weatherService (demo mode)', () => {
  beforeEach(() => clearCache());

  it('returns demo data for a known seed city', async () => {
    const data = await getWeather('London');
    expect(data.demo).toBe(true);
    expect(data.city).toBe('London');
    expect(data.current.temp).toBe(14.2);
    expect(data.current.humidity).toBe(72);
    expect(data.forecast).toHaveLength(5);
    expect(data.forecast[0]).toHaveProperty('date');
    expect(data.forecast[0]).toHaveProperty('temp_min');
    expect(data.forecast[0]).toHaveProperty('temp_max');
  });

  it('matches cities case-insensitively', async () => {
    const data = await getWeather('ISLAMABAD');
    expect(data.city).toBe('Islamabad');
  });

  it('throws a 404 ApiError for an unknown city in demo mode', async () => {
    await expect(getWeather('InvalidCityXYZ')).rejects.toMatchObject({
      status: 404,
      code: 'CITY_NOT_FOUND',
    });
  });

  it('serves the second request for the same city from cache', async () => {
    const first = await getWeather('Tokyo');
    const second = await getWeather('Tokyo');
    expect(second).toBe(first); // same object reference = cache hit
  });

  it('normalises a live current-weather payload', () => {
    const raw = {
      name: 'Paris',
      sys: { country: 'FR', sunrise: 100, sunset: 200 },
      main: { temp: 18.44, feels_like: 17.9, humidity: 60, pressure: 1012 },
      wind: { speed: 3.25 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      dt: 1234567890,
    };
    const result = normaliseCurrent('Paris', raw);
    expect(result.city).toBe('Paris');
    expect(result.current.temp).toBe(18.4);
    expect(result.current.condition).toBe('Clear');
    expect(result.current.wind_speed).toBe(3.3);
  });

  it('aggregates 3-hourly forecast entries into 5 daily cards', () => {
    const base = 1795142400; // 2026-11-20 00:00 UTC
    const list = [];
    for (let day = 0; day < 5; day += 1) {
      for (let slot = 0; slot < 4; slot += 1) {
        list.push({
          dt: base + day * 86400 + slot * 3 * 3600,
          main: { temp_min: 5 + day, temp_max: 10 + day, humidity: 60 },
          wind: { speed: 3 },
          weather: [{ main: 'Clouds', description: 'cloudy', icon: '04d' }],
        });
      }
    }
    const result = normaliseForecast({ list });
    expect(result).toHaveLength(5);
    expect(result[0].date).toBe('2026-11-20');
    expect(result[0].temp_min).toBe(5);
    expect(result[0].temp_max).toBe(10);
    expect(result[4].temp_min).toBe(9);
  });
});
