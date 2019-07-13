import { Provider } from 'cerebral';
import { listen, dispatch } from 'codesandbox-api';

const listeners = {};

/**
 * This CodeSandboxAPI listener is only used to listen to events coming in.
 * It's supposed to be removed in a later stage.
 */
export default Provider({
  listen(signalPath) {
    if (listeners[signalPath]) {
      listeners[signalPath]();
    }

    const signal = this.context.controller.getSignal(signalPath);

    listeners[signalPath] = listen(data => {
      signal({ data: data || {} });
    });

    return listeners[signalPath];
  },
  dispatch(message) {
    dispatch(message);
  },
});
