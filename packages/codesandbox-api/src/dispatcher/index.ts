// import * as debug from 'debug';
import host from './host';

const bundlers: Window[] = [];

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
  notifyFrames(newMessage);

  if (isStandalone) return;

  if (window.opener) {
    window.opener.postMessage(newMessage, '*');
  } else {
    window.parent.postMessage(newMessage, '*');
  }
}

export type Callback = (message: Object, source?: Window | null | undefined) => void;

const listeners: { [id: string]: Callback } = {};
let listenerId = 0;

/**
 * Listen to everything that comes in from either the editor or the sandbox
 * @param callback Call this function to 'unlisten'
 */
export function listen(callback: Callback): () => void {
  const id = ++listenerId;
  listeners[id] = callback;

  return () => {
    delete listeners[id];
  };
}

export function notifyListeners(data: Object, source?: MessageEvent['source']) {
  Object.keys(listeners).forEach(listenerId => {
    if (listeners[listenerId]) {
      listeners[listenerId](data, source);
    }
  });
}

function notifyFrames(message: Object) {
  const rawMessage = JSON.parse(JSON.stringify(message));
  bundlers.forEach(frame => {
    if (frame && frame.postMessage) {
      frame.postMessage({ ...rawMessage, codesandbox: true }, '*');
    }
  });
}

function eventListener(e: MessageEvent) {
  const { data } = e;

  if (data && data.codesandbox) {
    notifyListeners(data, e.source);
  }
}

/**
 * Register an window as a output the `dispatch` function can send messages to.
 *
 * @param frame
 */
export function registerFrame(frame: Window) {
  if (bundlers.indexOf(frame) === -1) {
    bundlers.push(frame);
  }
}

// We now start listening so we can let our listeners know
window.addEventListener('message', eventListener);

export function reattach() {
  window.addEventListener('message', eventListener);
}
