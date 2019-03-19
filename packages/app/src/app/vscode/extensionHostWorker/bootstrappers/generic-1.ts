import * as child_process from 'node-services/lib/child_process';
// @ts-ignore
import SubWorkLoader from 'worker-loader?publicPath=/&name=sub-dynamic-worker.[hash:8].worker.js!./generic-2';
import { initializeAll } from '../common/global';

child_process.addDefaultForkHandler(SubWorkLoader);

initializeAll().then(() => {
  // Use require so that it only starts executing the chunk with all globals specified.
  require('../workers/generic-worker').start({
    syncSandbox: true,
    syncTypes: true,
  });
});
