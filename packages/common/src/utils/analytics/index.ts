import VERSION from '../../version';
import * as amplitude from './amplitude';
import * as chameleon from './chameleon';
import * as google from './google';
import * as sentry from './sentry';
import {
  ANONYMOUS_UID_KEY,
  DO_NOT_TRACK_ENABLED,
  getHashedUserId,
  isAllowedEvent,
} from './utils';
import * as vero from './vero';

if (process.env.NODE_ENV === 'production') {
  setTimeout(() => {
    identify('[Amplitude] Version', VERSION);
  }, 5000);
}

export { getHashedUserId };

export const initializeSentry = sentry.initialize;

export const DNT = DO_NOT_TRACK_ENABLED;

export async function logError(err: Error) {
  sentry.captureException(err);

  if (window.console && console.error) console.error(err);
}

// Used to configure stuff?
export async function identify(key: string, value: any) {
  if (!DO_NOT_TRACK_ENABLED) {
    amplitude.identify(key, value);

    sentry.configureScope(scope => {
      scope.setExtra(key, value);
    });
  }
}

export async function setAnonymousId() {
  if (!DO_NOT_TRACK_ENABLED) {
    let anonymousUid = localStorage.getItem(ANONYMOUS_UID_KEY);

    if (!anonymousUid) {
      anonymousUid = String(
        Math.random()
          .toString(36)
          .substring(2)
      );

      localStorage.setItem(ANONYMOUS_UID_KEY, anonymousUid);
    }

    chameleon.setAnonymousUserId(anonymousUid);
    vero.setAnonymousUserId(anonymousUid);
  }
}

export async function setUserId(userId: string) {
  if (!DO_NOT_TRACK_ENABLED) {
    const hashedId = getHashedUserId(userId);

    amplitude.setUserId(hashedId);
    sentry.setUserId(hashedId);
    chameleon.setUserId(hashedId);
    vero.setUserId(hashedId);
  }
}

export async function resetUserId() {
  if (!DO_NOT_TRACK_ENABLED) {
    amplitude.resetUserId();
    sentry.resetUserId();
  }
}

export function trackPageview() {
  if (!DO_NOT_TRACK_ENABLED) {
    const data = {
      version: VERSION,
      path: location.pathname + location.search,
    };

    amplitude.track('pageview', data);
    vero.trackPageview();
    google.trackPageView();
  }
}

export default function track(eventName, secondArg: Object = {}) {
  if (!DO_NOT_TRACK_ENABLED && isAllowedEvent(eventName, secondArg)) {
    const data = {
      ...secondArg,
      version: VERSION,
      path: location.pathname + location.search,
    };
    amplitude.track(eventName, data);
    google.track(eventName, data);
    vero.track(eventName, data);
    sentry.logBreadcrumb({
      type: 'analytics',
      message: eventName,
    });
  }
}
