// DF Weather Telemetry — app shell.
// Orchestrates the search state machine (useWeather), the dynamic
// weather gradient (cross-fading motion layers), and the animated
// transitions between empty / loading / error / success states.
import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudSun, Radio } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import Loader from './components/Loader';
import ErrorBanner from './components/ErrorBanner';
import EmptyState from './components/EmptyState';
import { useWeather } from './hooks/useWeather';
import { themeFor } from './utils/weatherTheme';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'DF Weather Telemetry';

export default function App() {
  const { status, data, error, search, loading } = useWeather();
  const [lastCity, setLastCity] = useState('');

  const handleSearch = useCallback(
    (city) => {
      setLastCity(city);
      search(city);
    },
    [search]
  );

  const theme = useMemo(() => {
    if (data && data.current) {
      return themeFor(
        data.current.condition,
        data.current.icon,
        data.current.sunrise,
        data.current.sunset,
        data.current.dt
      );
    }
    // Default hero gradient before the first search.
    return {
      gradient:
        'linear-gradient(160deg, #0b1220 0%, #1e3a5f 45%, #155e75 80%, #0f172a 100%)',
      accent: '#7dd3fc',
      glow: 'rgba(125, 211, 252, 0.3)',
      label: 'Welcome',
    };
  }, [data]);

  const themeKey = data
    ? `${data.current.condition}-${data.current.icon}`
    : 'default';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic background: cross-fading gradient layers. */}
      <AnimatePresence>
        <motion.div
          key={themeKey}
          className="fixed inset-0"
          style={{ background: theme.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      </AnimatePresence>
      {/* Soft ambient glow that follows the accent colour. */}
      <div
        className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full blur-3xl transition-all duration-700"
        style={{ background: theme.glow }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-glass"
            >
              <CloudSun className="h-6 w-6 text-amber-300" aria-hidden="true" />
            </motion.div>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl">
                {APP_NAME}
              </h1>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Real-time climate telemetry
              </p>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <Radio className="h-3.5 w-3.5" aria-hidden="true" />
            Live · OpenWeatherMap
          </span>
        </motion.header>

        {/* Search */}
        <div className="mt-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Content states */}
        <main className="mt-6 flex flex-1 flex-col gap-6">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader />
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorBanner
                  error={error}
                  onRetry={lastCity ? () => handleSearch(lastCity) : undefined}
                />
              </motion.div>
            )}

            {status === 'success' && data && (
              <motion.div
                key={`result-${data.city}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <CurrentWeather data={data} />
                <ForecastList forecast={data.forecast} />
                {data.demo && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-white/55"
                  >
                    Showing demo data — add a free OpenWeatherMap key in
                    backend/.env to fetch live weather for any city.
                  </motion.p>
                )}
              </motion.div>
            )}

            {status === 'idle' && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState onPick={handleSearch} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 text-center text-xs text-white/50"
        >
          DF Weather Telemetry · Data: OpenWeatherMap · Built with React,
          Express &amp; Framer Motion
        </motion.footer>
      </div>
    </div>
  );
}
