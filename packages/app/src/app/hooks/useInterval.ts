import { useEffect, useRef } from 'react';

const noop = () => undefined;

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const tick = () => {
        if (savedCallback?.current) {
          savedCallback.current();
        }
      };

      const interval = setInterval(tick, delay);

      return () => clearInterval(interval);
    }

    return noop;
  }, [delay]);
};
