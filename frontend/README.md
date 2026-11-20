# DF Weather Telemetry — Frontend

React + Vite + Tailwind CSS + Framer Motion. Search any city for live
weather and a 5-day forecast, with a dynamic gradient that adapts to
the conditions (sunny / rainy / cloudy / snowy / night).

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend at
`http://localhost:5000`, so the backend must be running too
(`cd ../backend && npm run dev`).

## Environment

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Display name in the header | `DF Weather Telemetry` |

For production, set `VITE_API_URL` to the deployed backend URL, e.g.
`https://df-weather-api.onrender.com/api`.

## Structure

```
src/
  main.jsx               Entry point
  App.jsx                Shell: dynamic gradient, state transitions
  components/            SearchBar, CurrentWeather, ForecastList,
                         Loader, ErrorBanner, EmptyState
  hooks/                 useWeather — search state machine
  services/              weatherApi — axios, timeout, retry, cancel,
                         idempotency key
  utils/                 weatherTheme — gradients + icons per condition
```

## Animations (Framer Motion)

1. **Entrance** — header, search and panels fade/slide in on load.
2. **Staggered forecast cards** — the 5-day cards appear one after
   another (`staggerChildren`).
3. **Micro-interactions** — every button and card scales on hover/tap
   (`whileHover` / `whileTap`, `transition-all duration-300`).
4. **Background cross-fade** — the gradient layer cross-fades between
   weather themes with `AnimatePresence`.

## Tests

```bash
npm test               # Vitest + Testing Library (jsdom)
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite |
