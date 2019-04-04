import * as child_process from 'node-services/lib/child_process';

import { initializeAll } from '../common/global';

child_process.addDefaultForkHandler(false);

initializeAll().then(() => {
  // Use require so that it only starts executing the chunk with all globals specified.
  require('../workers/generic-worker').start({
    syncSandbox: true,
    syncTypes: false,
  });
});
