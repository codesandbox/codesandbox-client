import loadPolyfills from 'common/load-dynamic-polyfills';

require('app/config/polyfills');

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs/browserfs.min.js`
);

self.BrowserFS = BrowserFS;
self.process = BrowserFS.BFSRequire('process');
self.Buffer = BrowserFS.BFSRequire('buffer').Buffer;

loadPolyfills().then(() => {
  require('./babel-worker');
});
