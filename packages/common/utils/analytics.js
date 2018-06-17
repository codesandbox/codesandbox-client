import VERSION from 'common/version';

export const DNT = !!(
  window.doNotTrack ||
  window.navigator.doNotTrack ||
  window.navigator.msDoNotTrack
);

export default function track(eventName, secondArg: Object = {}) {
  try {
    if (window.ga && !DNT) {
      const data = {
        ...secondArg,
        version: VERSION,
      };

      window.ga('send', data);

      if (typeof window.amplitude !== 'undefined') {
        window.amplitude.logEvent(eventName, data);
      }
    }
  } catch (e) {
    /* empty */
  }
}
