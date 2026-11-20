// 5-day forecast — one animated card per day, rendered with
// Array.map() and staggered entrance. Hover lifts the card.
import { motion } from 'framer-motion';
import { iconFor, formatDate } from '../utils/weatherTheme';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const card = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export default function ForecastList({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <section aria-label="5-day forecast">
      <motion.h3
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 font-display text-lg font-bold text-white sm:text-xl"
      >
        5-day forecast
      </motion.h3>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {forecast.map((day) => {
          const DayIcon = iconFor(day.condition, day.icon);
          return (
            <motion.article
              key={day.date}
              variants={card}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="glass flex flex-col items-center gap-2 rounded-3xl px-3 py-5 text-center shadow-card transition-all duration-300 ease-in-out hover:bg-white/15"
            >
              <p className="text-sm font-semibold text-white">{day.day}</p>
              <p className="text-xs text-white/65">{formatDate(day.date)}</p>
              <DayIcon className="my-1 h-9 w-9 text-amber-300" aria-hidden="true" />
              <p className="text-sm capitalize text-white/85">
                {day.description || day.condition}
              </p>
              <p className="font-display text-lg font-bold text-white">
                {Math.round(day.temp_max)}°
                <span className="mx-1 text-white/40">/</span>
                <span className="font-semibold text-white/70">
                  {Math.round(day.temp_min)}°
                </span>
              </p>
              <p className="text-xs text-white/60">
                Humidity {day.humidity}% · Wind {day.wind_speed} m/s
              </p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
