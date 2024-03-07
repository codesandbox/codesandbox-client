import * as amplitude from '@amplitude/analytics-browser';
import VERSION from '../../version';
import { debug } from './utils';

// After 30min no event we mark a session
const NEW_SESSION_TIME = 1000 * 60 * 30;

let amplitudeInitialized = false;

export const init = (apiKey: string) => {
  if (!apiKey) {
    return;
  }

  amplitude.init(apiKey, undefined, {
    serverUrl: 'https://stats.codesandbox.io/2/httpapi',
    appVersion: VERSION,
    flushIntervalMillis: 5000,
    defaultTracking: {
      attribution: false,
      pageViews: false, // We have custom logic for pageview tracking
    },
  });

  amplitudeInitialized = true;
};

export const identify = async (key: string, value: any) => {
  if (!amplitudeInitialized) {
    return;
  }

  const identity = new amplitude.Identify();
  identity.set(key, value);
  amplitude.identify(identity);
  debug('[Amplitude] Identifying', key, value);
};

export const identifyOnce = async (key: string, value: any) => {
  if (!amplitudeInitialized) {
    return;
  }

  const identity = new amplitude.Identify();
  identity.setOnce(key, value);
  amplitude.identify(identity);
  debug('[Amplitude] Identifying', key, value);
};

export const setUserId = async (userId: string) => {
  if (!amplitudeInitialized) {
    return;
  }

  identify('userId', userId);
  amplitude.setUserId(userId);
  debug('[Amplitude] Setting User ID', userId);
};

export const resetUserId = async () => {
  if (!amplitudeInitialized) {
    return;
  }

  amplitude.reset();
  debug('[Amplitude] Resetting session');
};

export const track = async (eventName: string, data: any) => {
  if (!amplitudeInitialized) {
    return;
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
  if (!amplitudeInitialized) {
    return;
  }

  amplitude.setGroup(group, value);
  debug('[Amplitude] Grouping', group, value);
};

export const setOptOut = (optOut: boolean) => {
  if (!amplitudeInitialized) {
    return;
  }

  amplitude.setOptOut(optOut);
  debug('[Amplitude] setOptOut', optOut);
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
