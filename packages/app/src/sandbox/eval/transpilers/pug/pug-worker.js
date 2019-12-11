import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts(
  `${process.env.CODESANDBOX_HOST ||
    ''}/static/js/browserified-pug.0.1.0.min.js`
);
self.postMessage('ready');

self.addEventListener('message', event => {
  const { code, path } = event.data;

  // register a custom importer callback
  self.pug.render(code, { filename: path }, (err, html) => {
    if (err) {
      return self.postMessage({
        type: 'error',
        error: buildWorkerError(err),
      });
    }

    return self.postMessage({
      type: 'result',
      transpiledCode: html,
    });
  });
});
