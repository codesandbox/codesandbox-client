import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts(['https://unpkg.com/browserified-pug']);

self.postMessage('ready');


self.addEventListener('message', event => {
  const { code, path } = event.data;

  // register a custom importer callback
  pug.render(code, { filename: path }, (err, html) => {

    if (err) {
      return self.postMessage({
        type: 'error',
        error: buildWorkerError(err)
      });
    }

    return self.postMessage({
      type: 'compiled',
      transpiledCode: html,
    });

  });

});
