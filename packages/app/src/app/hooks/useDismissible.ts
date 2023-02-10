import { useState } from 'react';
import { useEffects } from 'app/overmind';

/**
 * Localstorage keys used for dismissible modals and banners.
 */
type DismissibleKeys =
  | 'DASHBOARD_RECENT_UPGRADE'
  | 'DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER';

type Dismissibles = Partial<Record<DismissibleKeys, true>>;

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
