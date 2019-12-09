import * as childProcess from 'node-services/lib/child_process';

import { initializeAll } from '../common/global';

childProcess.addDefaultForkHandler(false);

initializeAll().then(() => {
  // Use require so that it only starts executing the chunk with all globals specified.
  // eslint-disable-next-line
  require('../workers/generic-worker').start({
    syncSandbox: true,
    syncTypes: false,
  });
});
