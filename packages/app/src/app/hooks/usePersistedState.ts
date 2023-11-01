import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

export const useGlobalPersistedState = <T>(
  key: string,
  initialValue: T,
  version?: number
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const storageKey = `CSB/${key}${version ? '/' + version : ''}`;
  return usePersistedState(storageKey, initialValue);
};

export const useScopedPersistedState = <T>(
  key: string,
  initialValue: T,
  scope: string,
  version?: number
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const storageKey = `CSB/${key}/${version ? version + '/' : ''}${scope}`;
  return usePersistedState(storageKey, initialValue);
};

const usePersistedState = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item: T | null = JSON.parse(localStorage.getItem(key));
      return item ?? initialValue;
    } catch (error) {
      console.error(
        `[persisted-state]: Failed to retrieve data from local storage`,
        error
      );
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = value => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`[persisted-state]:`, error);
    }
  };

  const clearValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[persisted-state]:`, error);
    }
  };
  return [storedValue, setValue, clearValue];
};
