import _debug from 'app/utils/debug';
import host from './host';

import { isStandalone } from '../';

const debug = _debug('cs:sandbox:messager');

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
