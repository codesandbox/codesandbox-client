import VERSION from '../../version';
import * as amplitude from './amplitude';
import * as sentry from './sentry';
import {
  ANONYMOUS_UID_KEY,
  DO_NOT_TRACK_ENABLED,
  getHashedUserId,
  isAllowedEvent,
} from './utils';

export { getHashedUserId };

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

/**
 * An identify that only sets the value if it hasn't been set before
 */
export async function identifyOnce(key: string, value: any) {
  if (!DO_NOT_TRACK_ENABLED) {
    amplitude.identifyOnce(key, value);
  }
}

export async function setAnonymousId() {
  if (!DO_NOT_TRACK_ENABLED && typeof localStorage !== 'undefined') {
    let anonymousUid = localStorage.getItem(ANONYMOUS_UID_KEY);

    if (!anonymousUid) {
      anonymousUid = String(Math.random().toString(36).substring(2));

      localStorage.setItem(ANONYMOUS_UID_KEY, anonymousUid);
    }
  }
}

export async function setUserId(userId: string, email: string) {
  if (!DO_NOT_TRACK_ENABLED) {
    const hashedId = getHashedUserId(userId);

    amplitude.setUserId(hashedId);
    sentry.setUserId(hashedId);
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
  }
}

/**
 * Assign the user to a group. Can be multiple under one key.
 */
export function setGroup(name: string, value: string | string[]) {
  if (!DO_NOT_TRACK_ENABLED) {
    amplitude.setGroup(name, value);
  }
}

const trackedEventsByTime: Record<string, number> = {};
export function trackWithCooldown(
  event: string,
  cooldown: number,
  data: any = {}
) {
  const now = Date.now();
  if (trackedEventsByTime[event]) {
    if (now - trackedEventsByTime[event] <= cooldown) {
      return;
    }
  }

  trackedEventsByTime[event] = now;
  track(event, data);
}

export function trackImprovedDashboardEvent(
  eventName: string,
  extraInfo: Object = {}
) {
  track(eventName, {
    ...extraInfo,
    codesandbox: 'V1',
    event_source: 'UI',
  });
}

export default function track(eventName: string, secondArg: Object = {}) {
  if (!DO_NOT_TRACK_ENABLED && isAllowedEvent(eventName, secondArg)) {
    const data = {
      ...secondArg,
      version: VERSION,
      path: location.pathname + location.search,
    };
    amplitude.track(eventName, data);
    sentry.logBreadcrumb({
      type: 'analytics',
      message: eventName,
    });
  }
}
