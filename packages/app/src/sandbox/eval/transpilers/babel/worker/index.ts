import loadPolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';

require('app/config/polyfills');

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs12/browserfs.min.js`
);

self.process = self.BrowserFS.BFSRequire('process');
// @ts-ignore
self.Buffer = self.BrowserFS.BFSRequire('buffer').Buffer;

loadPolyfills().then(() => {
  // eslint-disable-next-line global-require
  require('./babel-worker');
});
