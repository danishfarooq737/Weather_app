# DF Weather Telemetry — Real-Time Climate Telemetry

A production-ready MERN-style weather application. Search any city in
the world and get **real-time weather** (temperature, condition with
dynamic icons, humidity, wind speed, atmospheric pressure) plus a
**5-day temperature forecast** — with a background that adapts to the
weather (sunny / rainy / cloudy / snowy / night), smooth Framer Motion
animations, and enterprise-grade security and resilience on the API.

> **Demo without a key:** the backend ships with realistic seed data
> for London, Islamabad, New York, Tokyo and Dubai. Clone, run, and the
> full UI works immediately — responses are flagged `"demo": true`.
> Add a free OpenWeatherMap key to go live for any city.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite 5, Tailwind CSS 3, Framer Motion 11, lucide-react icons, Axios |
| Backend | Node.js + Express 4, Helmet, CORS allowlist, express-rate-limit, Zod, Axios |
| Testing | Jest + Supertest (backend), Vitest + Testing Library (frontend) |
| Data | OpenWeatherMap Current Weather + 5-Day Forecast APIs (free tier) |

## Folder structure

```
DF-Weather-Telemetry-App/
├── README.md                  # this file
├── .gitignore
├── backend/                   # Express API
│   ├── .env / .env.example    # config (placeholders only)
│   ├── package.json           # scripts: start, dev, test
│   ├── README.md
│   └── src/
│       ├── server.js          # bootstrap (listens, graceful shutdown)
│       ├── app.js             # Express app factory (testable)
│       ├── config/            # env config, demo-mode detection
│       ├── routes/            # /api/health, /api/weather
│       ├── controllers/       # thin HTTP layer
│       ├── services/          # weatherService (live API + cache)
│       ├── validation/        # Zod city schema
│       ├── middleware/        # security, rate limit, idempotency, errors
│       ├── utils/             # http (timeout+retry), cache, errors
│       └── seed/              # demo data (London, Islamabad, NY, Tokyo, Dubai)
│   └── tests/                 # unit + integration (Jest + Supertest)
└── frontend/                  # React + Vite app
    ├── .env / .env.example    # VITE_API_URL, VITE_APP_NAME
    ├── package.json           # scripts: dev, build, preview, test
    ├── README.md
    ├── index.html
    ├── tailwind.config.js / postcss.config.js
    └── src/
        ├── main.jsx / App.jsx # shell + dynamic gradient + state transitions
        ├── components/        # SearchBar, CurrentWeather, ForecastList,
        │                      # Loader, ErrorBanner, EmptyState
        ├── hooks/             # useWeather state machine
        ├── services/          # weatherApi (timeout, retry, cancel, idempotency)
        └── utils/             # weatherTheme (gradients + icons per condition)
```

## Quick start (local)

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # optional: add your OpenWeatherMap key
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173, search **London** (or pick a quick-pick
city). In demo mode the data is seeded; with a key it is live.

## Environment setup

**Backend** (`backend/.env`) — see `backend/.env.example` for the full
list. The important ones:

| Variable | Purpose |
| --- | --- |
| `OPENWEATHER_API_KEY` | Free OpenWeatherMap key (placeholder = demo mode) |
| `CORS_ORIGIN` | Allowed browser origins, comma-separated — never `*` |
| `RATE_LIMIT_WEATHER_MAX` | Weather requests per 15 min / IP (default 30) |

**Frontend** (`frontend/.env`):

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend base URL (`http://localhost:5000/api` locally) |
| `VITE_APP_NAME` | Display name in the header |

## How to get a free OpenWeatherMap key

1. Go to https://openweathermap.org/api and click **Sign Up** (free).
2. Confirm your email, then open **My API keys** in your account.
3. Copy the default key (a new key can take up to ~2 hours to activate).
4. Paste it into `backend/.env` as `OPENWEATHER_API_KEY=...` and
   restart the backend. The API switches from demo mode to live mode
   automatically — no code change needed.

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | `{"status":"ok","mode":"demo"\|"live"}` |
| `GET` | `/api/weather?city=London` | Current weather + 5-day forecast |
| `GET` | `/api/weather/forecast?city=London` | 5-day forecast only |

Send an `Idempotency-Key: <uuid>` header with weather requests: an
identical key + city within 10 minutes replays the stored response
(`X-Idempotency-Replayed: true`) instead of re-running the request.

Example response (abridged):

```json
{
  "demo": true,
  "city": "London",
  "country": "GB",
  "current": {
    "temp": 14.2, "feels_like": 12.8, "condition": "Clouds",
    "description": "overcast clouds", "icon": "04d",
    "humidity": 72, "pressure": 1015, "wind_speed": 4.6,
    "sunrise": 1763602800, "sunset": 1763635200
  },
  "forecast": [
    { "date": "2026-11-20", "day": "Fri", "temp_min": 9,
      "temp_max": 15, "condition": "Rain", "icon": "10d",
      "humidity": 81, "wind_speed": 5.2 }
  ]
}
```

## Agile delivery — sprint breakdown

| Sprint | Goal | Delivered |
| --- | --- | --- |
| **Sprint 1** | Setup + backend weather service | Project skeleton, Express app factory, OpenWeatherMap current + 5-day forecast integration, response normalisation, in-memory cache, seed/demo mode |
| **Sprint 2** | Frontend UI + animations | React + Vite + Tailwind shell, search with debounce, current-conditions panel, staggered 5-day forecast cards, dynamic weather gradients, Framer Motion entrance / hover / cross-fade animations |
| **Sprint 3** | Security + resilience | Helmet headers, strict CORS allowlist, Zod input validation, rate limiting, idempotency keys, upstream timeout + exponential-backoff retry, silent-failure error handler |
| **Sprint 4** | Testing + polish | 29 backend tests + 13 frontend tests (all passing), system-test checklist, build verification, deployment docs, README |

