// Error state — friendly, specific, never a stack trace. Includes a
// retry action so the user is never stuck.
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBanner({ error, onRetry }) {
  const message =
    (error && error.message) ||
    'Something went wrong. Please try again.';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass flex flex-col items-start gap-3 rounded-[2rem] border-red-300/30 bg-red-500/15 px-6 py-5 shadow-glass sm:flex-row sm:items-center"
      role="alert"
    >
      <AlertTriangle className="h-6 w-6 shrink-0 text-red-300" aria-hidden="true" />
      <p className="flex-1 text-sm leading-relaxed text-white">{message}</p>
      {onRetry && (
        <motion.button
          type="button"
          onClick={onRetry}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-white/25"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </motion.button>
      )}
    </motion.div>
  );
}
