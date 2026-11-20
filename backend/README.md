# DF Weather Telemetry — Backend

Secure Express API that serves real-time weather and 5-day forecasts from
OpenWeatherMap, with a built-in demo mode (seed data) when no API key is
configured.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then add your OpenWeatherMap key (optional)
npm run dev            # http://localhost:5000
```

## Environment

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port to listen on | `5000` |
| `OPENWEATHER_API_KEY` | Free key from openweathermap.org (leave placeholder for demo mode) | `your_api_key_here` |
| `OPENWEATHER_TIMEOUT_MS` | Upstream request timeout | `8000` |
| `OPENWEATHER_MAX_RETRIES` | Retries on transient upstream failures | `3` |
| `CORS_ORIGIN` | Comma-separated allowed browser origins (no `*`) | `http://localhost:5173` |
| `RATE_LIMIT_GLOBAL_MAX` | Global requests per 15 min / IP | `100` |
| `RATE_LIMIT_WEATHER_MAX` | Weather requests per 15 min / IP | `30` |
| `CACHE_TTL_MS` | Weather cache TTL | `600000` (10 min) |
| `IDEMPOTENCY_TTL_MS` | Idempotency-key store TTL | `600000` (10 min) |

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service status (`ok`, `mode: demo\|live`) |
| `GET` | `/api/weather?city=London` | Current weather + 5-day forecast |
| `GET` | `/api/weather/forecast?city=London` | 5-day forecast only |

Send an `Idempotency-Key: <uuid>` header with weather requests: an
identical key + city within 10 minutes replays the stored response
(header `X-Idempotency-Replayed: true`) instead of re-running the
request.

## Demo mode

With no key (or the placeholder), the API serves realistic seed data
for **London, Islamabad, New York, Tokyo, Dubai** and flags every
response with `"demo": true`. Any other city returns a clean 404.

## Tests

```bash
npm test            # unit + integration (Jest + supertest)
npm run test:coverage
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start with file watching |
| `npm test` | Run the test suite |
