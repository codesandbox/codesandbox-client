import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts(
  `${process.env.CODESANDBOX_HOST || ''}/static/js/stylus.min.js`
);

self.postMessage('ready');

declare var stylus: {
  render: (
    code: string,
    { filename: string },
    (err, css: string) => void
  ) => void,
};

self.addEventListener('message', event => {
  const { code, path } = event.data;

  // register a custom importer callback
  stylus.render(code, { filename: path }, (err, css) => {
    if (err) {
      return self.postMessage({
        type: 'error',
        error: buildWorkerError(err),
      });
    }

    return self.postMessage({
      type: 'result',
      transpiledCode: css,
    });
  });
});
