import { useEffects } from 'app/overmind';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
  const { browser } = useEffects();
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item: T | null = browser.storage.get<T>(key);
      return item ?? initialValue;
    } catch (error) {
      console.error(
        `[persisted-state]: Failed to retrieve data from local storage`,
        error
      );
      return initialValue;
    }
  });

  useEffect(
    () =>
      browser.storage.subscribe<T>(key, updatedValue => {
        if (updatedValue === undefined) {
          setStoredValue(initialValue);
        } else {
          setStoredValue(updatedValue as T);
        }
      }),
    [storedValue]
  );

  const setValue: Dispatch<SetStateAction<T>> = value => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      browser.storage.set<T>(key, valueToStore);
    } catch (error) {
      console.error(`[persisted-state]:`, error);
    }
  };

  const clearValue = () => {
    try {
      setStoredValue(initialValue);
      browser.storage.remove(key);
    } catch (error) {
      console.error(`[persisted-state]:`, error);
    }
  };
  return [storedValue, setValue, clearValue];
};
