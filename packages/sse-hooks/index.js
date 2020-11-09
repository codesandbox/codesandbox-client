import hookConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import setupScreenshotListener from 'sandbox-hooks/screenshot'
import { listenForPreviewSecret } from 'sandbox-hooks/preview-secret';
import { dispatch, isStandalone } from 'codesandbox-api';

if (!isStandalone) {
  hookConsole();
  setupHistoryListeners();
  listenForPreviewSecret();
  setupScreenshotListener();
  dispatch({ type: 'initialized' });
}

setTimeout(() => {
  if (typeof window.__puppeteer__ === 'function') {
    window.__puppeteer__('done');
  }
}, 1000);
