'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const version_1 = require('../version');
const debug_1 = require('../utils/debug');
const hash_1 = require('./hash');
const debug = debug_1.default('cs:analytics');
const global = window;
exports.DNT =
  typeof window !== 'undefined' &&
  !!(
    global.doNotTrack === '1' ||
    global.navigator.doNotTrack === '1' ||
    global.navigator.msDoNotTrack === '1'
  );
function identify(key, value) {
  try {
    if (!exports.DNT) {
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
exports.identify = identify;
function setUserId(userId) {
  try {
    if (!exports.DNT) {
      if (typeof global.amplitude !== 'undefined') {
        const hashedId = hash_1.default(userId);
        debug('[Amplitude] Setting User ID', hashedId);
        identify('userId', hashedId);
        global.amplitude.getInstance().setUserId(hashedId);
      }
    }
  } catch (e) {
    /* */
  }
}
exports.setUserId = setUserId;
function resetUserId() {
  try {
    if (!exports.DNT) {
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
exports.resetUserId = resetUserId;
function track(eventName, secondArg = {}) {
  try {
    if (!exports.DNT) {
      const data = Object.assign({}, secondArg, {
        version: version_1.default,
        path: location.pathname + location.search,
      });
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
exports.default = track;
