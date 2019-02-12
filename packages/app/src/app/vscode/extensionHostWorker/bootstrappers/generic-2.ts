import * as child_process from 'node-services/lib/child_process';
import {
  initializeGlobals,
  initializePolyfills,
  loadBrowserFS,
} from '../common/global';

child_process.addDefaultForkHandler(false);

initializePolyfills();
loadBrowserFS();
initializeGlobals();

require('../workers/generic-worker');
