// import * as debug from 'debug';
import host from './host';

const bundlers: Map<Window, string> = new Map();

function checkIsStandalone() {
  if (typeof window === 'undefined') {
    return true;
  }

  if (window.location && window.location.href.indexOf('?standalone') > -1) {
    return true;
  }

  if (window.opener || window.parent !== window) {
    if (window.location && window.location.href.indexOf(host) > -1) {
      // If this location href is codesandbox.io or something, we're most probably in an embed
      // iframed on another page. This means that we're actually standalone, but we're fooled
      // by the fact that we're embedded somewhere else.
      return true;
    }

    return false;
  }

  return true;
}

// Whether the tab has a connection with the editor
export const isStandalone = checkIsStandalone();

let resolveIframeHandshake: () => void;

let iframeHandshakeDone = false;
/**
 * Resolves when the handshake between the frame and the editor has succeeded
 */
export const iframeHandshake = new Promise(resolve => {
  resolveIframeHandshake = resolve as () => void;
});

// Field used by a "child" frame to determine its parent origin
let parentOrigin: string | null = null;
let parentId: number | null = null;

const parentOriginListener = (e: MessageEvent) => {
  if (e.data.type === 'register-frame' && !parentId) {
    parentOrigin = e.data.origin;
    parentId = e.data.id ?? null;

    if (!iframeHandshakeDone) {
      resolveIframeHandshake();
      iframeHandshakeDone = true;
    }
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
  if (parentId !== null) {
    newMessage.$id = parentId;
  }

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
  message: object,
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

export function notifyListeners(data: object, source?: MessageEvent['source']) {
  // eslint-disable-next-line no-shadow
  Object.keys(listeners).forEach(listenerId => {
    if (listeners[listenerId]) {
      try {
        listeners[listenerId](data, source);
      } catch (e) {
        /**/
      }
    }
  });
}

function notifyFrames(message: object) {
  const rawMessage = JSON.parse(JSON.stringify(message));
  bundlers.forEach((origin, frame) => {
    if (frame && frame.postMessage) {
      frame.postMessage({ ...rawMessage, codesandbox: true }, origin);
    }
  });
}

function eventListener(e: MessageEvent) {
  if (e.data.type === 'initialized' || isStandalone) {
    // iframe handshake is auto-resolved in the parent, only the child needs to wait for it
    // we detect the parent either by the "initialized" message which only the parent receives
    // or by the "isStandalone" flag which works for codesandbox.io and when sandpack is not inside an iframe
    iframeHandshakeDone = true;
  }

  if (!iframeHandshakeDone) {
    return;
  }

  const { data } = e;

  if (
    data &&
    data.codesandbox &&
    (parentOrigin === null || e.origin === parentOrigin) &&
    (data.$id == null || parentId === null || parentId === data.$id)
  ) {
    notifyListeners(data, e.source);
  }
}

/**
 * Register an window as a output the `dispatch` function can send messages to.
 *
 * @param frame
 */
export function registerFrame(frame: Window, origin: string, bundlerId?: number) {
  bundlers.set(frame, origin);
  frame.postMessage(
    {
      type: 'register-frame',
      origin: document.location.origin,
      id: bundlerId,
    },
    origin
  );
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', eventListener);
}

export function reattach() {
  window.addEventListener('message', eventListener);
}
