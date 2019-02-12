import * as child_process from 'node-services/lib/child_process';
// @ts-ignore
import SubWorkLoader from 'worker-loader?publicPath=/&name=sub-dynamic-worker.[hash:8].worker.js!./generic-2';
import {
  initializeGlobals,
  initializePolyfills,
  loadBrowserFS,
} from '../common/global';

child_process.addDefaultForkHandler(SubWorkLoader);

initializePolyfills();
loadBrowserFS();
initializeGlobals();

require('../workers/generic-worker');
