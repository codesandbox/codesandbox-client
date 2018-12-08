import * as child_process from 'node-services/lib/child_process';

require('core-js/fn/string/starts-with');
require('core-js/fn/string/ends-with');
require('core-js/fn/array/find');
require('core-js/fn/promise');

child_process.addDefaultForkHandler(false);

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs2/browserfs.min.js`
);

self.BrowserFS = BrowserFS;
self.process = BrowserFS.BFSRequire('process');
self.process.platform = 'linux';
self.Buffer = BrowserFS.BFSRequire('buffer').Buffer;
self.setTimeout = setTimeout.bind(self);
self.clearTimeout = clearTimeout.bind(self);
self.setImmediate = (func, delay) => setTimeout(func, delay);
self.clearImmediate = id => self.clearTimeout(id);

require('../bootstrap-worker');
