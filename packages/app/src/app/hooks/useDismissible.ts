import { useState } from 'react';
import { useEffects } from 'app/overmind';

/**
 * Localstorage keys used for dismissible modals and banners.
 */
type DismissibleKeys<T extends string> =
  | T
  | 'DASHBOARD_RECENT_UPGRADE'
  | 'DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER';

type Dismissibles<T extends string> = Partial<
  Record<DismissibleKeys<T>, true | string>
>;

export const useDismissible = <T extends string>(
  key: DismissibleKeys<T>
): [boolean, () => void] => {
  const { browser } = useEffects();
  const [isDismissed, setIsDismissed] = useState(() => {
    const dismissibles = browser.storage.get<Dismissibles<T>>('DISMISSIBLES');
    return dismissibles?.[key] === true;
  });

  const dismiss = () => {
    // Getting the dismissibles again to make sure other instances aren't
    // overwritten after the hook initialised.
    const prevDismissibles =
      browser.storage.get<Dismissibles<T>>('DISMISSIBLES') || {};

    browser.storage.set('DISMISSIBLES', {
      ...prevDismissibles,
      [key]: true,
    });
    setIsDismissed(true);
  };

  return [isDismissed, dismiss];
};
