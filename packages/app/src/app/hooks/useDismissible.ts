import { useState } from 'react';
import { useEffects } from 'app/overmind';

type Dismissibles = Partial<Record<string, true | string>>;

export const useDismissible = (key: string): [boolean, () => void] => {
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
