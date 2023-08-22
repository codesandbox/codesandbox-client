import * as amplitude from '@amplitude/analytics-browser';
import VERSION from '@codesandbox/common/lib/version';
import { debug } from './utils';

// After 30min no event we mark a session
const NEW_SESSION_TIME = 1000 * 60 * 30;

export const init = (apiKey: string) => {
  amplitude.init(apiKey, undefined, {
    serverUrl: 'https://stats.codesandbox.io/2/httpapi',
    appVersion: VERSION,
    flushIntervalMillis: 5000,
    defaultTracking: {
      attribution: false,
      pageViews: false, // We have custom logic for pageview tracking
    },
  });
};

export const identify = async (key: string, value: any) => {
  if (!amplitude) {
    debug('[Amplitude] NOT identifying because Amplitude is not loaded');
  }

  const identity = new amplitude.Identify();
  identity.set(key, value);
  amplitude.identify(identity);
  debug('[Amplitude] Identifying', key, value);
};

export const identifyOnce = async (key: string, value: any) => {
  if (!amplitude) {
    debug('[Amplitude] NOT identifying because Amplitude is not loaded');
  }

  const identity = new amplitude.Identify();
  identity.setOnce(key, value);
  amplitude.identify(identity);
  debug('[Amplitude] Identifying', key, value);
};

export const setUserId = async (userId: string) => {
  if (!amplitude) {
    debug('[Amplitude] NOT setting userid because Amplitude is not loaded');
  }

  identify('userId', userId);
  amplitude.setUserId(userId);
  debug('[Amplitude] Setting User ID', userId);
};

export const resetUserId = async () => {
  if (!amplitude) {
    debug('[Amplitude] NOT resetting user id because Amplitude is not loaded');
  }

  amplitude.reset();
  debug('[Amplitude] Resetting session');
};

export const track = async (eventName: string, data: any) => {
  if (!amplitude) {
    debug(
      '[Amplitude] NOT tracking because Amplitude is not loaded',
      eventName
    );
  }

  const currentTime = Date.now();
  if (currentTime - getLastTimeEventSent() > NEW_SESSION_TIME) {
    // We send a separate New Session event if people have been inactive for a while
    amplitude.track('New Session');
  }
  markLastTimeEventSent();

  debug('[Amplitude] Tracking', eventName, data);
  amplitude.track(eventName, data);
};

export const setGroup = async (group: string, value: string | string[]) => {
  amplitude.setGroup(group, value);
  debug('[Amplitude] Grouping', group, value);
};

const getLastTimeEventSent = () => {
  try {
    const lastTime = localStorage.getItem('csb-last-event-sent');

    if (lastTime === null) {
      return 0;
    }

    return +lastTime;
  } catch (e) {
    return 0;
  }
};

const markLastTimeEventSent = () => {
  try {
    localStorage.setItem('csb-last-event-sent', Date.now().toString());
  } catch (e) {
    console.warn(e);
  }
};
