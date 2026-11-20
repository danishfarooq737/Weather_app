const request = require('supertest');
const createApp = require('../../src/app');
const { clearCache } = require('../../src/services/weatherService');
const { clearIdempotencyStore } = require('../../src/middleware/idempotency');

describe('GET /api/weather (demo mode)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    clearCache();
    clearIdempotencyStore();
  });

  it('returns demo data for London', async () => {
    const res = await request(app).get('/api/weather?city=London');
    expect(res.status).toBe(200);
    expect(res.body.demo).toBe(true);
    expect(res.body.city).toBe('London');
    expect(res.body.current.temp).toBe(14.2);
    expect(res.body.current.humidity).toBe(72);
    expect(res.body.current.pressure).toBe(1015);
    expect(res.body.current.wind_speed).toBe(4.6);
    expect(res.body.forecast).toHaveLength(5);
  });

  it('returns 400 when the city param is missing', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CITY');
    expect(res.body.error.message).toMatch(/City is required/);
  });

  it('returns 400 when the city param is empty', async () => {
    const res = await request(app).get('/api/weather?city=');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CITY');
  });

  it('returns 400 for a city with script/injection characters', async () => {
    const res = await request(app).get('/api/weather?city=%3Cscript%3E');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CITY');
  });

  it('returns a clean 404 for an unknown city (no stack trace)', async () => {
    const res = await request(app).get('/api/weather?city=InvalidCityXYZ');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('CITY_NOT_FOUND');
    expect(res.body.error.message).toMatch(/could not find weather/i);
    expect(JSON.stringify(res.body)).not.toMatch(/stack|at\s+\w+\s+\(/);
  });

  it('returns forecast-only data from /api/weather/forecast', async () => {
    const res = await request(app).get('/api/weather/forecast?city=Dubai');
    expect(res.status).toBe(200);
    expect(res.body.city).toBe('Dubai');
    expect(res.body.forecast).toHaveLength(5);
    expect(res.body.current).toBeUndefined();
  });

  it('replays an identical Idempotency-Key request', async () => {
    const key = 'test-key-123';
    const first = await request(app)
      .get('/api/weather?city=Tokyo')
      .set('Idempotency-Key', key);
    expect(first.status).toBe(200);
    expect(first.headers['x-idempotency-replayed']).toBeUndefined();

    const second = await request(app)
      .get('/api/weather?city=Tokyo')
      .set('Idempotency-Key', key);
    expect(second.status).toBe(200);
    expect(second.headers['x-idempotency-replayed']).toBe('true');
    expect(second.body).toEqual(first.body);
  });

  it('does not replay a key for a different city', async () => {
    const key = 'test-key-456';
    await request(app).get('/api/weather?city=Tokyo').set('Idempotency-Key', key);
    const other = await request(app)
      .get('/api/weather?city=London')
      .set('Idempotency-Key', key);
    expect(other.headers['x-idempotency-replayed']).toBeUndefined();
    expect(other.body.city).toBe('London');
  });
});
