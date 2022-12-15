import { useEffects } from 'app/overmind';
import { useEffect } from 'react';

const KEY = 'DASHBOARD_FIRST_VISIT';

export const useIsFirstVisit = () => {
  const { browser } = useEffects();

  const isFirstVisit = browser.storage.get<boolean>(KEY) ?? true;

  useEffect(() => {
    const setHasVisited = () => {
      browser.storage.set(KEY, false);
    };

    window.addEventListener('beforeunload', setHasVisited);
    return () => window.removeEventListener('beforeunload', setHasVisited);
  }, []);

  return isFirstVisit;
};