## Threat model (what this code prevents)

| Attack vector | Defence |
| --- | --- |
| Injection (SQL/NoSQL, script) | Zod schema: city names allow letters/spaces/hyphens/apostrophes only; `<script>`, `;`, `/`, `$` rejected with 400 before any service runs. No database queries use raw input. |
| Cross-Site Scripting (XSS) | JSON-only API, no reflected HTML; Helmet headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options`); React escapes all rendered values by default. |
| CSRF | No cookies / no session auth — nothing to forge; CORS allowlist rejects unknown origins. |
| Broken access control / open CORS | Strict origin allowlist from env — no `*` wildcard anywhere. |
| DDoS / brute force / API abuse | Global rate limit (100/15 min/IP) + stricter weather limit (30/15 min/IP) with `RateLimit-*` headers; upstream calls cached 10 min per city. |
| Duplicate submissions | `Idempotency-Key` header dedupes identical in-flight/repeated requests server-side; submit button disables on first click client-side. |
| Information leakage | Global error handler logs full details server-side but returns only generic messages; no stack traces in production responses. |
| Slow / hanging upstream | 8s timeout via Axios + exponential backoff (up to 3 attempts) on transient failures; upstream failure returns a clean 502. |
| Secrets exposure | Keys live only in `.env` (git-ignored, placeholders in the repo); no secret is hard-coded anywhere. |

## Edge cases covered

- **Unknown city** → friendly 404 message, no crash, retry offered.
- **Empty / whitespace-only search** → inline validation, no request sent.
- **Malicious input** (`<script>`, SQL fragments, URLs) → 400 rejected.
- **Network drop / slow internet** → loading spinner, timeout (10s),
  exponential-backoff retry, then a clear "check your connection" error.
- **Double-click / double-submit** → button disables instantly +
  server-side idempotency key.
- **Rapid repeated searches** → previous request is cancelled
  (AbortController); only the latest result is shown.
- **Upstream API down / invalid key** → clean 502 / configuration
  message, never a raw upstream error.
- **Rate limit hit** → 429 with a human-readable "wait a moment" message.
- **No API key** → demo mode with seed data, clearly flagged.
- **Mobile / tablet / desktop** → responsive grid (2 → 3 → 5 forecast
  columns), fluid typography, touch-friendly targets.

## Testing

```bash
cd backend  && npm test     # 29 tests — 6 suites (unit + integration)
cd frontend && npm test     # 13 tests — 3 suites (Vitest + Testing Library)
```

Verified on 2026-11-19 (Node 24): **backend 29/29 passed,
frontend 13/13 passed**, `npm run build` succeeds with no errors,
live endpoints verified (`/api/health` 200, demo London data,
400 on empty city, 404 on unknown city, 429 after the rate limit).

### System-test checklist (run before a release)

1. `npm run build` in frontend — must exit 0.
2. Backend `npm test` and frontend `npm test` — all green.
3. Start backend + frontend, search London → data renders.
4. Search `InvalidCityXYZ` → friendly error, no crash.
5. Search with the network off → "check your connection" error.
6. Double-click Search → exactly one request (check Network tab).
7. Rapid-fire 35 searches → 429 appears, then recovers.
8. Resize to 375px / 768px / 1440px → layout holds, no overflow.
9. Add a real key → `mode: live`, search any city (e.g. Paris).

## Deployment

### Backend → Render

1. Push the repo to GitHub (see "Tasks for you").
2. Render Dashboard → **New + → Web Service** → connect the repo.
3. Root directory: `backend`. Build command: `npm install`.
   Start command: `npm start`.
4. Environment variables: `NODE_ENV=production`,
   `OPENWEATHER_API_KEY=<your key>`,
   `CORS_ORIGIN=https://<your-frontend>.vercel.app`.
5. Deploy — note the service URL
   (e.g. `https://df-weather-api.onrender.com`).

### Frontend → Vercel

1. Vercel Dashboard → **Add New → Project** → import the repo.
2. Root directory: `frontend`. Framework preset: **Vite**.
   Build command: `npm run build`. Output directory: `dist`.
3. Environment variable: `VITE_API_URL=https://<your-render-backend>/api`.
4. Deploy — the app is live at `https://<your-app>.vercel.app`.

## Tasks for you (steps only you can do)

1. **Get a free OpenWeatherMap key** at https://openweathermap.org/api
   (sign up → confirm email → My API keys → copy the key; it can take
   up to ~2 hours to activate).
2. **Put the key in `backend/.env`** as
   `OPENWEATHER_API_KEY=<your key>` (replace the placeholder) and
   restart the backend.
3. **Push to GitHub:** `git init && git add . && git commit -m "DF
   Weather Telemetry" && git remote add origin <your-repo-url> &&
   git push -u origin main` (from the project root).
4. **Deploy the backend on Render** and the **frontend on Vercel**
   using the steps above; set `CORS_ORIGIN` on Render to your Vercel
   URL and `VITE_API_URL` on Vercel to your Render URL.
5. **Send the zip (or the GitHub link) to your manager.** No other
   setup is needed — the app runs in demo mode even without a key.

## License

MIT — free to use, modify and distribute.
