import { isStandalone } from 'codesandbox-api/compiled/dispatcher';
import { show404 } from '.';
import { listenForPreviewSecret } from '../preview-secret';

if (!isStandalone) {
  listenForPreviewSecret();
}

const hostParts = window.location.hostname.split('.');
const sandbox = hostParts[0];

show404(sandbox);
