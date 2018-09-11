import * as child_process from 'node-services/lib/child_process';
import ExtHostWorkerLoader from 'worker-loader?publicPath=/&name=ext-host-worker-2.[hash:8].worker.js!./bootstrap';

require('subworkers');

require('core-js/fn/string/starts-with');
require('core-js/fn/string/ends-with');
require('core-js/fn/array/find');
require('core-js/fn/promise');

child_process.addForkHandler('bootstrap', ExtHostWorkerLoader);

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs/browserfs.min.js`
);

self.BrowserFS = BrowserFS;
self.process = BrowserFS.BFSRequire('process');
self.Buffer = BrowserFS.BFSRequire('buffer').Buffer;
self.setImmediate = self.setTimeout;

console.log('pap');

require('./worker');
