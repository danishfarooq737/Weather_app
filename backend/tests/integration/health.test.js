const request = require('supertest');
const createApp = require('../../src/app');

describe('GET /api/health', () => {
  it('returns 200 with service status', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('df-weather-telemetry-backend');
    expect(res.body.mode).toBe('demo');
  });

  it('includes security headers from Helmet', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('returns 404 for an unknown route', async () => {
    const app = createApp();
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
