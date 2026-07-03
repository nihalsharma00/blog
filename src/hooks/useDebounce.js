import { useEffect, useState } from 'react';

/**
 * Debounces a value by the given delay.
 * @param {*} value
 * @param {number} delay - milliseconds
 * @returns {*} debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
