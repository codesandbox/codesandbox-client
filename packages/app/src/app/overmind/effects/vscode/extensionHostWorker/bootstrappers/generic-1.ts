import * as childProcess from 'node-services/lib/child_process';
// @ts-ignore
import SubWorkLoader from 'worker-loader?publicPath=/&name=sub-dynamic-worker.[hash:8].worker.js!./generic-2';

import { initializeAll } from '../common/global';

childProcess.addDefaultForkHandler(SubWorkLoader);

initializeAll().then(() => {
  // Use require so that it only starts executing the chunk with all globals specified.
  // eslint-disable-next-line
  require('../workers/generic-worker').start({
    syncSandbox: true,
    syncTypes: true,
  });
});
