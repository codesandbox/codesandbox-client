import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts(['https://unpkg.com/svelte@1.39.0/compiler/svelte.js']);

self.postMessage('ready');

declare var svelte: {
  compile: (code: string, options: Object) => { code: string },
};

self.addEventListener('message', event => {
  const { code, path } = event.data;

  const { code: compiledCode } = svelte.compile(code, {
    filename: path,

    onerror: e => {
      self.postMessage({
        type: 'error',
        error: buildWorkerError(e),
      });
    },
  });

  self.postMessage({
    type: 'compiled',
    transpiledCode: compiledCode,
  });
});
