// This is the base worker that launches the extension host

import loader from '../dev-bootstrap';
import _debug from 'common/utils/debug';
import { initializeBrowserFS } from './common/fs';

const debug = _debug('cs:cp-worker');

debug('Starting Worker');

self.addEventListener('message', async e => {
  const { data } = e;
  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      debug('Initializing BrowserFS');
      await initializeBrowserFS({ syncSandbox: true });
      debug('Initialized BrowserFS', data.data.env);

      const process = BrowserFS.BFSRequire('process');
      process.env = data.data.env || {};
      process.env.HOME = '/home';

      loader()(() => {
        self.require(['vs/workbench/node/extensionHostProcess'], () => {
          self.postMessage({
            $type: 'worker-client',
            $event: 'initialized',
          });
        });
      });
    }
  }
});
