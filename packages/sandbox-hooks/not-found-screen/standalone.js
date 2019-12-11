import { isStandalone, dispatch } from 'codesandbox-api';
import { show404 } from '.';
import { listenForPreviewSecret } from '../preview-secret';

if (!isStandalone) {
  listenForPreviewSecret();

  // Dispatch initialized so the editor can register this window and send the preview secret
  dispatch({ type: 'initialized' });
}

const hostParts = window.location.hostname.split('.');
const sandbox = hostParts[0];

show404(sandbox);
