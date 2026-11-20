// First-load empty state — a welcoming hero with quick-pick cities so
// the app is useful before the first search, plus a short capability list.
import { motion } from 'framer-motion';
import { CloudSun, MapPin, Gauge, Wind, Droplets } from 'lucide-react';

const POPULAR_CITIES = ['London', 'Islamabad', 'New York', 'Tokyo', 'Dubai'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function EmptyState({ onPick }) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-strong rounded-[2rem] px-6 py-10 text-center shadow-glass sm:px-10"
    >
      <motion.div
        variants={item}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15"
      >
        <CloudSun className="h-10 w-10 text-amber-300" aria-hidden="true" />
      </motion.div>
      <motion.h2
        variants={item}
        className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl"
      >
        Live weather for any city on Earth
      </motion.h2>
      <motion.p variants={item} className="mx-auto mt-3 max-w-xl text-white/75">
        Search a city to see its current temperature, conditions, humidity,
        wind and pressure — plus a 5-day forecast. The background adapts to
        the weather: sunny, rainy, cloudy, snowy or night.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
      >
        <span className="text-sm text-white/60">Try:</span>
        {POPULAR_CITIES.map((city) => (
          <motion.button
            key={city}
            type="button"
            onClick={() => onPick(city)}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-white/25"
          >
            <MapPin className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            {city}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        variants={item}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/65"
      >
        <span className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-sky-300" aria-hidden="true" /> Humidity
        </span>
        <span className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-sky-300" aria-hidden="true" /> Wind speed
        </span>
        <span className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-sky-300" aria-hidden="true" /> Pressure
        </span>
      </motion.div>
    </motion.section>
  );
}
