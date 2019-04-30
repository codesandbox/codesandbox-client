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

let sentryInitialized = false;

function getSentry() {
  return import(/* webpackChunkName: 'sentry' */ '@sentry/browser');
}
export async function initializeSentry(dsn: string) {
  const Sentry = await getSentry();
  if (!DNT) {
    sentryInitialized = true;

    return Sentry.init({
      dsn,
      release: VERSION,
    });
  }
}

export async function logError(err: Error) {
  if (sentryInitialized) {
    const Sentry = await getSentry();
    Sentry.captureException(err);
  }

  if (window.console && console.error) console.error(err);
}

export async function identify(key: string, value: string) {
  try {
    if (!DNT) {
      if (typeof global.amplitude !== 'undefined') {
        const identity = new global.amplitude.Identify();
        identity.set(key, value);
        global.amplitude.identify(identity);
        debug('[Amplitude] Identifying', key, value);
      }

      if (sentryInitialized) {
        const Sentry = await getSentry();

        Sentry.configureScope(scope => {
          scope.setExtra(key, value);
        });
      }
    }
  } catch (e) {
    /* */
  }
}

setTimeout(() => {
  identify('[Amplitude] Version', VERSION);
}, 5000);

export async function setUserId(userId: string) {
  try {
    if (!DNT) {
      if (typeof global.amplitude !== 'undefined') {
        const hashedId = hash(userId);
        debug('[Amplitude] Setting User ID', hashedId);
        identify('userId', hashedId);

        global.amplitude.getInstance().setUserId(hashedId);
      }

      if (sentryInitialized) {
        const Sentry = await getSentry();
        Sentry.configureScope(scope => {
          scope.setUser({ id: userId });
        });
      }
    }
  } catch (e) {
    /* */
  }
}

export async function resetUserId() {
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

      if (sentryInitialized) {
        const Sentry = await getSentry();
        Sentry.configureScope(scope => {
          scope.setUser({ id: undefined });
        });
      }
    }
  } catch (e) {
    /* */
  }
}

const isAllowedEvent = (eventName, secondArg) => {
  try {
    if (eventName === 'VSCode - workbenchActionExecuted') {
      if (secondArg.id.startsWith('cursor')) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return true;
  }
};

export default function track(eventName, secondArg: Object = {}) {
  try {
    if (!DNT && isAllowedEvent(eventName, secondArg)) {
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
