import VERSION from 'common/version';
import _debug from 'common/utils/debug';

import hash from './hash';

const debug = _debug('cs:analytics');

export const DNT =
  typeof window !== 'undefined' &&
  !!(
    window.doNotTrack === '1' ||
    window.navigator.doNotTrack === '1' ||
    window.navigator.msDoNotTrack === '1'
  );

export function identify(key, value) {
  try {
    if (!DNT) {
      if (typeof window.amplitude !== 'undefined') {
        const identity = new window.amplitude.Identify();
        identity.set(key, value);
        window.amplitude.identify(identity);
        debug('[Amplitude] Identifying', key, value);
      }
    }
  } catch (e) {
    /* */
  }
}

export function setUserId(userId: string) {
  try {
    if (!DNT) {
      if (typeof window.amplitude !== 'undefined') {
        const hashedId = hash(userId);
        debug('[Amplitude] Setting User ID', hashedId);
        identify('userId', hashedId);

        window.amplitude.getInstance().setUserId(hashedId);
      }
    }
  } catch (e) {
    /* */
  }
}

export function resetUserId() {
  try {
    if (!DNT) {
      if (typeof window.amplitude !== 'undefined') {
        debug('[Amplitude] Resetting User ID');
        identify('userId', null);

        window.amplitude.getInstance().setUserId(null);
        window.amplitude.getInstance().regenerateDeviceId();
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
          debug('[Amplitude] Tracking', eventName, data);
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
