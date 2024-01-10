/* eslint-disable import/default */
// @ts-ignore
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./eval/transpilers/babel/worker/index';
/* eslint-enable import/default */
import hookConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import setupScreenshotListener from 'sandbox-hooks/screenshot';
import { listenForPreviewSecret } from 'sandbox-hooks/preview-secret';
import { isStandalone } from 'codesandbox-api';

import { BABEL7_VERSION } from './eval/transpilers/babel/babel-version';

// Prefetch file as it's not used quickly enough to use preload without warnings
function prefetchScript(url) {
  const preloadLink = document.createElement('link');
  preloadLink.href = url;
  preloadLink.rel = 'prefetch';
  preloadLink.as = 'script';
  document.head.appendChild(preloadLink);
}

prefetchScript(
  `${
    process.env.CODESANDBOX_HOST || ''
  }/static/js/babel.${BABEL7_VERSION}.min.js`
);

// Preload first babel worker, this will ensure the worker is in the browser cache when we need it
globalThis.babelworkers = [BabelWorker()];

if (!isStandalone) {
  // Means we're in the editor
  setupHistoryListeners();
  hookConsole();
  listenForPreviewSecret();
  setupScreenshotListener();
}
