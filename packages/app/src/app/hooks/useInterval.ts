// Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import { useEffect, useRef } from 'react';

const noop = () => undefined;
export const useInterval = (callback: () => void = noop, delay: number) => {
  const savedCallback = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id =
      delay !== null ? setInterval(savedCallback.current, delay) : null;

    return () => clearInterval(id);
  }, [delay]);
};
