// This is the base worker that launches the extension host

import _debug from 'common/utils/debug';
import loader from '../../dev-bootstrap';
import { initializeBrowserFS } from '../common/fs';

const debug = _debug('cs:cp-worker');

debug('Starting Extension Host Worker');

const ctx: any = self;

self.addEventListener('message', async e => {
  const { data } = e;
  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      debug('Initializing BrowserFS');
      await initializeBrowserFS({ syncSandbox: true });
      debug('Initialized BrowserFS', data.data.env);

      const process = ctx.BrowserFS.BFSRequire('process');
      process.env = data.data.env || {};
      process.env.HOME = '/home';

      loader()(() => {
        ctx.require(['vs/workbench/node/extensionHostProcess'], () => {
          ctx.postMessage({
            $type: 'worker-client',
            $event: 'initialized',
          });
        });
      });
    }
  }
});
