import { buildWorkerError } from '../utils/worker-error-handler';
import { buildWorkerWarning } from '../utils/worker-warning-handler';

// Allow svelte to use btoa
self.window = self;

self.importScripts(['https://unpkg.com/svelte@^1.43.1/compiler/svelte.js']);

self.postMessage('ready');

declare var svelte: {
  compile: (code: string, options: Object) => { code: string },
};

self.addEventListener('message', event => {
  const { code, path } = event.data;

  const { code: compiledCode, map } = svelte.compile(code, {
    filename: path,
    dev: true,
    cascade: false,
    store: true,

    onerror: e => {
      self.postMessage({
        type: 'error',
        error: buildWorkerError(e),
      });
    },

    onwarn: w => {
      self.postMessage({
        type: 'warning',
        warning: buildWorkerWarning(
          {
            fileName: w.fileName,
            lineNumber: w.loc && w.loc.line,
            columnNumber: w.loc && w.loc.column,
            message: w.message,
          },
          'svelte'
        ),
      });
    },
  });

  const withInlineSourcemap = `${compiledCode}
  //# sourceMappingURL=${map.toUrl()}`;

  self.postMessage({
    type: 'compiled',
    transpiledCode: withInlineSourcemap,
  });
});
