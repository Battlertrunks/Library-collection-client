import { useEffect, useState } from "react";

/**
 * Returns a copy of `value` that only updates after `delayMs` without any
 * further changes. Useful for keeping fast-changing input from triggering a
 * request on every keystroke.
 * @param value The value to debounce.
 * @param delayMs The quiet period before the returned value updates.
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
