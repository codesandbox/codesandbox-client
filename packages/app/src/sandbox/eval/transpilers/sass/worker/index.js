self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs2/browserfs.min.js`
);

self.BrowserFS = BrowserFS;
self.process = BrowserFS.BFSRequire('process');
self.Buffer = BrowserFS.BFSRequire('buffer').Buffer;

require('./sass-worker');
