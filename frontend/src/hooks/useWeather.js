// useWeather — state machine for a city search.
// States: idle | loading | success | error. A new search cancels the
// previous in-flight request, and unmounting cancels everything.
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWeather } from '../services/weatherApi';

export function useWeather() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const search = useCallback(async (city) => {
    const trimmed = (city || '').trim();
    if (!trimmed) {
      setError({
        type: 'validation',
        message: 'Please enter a city name to search.',
      });
      setStatus('error');
      return;
    }

    // Cancel any previous in-flight request.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError(null);
    try {
      const result = await fetchWeather(trimmed, controller.signal);
      setData(result);
      setStatus('success');
    } catch (err) {
      if (err && err.type === 'cancelled') return; // superseded by a newer search
      setError(err);
      setStatus('error');
    }
  }, []);

  const clear = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setData(null);
    setError(null);
    setStatus('idle');
  }, []);

  useEffect(
    () => () => {
      if (abortRef.current) abortRef.current.abort();
    },
    []
  );

  return { status, data, error, search, clear, loading: status === 'loading' };
}
