// import * as debug from 'debug';
import host from './host';

// Whether the tab has a connection with the editor
export const isStandalone =
  typeof window === 'undefined' || (!window.opener && window.parent === window);

/**
 * Send a message to the editor, this is most probably an action you generated
 *
 * @export
 * @param {*} message
 * @returns
 */
export function dispatch(message: Object) {
  if (!message) return;

  const newMessage = { ...message, codesandbox: true };
  notifyListeners(newMessage);

  if (isStandalone) return;

  if (window.opener) {
    window.opener.postMessage(newMessage, host);
  } else {
    window.parent.postMessage(newMessage, host);
  }
}

export type Callback = (message: Object, source?: Window) => void;

const listeners: { [id: string]: Callback } = {};
let listenerId = 0;

/**
 * Listen to everything that comes in from either the editor or the sandbox
 * @param callback Call this function to 'unlisten'
 */
export function listen(callback: Callback): () => void {
  const id = ++listenerId
  listeners[id] = callback;

  return () => {
    delete listeners[id];
  };
}

function notifyListeners(data: Object, source?: MessageEvent['source']) {
  Object.keys(listeners).forEach(listenerId => {
    if (listeners[listenerId]) {
      listeners[listenerId](data, source);
    }
  });
}

// We now start listening so we can let our listeners know
window.addEventListener('message', (e: MessageEvent) => {
  const { data } = e;
  if (data.codesandbox) {
    notifyListeners(data, e.source);
  }
});
