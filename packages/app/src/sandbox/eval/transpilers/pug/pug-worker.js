// @flow
import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts(['/static/js/pug-2.0.0-rc.4.js']);

self.postMessage('ready');

declare var pug: {
  compile: (
    code: string,
    { filename: string },
    (err, css: string) => void
  ) => void,
};

self.addEventListener('message', event => {
  const { code, path } = event.data;

  // register a custom importer callback
  pug.render(code, { filename: path }, (err, css) => {
    if (err) {
      return self.postMessage({
        type: 'error',
        error: buildWorkerError(err),
      });
    }

    return self.postMessage({
      type: 'compiled',
      transpiledCode: css,
    });
  });
});
