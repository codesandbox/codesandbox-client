import { debug, global } from './utils';
import delay from '../delay';

// After 30min no event we mark a session
const NEW_SESSION_TIME = 1000 * 60 * 30;

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

const getAmplitude = async (): Promise<any | false> => {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  for (let i = 0; i < 10; i++) {
    if (
      typeof global.amplitude !== 'undefined' &&
      global.amplitude.getInstance()._storageSuffix
    ) {
      return global.amplitude;
    }

    // eslint-disable-next-line no-await-in-loop
    await delay(1000);
  }

  return false;
};

export const identify = async (key: string, value: any) => {
  const amplitude = await getAmplitude();
  if (amplitude) {
    const identity = new amplitude.Identify();
    identity.set(key, value);
    amplitude.identify(identity);
    debug('[Amplitude] Identifying', key, value);
  } else {
    debug('[Amplitude] NOT identifying because Amplitude is not loaded');
  }
};

export const identifyOnce = async (key: string, value: any) => {
  const amplitude = await getAmplitude();
  if (amplitude) {
    const identity = new amplitude.Identify();
    identity.setOnce(key, value);
    amplitude.identify(identity);
    debug('[Amplitude] Identifying', key, value);
  } else {
    debug('[Amplitude] NOT identifying because Amplitude is not loaded');
  }
};

export const setUserId = async (userId: string) => {
  const amplitude = await getAmplitude();
  if (amplitude) {
    debug('[Amplitude] Setting User ID', userId);
    identify('userId', userId);

    amplitude.getInstance().setUserId(userId);
  } else {
    debug('[Amplitude] NOT setting userid because Amplitude is not loaded');
  }
};

export const resetUserId = async () => {
  const amplitude = await getAmplitude();
  if (amplitude) {
    debug('[Amplitude] Resetting User ID');
    identify('userId', null);

    if (
      amplitude.getInstance().options &&
      amplitude.getInstance().options.userId
    ) {
      amplitude.getInstance().setUserId(null);
      amplitude.getInstance().regenerateDeviceId();
    }
  } else {
    debug('[Amplitude] NOT resetting user id because Amplitude is not loaded');
  }
};

export const track = async (eventName: string, data: any) => {
  const amplitude = await getAmplitude();
  if (amplitude) {
    const currentTime = Date.now();
    if (currentTime - getLastTimeEventSent() > NEW_SESSION_TIME) {
      // We send a separate New Session event if people have been inactive for a while
      amplitude.logEvent('New Session');
    }
    markLastTimeEventSent();

    debug('[Amplitude] Tracking', eventName, data);
    amplitude.logEvent(eventName, data);
  } else {
    debug(
      '[Amplitude] NOT tracking because Amplitude is not loaded',
      eventName
    );
  }
};

export const setGroup = async (group: string, value: string | string[]) => {
  const amplitude = await getAmplitude();
  if (amplitude) {
    debug('[Amplitude] Grouping', group, value);
    amplitude.setGroup(group, value);
  }
};
