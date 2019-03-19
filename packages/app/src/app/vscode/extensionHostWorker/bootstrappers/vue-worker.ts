import * as child_process from 'node-services/lib/child_process';

// @ts-ignore
import SubWorkLoader from 'worker-loader?publicPath=/&name=sub-dynamic-worker.[hash:8].worker.js!./generic-2';
import { initializeAll } from '../common/global';
import { EXTENSIONS_LOCATION } from '../../constants';
declare var __DEV__: boolean;

child_process.addDefaultForkHandler(SubWorkLoader);

initializeAll().then(async () => {
  // Use require so that it only starts executing the chunk with all globals specified.
  require('../workers/generic-worker').start({
    syncSandbox: true,
    syncTypes: true,
    extraMounts: {
      '/extensions': {
        fs: 'BundledHTTPRequest',
        options: {
          index: EXTENSIONS_LOCATION + '/extensions/index.json',
          baseUrl: EXTENSIONS_LOCATION + '/extensions',
          bundle: EXTENSIONS_LOCATION + '/bundles/vetur.0.16.2.min.json',
          logReads: __DEV__,
        },
      },
    },
  });
});
