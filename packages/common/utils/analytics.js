import VERSION from 'common/version';

export const DNT =
  typeof window !== 'undefined' &&
  !!(
    window.doNotTrack ||
    window.navigator.doNotTrack ||
    window.navigator.msDoNotTrack
  );

export function identify(key, value) {
  try {
    if (!DNT) {
      if (typeof window.amplitude !== 'undefined') {
        const identity = new window.amplitude.Identify();
        identity.set(key, value);
        window.amplitude.identify(identity);
      }
    }
  } catch (e) {
    /* */
  }
}

export default function track(eventName, secondArg: Object = {}) {
  try {
    if (!DNT) {
      const data = {
        ...secondArg,
        version: VERSION,
        path: location.pathname + location.search,
      };
      try {
        if (window.ga) {
          window.ga('send', data);
        }
      } catch (e) {
        /* */
      }
      try {
        if (typeof window.amplitude !== 'undefined') {
          window.amplitude.logEvent(eventName, data);
        }
      } catch (e) {
        /* */
      }
    }
  } catch (e) {
    /* empty */
  }
}
