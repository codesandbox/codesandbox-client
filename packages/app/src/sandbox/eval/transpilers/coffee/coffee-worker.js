import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts(
  `${process.env.CODESANDBOX_HOST || ''}/static/js/coffeescript.2.3.2.js`
);
self.postMessage('ready');

self.addEventListener('message', event => {
  const { code, path } = event.data;

  try {
    const compiled = self.CoffeeScript.compile(code, {
      filename: path,
      sourceFiles: [path],
      bare: true,
      literate: false,
      inlineMap: true,
      sourceMap: false,
    });
    return self.postMessage({
      type: 'result',
      transpiledCode: compiled,
    });
  } catch (err) {
    return self.postMessage({
      type: 'error',
      error: buildWorkerError(err),
    });
  }
});
