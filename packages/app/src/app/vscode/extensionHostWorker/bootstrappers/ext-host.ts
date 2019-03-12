import * as child_process from 'node-services/lib/child_process';
// @ts-ignore
import DefaultWorkLoader from 'worker-loader?publicPath=/&name=dynamic-worker.[hash:8].worker.js!./generic-1';
// @ts-ignore
import TSWorker from 'worker-loader?publicPath=/&name=typescript-worker.[hash:8].worker.js!./ts-extension';
// @ts-ignore
import VueWorker from 'worker-loader?publicPath=/&name=vue-worker.[hash:8].worker.js!./vue-worker';
import { initializeAll } from '../common/global';

child_process.addDefaultForkHandler(DefaultWorkLoader);
child_process.addForkHandler(
  '/extensions/node_modules/typescript/lib/tsserver.js',
  TSWorker
);
child_process.addForkHandler(
  '/extensions/octref.vetur.0.16.2/server/dist/vueServerMain.js',
  VueWorker
);

initializeAll().then(() => {
  // Preload the TS worker for fast init
  child_process.preloadWorker(
    '/extensions/node_modules/typescript/lib/tsserver.js'
  );

  require('../workers/ext-host-worker');
});
