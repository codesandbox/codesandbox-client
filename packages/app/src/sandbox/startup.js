/* eslint-disable import/default */
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./eval/transpilers/babel/worker/index';
/* eslint-enable import/default */
import hookConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import setupScreenshotListener from 'sandbox-hooks/screenshot';
import { listenForPreviewSecret } from 'sandbox-hooks/preview-secret';
import { isStandalone } from 'codesandbox-api';

const WORKERS_TO_LOAD = process.env.SANDPACK ? 1 : 3;
window.babelworkers = [];
for (let i = 0; i < WORKERS_TO_LOAD; i++) {
  const worker = new BabelWorker();
  window.babelworkers.push(worker);

  // Warm up the babel worker
  worker.postMessage({
    type: 'warmup',
    path: 'test.js',
    code: 'const a = "b"',
    config: { presets: ['env'] },
    version: 7,
    loaderOptions: {},
  });
}

if (!isStandalone) {
  // Means we're in the editor
  setupHistoryListeners();
  hookConsole();
  listenForPreviewSecret();
  setupScreenshotListener();
}
