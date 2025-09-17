import { useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedCallback = useRef(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay)
  );

  // Update the delay if it changes
  const currentDelay = useRef(delay);
  if (currentDelay.current !== delay) {
    debouncedCallback.current.cancel();
    debouncedCallback.current = debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay);
    currentDelay.current = delay;
  }

  return useCallback(
    (...args: Parameters<T>) => {
      debouncedCallback.current(...args);
    },
    []
  ) as T;
}