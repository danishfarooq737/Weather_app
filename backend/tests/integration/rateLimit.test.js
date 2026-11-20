// Rate-limit test with deliberately low limits (set before the app is
// required, because config is read at require time).
process.env.RATE_LIMIT_WEATHER_MAX = '3';
process.env.RATE_LIMIT_WEATHER_WINDOW_MS = '60000';
process.env.RATE_LIMIT_GLOBAL_MAX = '100';

const request = require('supertest');
const createApp = require('../../src/app');

describe('rate limiting', () => {
  it('returns 429 after the weather limit is exceeded', async () => {
    const app = createApp();
    for (let i = 0; i < 3; i += 1) {
      const res = await request(app).get('/api/weather?city=London');
      expect(res.status).toBe(200);
    }
    const blocked = await request(app).get('/api/weather?city=London');
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe('RATE_LIMITED');
  });
});
