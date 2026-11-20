// Current-conditions hero panel: big temperature, dynamic condition
// icon, description, and the four telemetry metrics (feels-like,
// humidity, wind, pressure) as animated metric chips.
import { motion } from 'framer-motion';
import {
  Droplets,
  Gauge,
  Wind,
  Thermometer,
  Sunrise,
  Sunset,
  MapPin,
} from 'lucide-react';
import { iconFor, formatTime } from '../utils/weatherTheme';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Metric({ icon: Icon, label, value, unit }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.04, y: -2 }}
      className="glass flex flex-col items-center gap-1 rounded-2xl px-3 py-4 text-center transition-all duration-300 ease-in-out"
    >
      <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-white/65">
        {label}
      </span>
      <span className="text-lg font-semibold text-white">
        {value}
        <span className="ml-0.5 text-sm font-normal text-white/70">{unit}</span>
      </span>
    </motion.div>
  );
}

export default function CurrentWeather({ data }) {
  const { city, country, current, demo } = data;
  const ConditionIcon = iconFor(current.condition, current.icon);

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-strong relative overflow-hidden rounded-[2rem] p-6 shadow-glass sm:p-8"
      aria-label={`Current weather in ${city}`}
    >
      {demo && (
        <span className="absolute right-5 top-5 rounded-full bg-amber-400/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900">
          Demo data
        </span>
      )}

      <motion.div variants={item} className="flex items-center gap-2 text-white/80">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          {city}
          {country ? `, ${country}` : ''}
        </h2>
      </motion.div>

      <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <motion.div variants={item} className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15"
          >
            <ConditionIcon className="h-14 w-14 text-amber-300" aria-hidden="true" />
          </motion.div>
          <div>
            <p className="font-display text-6xl font-extrabold leading-none text-white sm:text-7xl">
              {Math.round(current.temp)}°
              <span className="text-3xl font-semibold text-white/70">C</span>
            </p>
            <p className="mt-2 text-base font-medium capitalize text-white/85">
              {current.description || current.condition}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center gap-5 text-sm text-white/75"
        >
          <span className="flex items-center gap-1.5">
            <Sunrise className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {formatTime(current.sunrise)}
          </span>
          <span className="flex items-center gap-1.5">
            <Sunset className="h-4 w-4 text-orange-300" aria-hidden="true" />
            {formatTime(current.sunset)}
          </span>
        </motion.div>
      </div>

      <motion.div
        variants={container}
        className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <Metric icon={Thermometer} label="Feels like" value={Math.round(current.feels_like)} unit="°C" />
        <Metric icon={Droplets} label="Humidity" value={current.humidity} unit="%" />
        <Metric icon={Wind} label="Wind speed" value={current.wind_speed} unit="m/s" />
        <Metric icon={Gauge} label="Pressure" value={current.pressure} unit="hPa" />
      </motion.div>
    </motion.section>
  );
}
