self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs3/browserfs.min.js`
);

self.process = self.BrowserFS.BFSRequire('process');
self.Buffer = self.BrowserFS.BFSRequire('buffer').Buffer;

require('./sass-worker');
