require('core-js/fn/string/starts-with');
require('core-js/fn/string/ends-with');
require('core-js/fn/array/find');

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs/browserfs.min.js`
);

self.BrowserFS = BrowserFS;
self.process = BrowserFS.BFSRequire('process');
self.Buffer = BrowserFS.BFSRequire('buffer').Buffer;

require('./babel-worker');
