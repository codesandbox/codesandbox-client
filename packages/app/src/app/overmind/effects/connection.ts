import addListener from '@codesandbox/common/lib/connection-manager';

const listeners = new Map();

export default {
  addListener(listener: (connected: boolean) => void) {
    const disposer = addListener(listener);
    listeners.set(listener, disposer);
  },
  removeListener(listener: (connected: boolean) => void) {
    if (listeners.has(listener)) {
      listeners.get(listener)();
      listeners.delete(listener);
    }
  },
};
