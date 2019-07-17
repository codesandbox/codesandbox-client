import * as childProcess from 'node-services/lib/child_process';
// @ts-ignore
import DefaultWorkLoader from 'worker-loader?publicPath=/&name=dynamic-worker.[hash:8].worker.js!./generic-1';
// @ts-ignore
import TSWorker from 'worker-loader?publicPath=/&name=typescript-worker.[hash:8].worker.js!./ts-extension';
// @ts-ignore
import VueWorker from 'worker-loader?publicPath=/&name=vue-worker.[hash:8].worker.js!./vue-worker';
// @ts-ignore
import SvelteWorker from 'worker-loader?publicPath=/&name=svelte-worker.[hash:8].worker.js!./svelte-worker';
import { initializeAll } from '../common/global';

childProcess.addDefaultForkHandler(DefaultWorkLoader);
childProcess.addForkHandler(
  '/extensions/node_modules/typescript/lib/tsserver.js',
  TSWorker
);
childProcess.addForkHandler(
  '/extensions/octref.vetur.0.16.2/server/dist/vueServerMain.js',
  VueWorker
);
childProcess.addForkHandler(
  '/extensions/jamesbirtles.svelte-vscode-0.7.1/node_modules/svelte-language-server/bin/server.js',
  SvelteWorker
);

initializeAll().then(() => {
  // Preload the TS worker for fast init
  childProcess.preloadWorker(
    '/extensions/node_modules/typescript/lib/tsserver.js'
  );

  require('../workers/ext-host-worker');
});
