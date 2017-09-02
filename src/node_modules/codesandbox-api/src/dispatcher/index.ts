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
export function dispatch(message: any) {
  if (!message) return;
  if (isStandalone) return;

  if (window.opener) {
    window.opener.postMessage(message, host);
  } else {
    window.parent.postMessage(message, host);
  }
}
