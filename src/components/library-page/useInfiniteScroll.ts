import { useEffect, useRef } from "react";

/**
 * Observes a sentinel element and calls `onLoadMore` whenever it enters the
 * viewport while loading is enabled. The observer is re-created when
 * `itemCount` changes, so successive pages keep loading while the sentinel
 * stays on screen (for example on very tall viewports).
 * @param onLoadMore Callback that loads the next page.
 * @param enabled Whether another page may be loaded.
 * @param itemCount Number of items currently rendered.
 * @returns A ref to attach to the sentinel element.
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  enabled: boolean,
  itemCount: number,
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        callbackRef.current();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, itemCount]);

  return sentinelRef;
}
