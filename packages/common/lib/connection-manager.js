'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
let isOnline = navigator.onLine;
const listeners = {};
function updateOnlineStatus(event) {
  isOnline = navigator.onLine;
  Object.keys(listeners).forEach(listener => {
    listeners[listener](isOnline);
  });
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
let id = 0;
function addListener(listener) {
  const listenerId = id;
  listeners[id++] = listener;
  // Already let listener know what the status is
  listener(isOnline);
  return () => {
    listeners[listenerId] = null;
  };
}
exports.default = addListener;
