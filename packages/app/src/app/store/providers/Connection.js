import { Provider } from '@cerebral/fluent';
import addListener from 'common/connection-manager';

const listeners = {};

export default Provider({
  addListener(signalPath) {
    const listener = connection =>
      this.context.controller.getSignal(signalPath)({ connection });

    listeners[signalPath] = addListener(listener);
  },
  removeListener(signalPath) {
    listeners[signalPath]();

    delete listeners[signalPath];
  },
});
