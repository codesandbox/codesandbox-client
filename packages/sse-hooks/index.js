import hookConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import { listenForPreviewSecret } from 'sandbox-hooks/preview-secret';
import { dispatch } from 'codesandbox-api';

hookConsole();
setupHistoryListeners();
listenForPreviewSecret();
dispatch({ type: 'initialized' });

setTimeout(() => {
  if (typeof window.__puppeteer__ === 'function') {
    window.__puppeteer__('done');
  }
}, 1000);
