import { useEffects } from 'app/overmind';

/**
 * Localstorage keys used for dismissible modals and banners.
 */
type DismissibleKeys =
  // TODO - Any key in this type should refer to a dismissible item. Right
  // now there are none yet.
  'TODO';

type Dismissibles = Partial<Record<DismissibleKeys, true>>;

export const useDismissible = (key: DismissibleKeys) => {
  const { browser } = useEffects();

  const dismissibles = browser.storage.get<Dismissibles>('DISMISSIBLES');
  const isDismissed = dismissibles?.[key] === true;

  const dismiss = () => {
    // Getting the dismissibles again to make sure other instances aren't
    // overwritten after the hook initialised.
    const prevDismissibles =
      browser.storage.get<Dismissibles>('DISMISSIBLES') || {};

    browser.storage.set('DISMISSIBLES', {
      ...prevDismissibles,
      [key]: true,
    });
  };

  return [isDismissed, dismiss];
};
