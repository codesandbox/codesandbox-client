import hookConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import { dispatch } from 'codesandbox-api';

hookConsole();
setupHistoryListeners();
dispatch({ type: 'initialized' });

setTimeout(() => {
  if (typeof window.__puppeteer__ === 'function') {
    window.__puppeteer__('done');
  }
}, 1000);
