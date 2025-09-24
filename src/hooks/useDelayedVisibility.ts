import { useEffect, useRef, useState } from 'react';

export interface UseDelayedVisibilityOptions {
  /** Delay before the indicator becomes visible (ms). Defaults to 100. */
  enterDelayMs?: number;
  /** Minimum duration the indicator remains visible once shown (ms). Defaults to 300. */
  minVisibleMs?: number;
  /** Additional exit delay after the minimum visibility window (ms). Defaults to 0. */
  exitDelayMs?: number;
}

/**
 * Controls visibility for loading indicators so that they do not flicker.
 */
export function useDelayedVisibility(
  isActive: boolean,
  {
    enterDelayMs = 100,
    minVisibleMs = 300,
    exitDelayMs = 0,
  }: UseDelayedVisibilityOptions = {}
) {
  const [visible, setVisible] = useState(false);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleSinceRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (enterTimerRef.current) {
        clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };

    if (isActive) {
      if (visible) {
        // Already visible, no changes required.
        return () => undefined;
      }

      clearTimers();
      enterTimerRef.current = setTimeout(() => {
        visibleSinceRef.current =
          typeof performance !== 'undefined' ? performance.now() : Date.now();
        setVisible(true);
      }, enterDelayMs);
    } else {
      if (!visible) {
        clearTimers();
        visibleSinceRef.current = null;
        return () => undefined;
      }

      const now =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      const startedAt = visibleSinceRef.current ?? now;
      const elapsed = now - startedAt;
      const remaining = Math.max(minVisibleMs - elapsed, 0) + exitDelayMs;

      clearTimers();
      exitTimerRef.current = setTimeout(() => {
        visibleSinceRef.current = null;
        setVisible(false);
      }, remaining);
    }

    return () => {
      clearTimers();
    };
  }, [isActive, visible, enterDelayMs, minVisibleMs, exitDelayMs]);

  return visible;
}
