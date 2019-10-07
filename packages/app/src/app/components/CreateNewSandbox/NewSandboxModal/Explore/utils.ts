import { useState, useEffect } from 'react';

export const makeTemplates = sandboxes =>
  sandboxes.map(sandbox => ({
    short_id: sandbox.objectID,
    ...sandbox,
    sandbox: {
      id: sandbox.objectID,
      ...sandbox,
      source: {
        ...sandbox,
      },
    },
    ...sandbox.custom_template,
  }));

export function useDebounce(value: string | number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
}
