// This is the base worker that launches the extension host

import _debug from 'common/lib/utils/debug';
import { commonPostMessage } from 'common/lib/utils/global';
import loader from '../../dev-bootstrap';
import { initializeBrowserFS } from '../common/fs';
import { EXTENSIONS_LOCATION } from '../../constants';

const debug = _debug('cs:cp-worker');

debug('Starting Extension Host Worker');

declare var __DEV__: boolean;

const ctx: any = self;

self.addEventListener('message', async e => {
  const { data } = e;
  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      debug('Initializing BrowserFS');
      await initializeBrowserFS({
        syncSandbox: true,
        syncTypes: true,
        extraMounts: {
          '/extensions': {
            fs: 'BundledHTTPRequest',
            options: {
              index: EXTENSIONS_LOCATION + '/extensions/index.json',
              baseUrl: EXTENSIONS_LOCATION + '/extensions',
              bundle: EXTENSIONS_LOCATION + '/bundles/ext-host.min.json',
              logReads: __DEV__,
            },
          },
        },
      });
      debug('Initialized BrowserFS', data.data.env);

      const process = ctx.BrowserFS.BFSRequire('process');
      process.cwd = () => data.data.cwd || '/sandbox';
      process.env = data.data.env || {};
      process.env.HOME = '/home';

      loader(true)(() => {
        ctx.require(
          ['vs/workbench/services/extensions/node/extensionHostProcess'],
          () => {
            commonPostMessage({
              $type: 'worker-client',
              $event: 'initialized',
            });
          }
        );
      });
    }
  }
});

commonPostMessage({ $type: 'ready' });
