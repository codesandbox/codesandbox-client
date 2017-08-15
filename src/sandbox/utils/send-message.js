import _debug from 'app/utils/debug';
import host from './host';

const debug = _debug('cs:sandbox:messager');

// Whether the tab has a connection with the editor
export const isStandalone = !window.opener && window.parent === window;

export default function sendMessage(message: any) {
  if (!message) return;
  if (isStandalone) return;

  debug('Sending message', message);
  if (window.opener) {
    window.opener.postMessage(message, host);
  } else {
    window.parent.postMessage(message, host);
  }
}
