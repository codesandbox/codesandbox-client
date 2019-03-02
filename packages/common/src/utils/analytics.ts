import VERSION from '../version';
import _debug from '../utils/debug';

import hash from './hash';

const debug = _debug('cs:analytics');

const global = (typeof window !== 'undefined' ? window : {}) as any;

export const DNT =
  typeof window !== 'undefined' &&
  !!(
    global.doNotTrack === '1' ||
    global.navigator.doNotTrack === '1' ||
    global.navigator.msDoNotTrack === '1'
  );

export function identify(key, value) {
  try {
    if (!DNT) {
      if (typeof global.amplitude !== 'undefined') {
        const identity = new global.amplitude.Identify();
        identity.set(key, value);
        global.amplitude.identify(identity);
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
      if (typeof global.amplitude !== 'undefined') {
        const hashedId = hash(userId);
        debug('[Amplitude] Setting User ID', hashedId);
        identify('userId', hashedId);

        global.amplitude.getInstance().setUserId(hashedId);
      }
    }
  } catch (e) {
    /* */
  }
}

export function resetUserId() {
  try {
    if (!DNT) {
      if (typeof global.amplitude !== 'undefined') {
        debug('[Amplitude] Resetting User ID');
        identify('userId', null);

        if (global.amplitude.getInstance().options.userId) {
          global.amplitude.getInstance().setUserId(null);
          global.amplitude.getInstance().regenerateDeviceId();
        }
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
        if (global.ga) {
          global.ga('send', data);
        }
      } catch (e) {
        /* */
      }
      try {
        if (typeof global.amplitude !== 'undefined') {
          debug('[Amplitude] Tracking', eventName, data);
          global.amplitude.logEvent(eventName, data);
        }
      } catch (e) {
        /* */
      }
    }
  } catch (e) {
    /* empty */
  }
}
