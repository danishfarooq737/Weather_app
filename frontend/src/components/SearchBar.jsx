// Search bar — debounced auto-search (700ms after typing stops) plus
// explicit submit. The button disables immediately on first click so a
// double-click can never fire two searches.
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

export default function SearchBar({ onSearch, loading, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);
  const lastSearched = useRef('');
  const debounceRef = useRef(null);

  // Debounced auto-search: fires 700ms after the user stops typing.
  useEffect(() => {
    const query = value.trim();
    if (query.length < 3 || query === lastSearched.current || loading) {
      return undefined;
    }
    debounceRef.current = setTimeout(() => {
      lastSearched.current = query;
      onSearch(query);
    }, 700);
    return () => clearTimeout(debounceRef.current);
  }, [value, loading, onSearch]);

  const submit = (event) => {
    event.preventDefault();
    const query = value.trim();
    if (!query || loading) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    lastSearched.current = query;
    onSearch(query);
  };

  return (
    <motion.form
      onSubmit={submit}
      role="search"
      className="glass-strong flex w-full items-center gap-2 rounded-full p-2 pl-5 shadow-glass transition-all duration-300 ease-in-out focus-within:border-white/40 focus-within:shadow-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Search className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
      <label htmlFor="city-search" className="sr-only">
        Search for a city
      </label>
      <input
        id="city-search"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search any city — London, Islamabad, Tokyo…"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/55 focus:outline-none"
      />
      <motion.button
        type="submit"
        disabled={loading || value.trim().length === 0}
        whileHover={!loading ? { scale: 1.04 } : {}}
        whileTap={!loading ? { scale: 0.96 } : {}}
        className="flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-card transition-all duration-300 ease-in-out hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Searching…
          </>
        ) : (
          'Search'
        )}
      </motion.button>
    </motion.form>
  );
}
