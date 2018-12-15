// import * as debug from 'debug';
// import host from './host';

const bundlers: Map<Window, string> = new Map();

// Whether the tab has a connection with the editor
export const isStandalone =
  typeof window === 'undefined' || (!window.opener && window.parent === window);

let parentOrigin: string | null = null;

const parentOriginListener = (e: MessageEvent) => {
  if (e.data.type === 'register-frame') {
    parentOrigin = e.data.origin;

    self.removeEventListener('message', parentOriginListener);
  }
};

if (typeof window !== 'undefined') {
  self.addEventListener('message', parentOriginListener);
}

export function resetState() {
  parentOrigin = null;
  bundlers.clear();
}

/**
 * Send a message to the editor, this is most probably an action you generated
 *
 * @export
 * @param {*} message
 * @returns
 */
export function dispatch(message: any) {
  if (!message) return;

  const newMessage = { ...message, codesandbox: true };
  notifyListeners(newMessage);
  notifyFrames(newMessage);

  if (isStandalone) return;
  if (parentOrigin === null && message.type !== 'initialized') return;

  if (window.opener) {
    window.opener.postMessage(newMessage, parentOrigin === null ? '*' : parentOrigin);
  } else {
    window.parent.postMessage(newMessage, parentOrigin === null ? '*' : parentOrigin);
  }
}

export type Callback = (
  message: Object,
  source?: MessageEvent['source'] | null | undefined
) => void;

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
  bundlers.forEach((origin, frame) => {
    if (frame && frame.postMessage) {
      frame.postMessage({ ...rawMessage, codesandbox: true }, origin);
    }
  });
}

function eventListener(e: MessageEvent) {
  const { data } = e;

  if (data && data.codesandbox && (parentOrigin === null || e.origin === parentOrigin)) {
    notifyListeners(data, e.source);
  }
}

/**
 * Register an window as a output the `dispatch` function can send messages to.
 *
 * @param frame
 */
export function registerFrame(frame: Window, origin: string) {
  bundlers.set(frame, origin);

  frame.postMessage(
    {
      type: 'register-frame',
      origin: document.location.origin,
    },
    origin
  );
}

if (typeof window !== 'undefined') {
  // We now start listening so we can let our listeners know
  window.addEventListener('message', eventListener);
}

export function reattach() {
  window.addEventListener('message', eventListener);
}
