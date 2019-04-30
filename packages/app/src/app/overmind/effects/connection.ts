import addListener from '@codesandbox/common/lib/connection-manager';

const listeners = {};

export default {
  addListener(signalPath) {
    const listener = connection =>
      this.context.controller.getSignal(signalPath)({ connection });

    listeners[signalPath] = addListener(listener);
  },
  removeListener(signalPath) {
    listeners[signalPath]();

    delete listeners[signalPath];
  },
};
