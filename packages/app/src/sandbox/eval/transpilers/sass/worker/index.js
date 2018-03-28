self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs/browserfs.min.js`
);

self.BrowserFS = BrowserFS;

require('./sass-worker');
