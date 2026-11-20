// Loading state — animated spinner with a calm, professional message.
import { motion } from 'framer-motion';
import { Loader2, Satellite } from 'lucide-react';

export default function Loader({ message = 'Fetching live telemetry…' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass flex flex-col items-center gap-4 rounded-[2rem] px-6 py-14 text-center shadow-glass"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <Satellite className="h-10 w-10 text-amber-300" aria-hidden="true" />
        <Loader2
          className="absolute -right-2 -top-2 h-5 w-5 animate-spin text-white"
          aria-hidden="true"
        />
      </div>
      <p className="text-base font-medium text-white">{message}</p>
      <p className="text-sm text-white/60">
        Contacting the weather station — this usually takes a second.
      </p>
    </motion.div>
  );
}
