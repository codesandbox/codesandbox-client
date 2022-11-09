import { useState } from 'react';
import { useEffects } from 'app/overmind';

/**
 * Localstorage keys used for dismissible modals and banners.
 */
type DismissibleKeys = 'DASHBOARD_RECENT_UPGRADE';

type Dismissibles = Partial<Record<DismissibleKeys, true>>;

// export const useLocalPersistedState = <T>(
//   key: string,
//   initialValue: T
// ): [T, (arg: T) => void] => {

//   const [storedValue, setStoredValue] = useState<T>(() => {
//     try {
//       const item: T | null = storage.get(key);
//       return item ?? initialValue;
//     } catch (error) {
//       logger.error(
//         `[persisted-state]: Failed to retrieve data from local storage`,
//         error
//       );
//       return initialValue;
//     }
//   });

//   const setValue = (value: T) => {
//     try {
//       const valueToStore =
//         value instanceof Function ? value(storedValue) : value;
//       setStoredValue(value);
//       storage.set(key, valueToStore);
//     } catch (error) {
//       logger.error(`[persisted-state]:`, error);
//     }
//   };
//   return [storedValue, setValue];
// };

export const useDismissible = (key: DismissibleKeys): [boolean, () => void] => {
  const { browser } = useEffects();
  const [isDismissed, setIsDismissed] = useState(() => {
    const dismissibles = browser.storage.get<Dismissibles>('DISMISSIBLES');
    return dismissibles?.[key] === true;
  });

  const dismiss = () => {
    // Getting the dismissibles again to make sure other instances aren't
    // overwritten after the hook initialised.
    const prevDismissibles =
      browser.storage.get<Dismissibles>('DISMISSIBLES') || {};

    browser.storage.set('DISMISSIBLES', {
      ...prevDismissibles,
      [key]: true,
    });
    setIsDismissed(true);
  };

  return [isDismissed, dismiss];
};
