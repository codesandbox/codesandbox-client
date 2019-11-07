import { debug, global } from './utils';

// After 30min no event we mark a session
const NEW_SESSION_TIME = 1000 * 60 * 30;

const getLastTimeEventSent = () => {
  const lastTime = localStorage.getItem('csb-last-event-sent');

  if (lastTime === null) {
    return 0;
  }

  return +lastTime;
};

const markLastTimeEventSent = () => {
  localStorage.setItem('csb-last-event-sent', Date.now().toString());
};

export const identify = (key: string, value: any) => {
  if (typeof global.amplitude !== 'undefined') {
    const identity = new global.amplitude.Identify();
    identity.set(key, value);
    global.amplitude.identify(identity);
    debug('[Amplitude] Identifying', key, value);
  } else {
    debug('[Amplitude] NOT identifying because Amplitude is not loaded');
  }
};

export const setUserId = (userId: string) => {
  if (typeof global.amplitude !== 'undefined') {
    debug('[Amplitude] Setting User ID', userId);
    identify('userId', userId);

    global.amplitude.getInstance().setUserId(userId);
  } else {
    debug('[Amplitude] NOT setting userid because Amplitude is not loaded');
  }
};

export const resetUserId = () => {
  if (typeof global.amplitude !== 'undefined') {
    debug('[Amplitude] Resetting User ID');
    identify('userId', null);

    if (global.amplitude.getInstance().options.userId) {
      global.amplitude.getInstance().setUserId(null);
      global.amplitude.getInstance().regenerateDeviceId();
    }
  } else {
    debug('[Amplitude] NOT resetting user id because Amplitude is not loaded');
  }
};

export const track = (eventName: string, data: any) => {
  if (typeof global.amplitude !== 'undefined') {
    const currentTime = Date.now();
    if (currentTime - getLastTimeEventSent() > NEW_SESSION_TIME) {
      // We send a separate New Session event if people have been inactive for a while
      global.amplitude.logEvent('New Session');
    }
    markLastTimeEventSent();

    debug('[Amplitude] Tracking', eventName, data);
    global.amplitude.logEvent(eventName, data);
  } else {
    debug(
      '[Amplitude] NOT tracking because Amplitude is not loaded',
      eventName
    );
  }
};
