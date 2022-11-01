import { useEffects } from 'app/overmind';

/**
 * Localstorage keys used for dismissible modals and banners.
 */
type DismissibleKeys =
  // TODO - Any key in this type should refer to a dismissible item. Right
  // now there are none yet.
  'TODO';

type Dismissibles = Partial<Record<DismissibleKeys, true>>;

export const useDismissible = () => {
  const { browser } = useEffects();
  const dismissibles = browser.storage.get<Dismissibles>('DISMISSIBLES');

  const isDismissed = (key: DismissibleKeys) => {
    return dismissibles?.[key] === true;
  };

  const dismiss = (key: DismissibleKeys) => {
    const prevDismissibles = dismissibles || {};

    browser.storage.set('DISMISSIBLES', {
      ...prevDismissibles,
      [key]: true,
    });
  };

  return { isDismissed, dismiss };
};
