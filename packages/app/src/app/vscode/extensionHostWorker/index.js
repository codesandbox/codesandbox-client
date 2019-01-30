import * as child_process from 'node-services/lib/child_process';
import { EventEmitter } from 'events';
import DefaultWorkLoader from 'worker-loader?publicPath=/&name=dynamic-worker.[hash:8].worker.js!./bootstrap';

require('core-js/fn/string/starts-with');
require('core-js/fn/string/ends-with');
require('core-js/fn/array/find');
require('core-js/fn/promise');

child_process.addDefaultForkHandler(DefaultWorkLoader);

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs2/browserfs.min.js`
);

self.BrowserFS = BrowserFS;
self.process = BrowserFS.BFSRequire('process');
self.process.stdin = new EventEmitter();
self.Buffer = BrowserFS.BFSRequire('buffer').Buffer;
self.setImmediate = (func, delay) => setTimeout(func, delay);
self.clearImmediate = id => self.clearTimeout(id);

child_process.preloadWorker('/stub');

require('./worker');
