import * as child_process from 'node-services/lib/child_process';
// @ts-ignore
import DefaultWorkLoader from 'worker-loader?publicPath=/&name=dynamic-worker.[hash:8].worker.js!./generic-1';
import {
  initializeGlobals,
  initializePolyfills,
  loadBrowserFS,
} from '../common/global';

child_process.addDefaultForkHandler(DefaultWorkLoader);

initializePolyfills();
loadBrowserFS();
initializeGlobals();

child_process.preloadWorker('/stub');

require('../workers/ext-host-worker');
