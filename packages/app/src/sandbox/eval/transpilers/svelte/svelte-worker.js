import { buildWorkerError } from '../utils/worker-error-handler';
import { buildWorkerWarning } from '../utils/worker-warning-handler';

// Allow svelte to use btoa
self.window = self;

self.importScripts(['https://unpkg.com/svelte@^2.0.0/compiler/svelte.js']);

self.postMessage('ready');

declare var svelte: {
  compile: (code: string, options: Object) => { code: string },
};

function getV2Code(code, path) {
  const {
    js: { code: compiledCode, map },
  } = svelte.compile(code, {
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

  return { code: compiledCode, map };
}

function getV1Code(code, path) {
  self.importScripts(['https://unpkg.com/svelte@^1.43.1/compiler/svelte.js']);
  return svelte.compile(code, {
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
}

self.addEventListener('message', event => {
  const { code, path, isV2 } = event.data;

  const { code: compiledCode, map } = isV2
    ? getV2Code(code, path)
    : getV1Code(code, path);

  const withInlineSourcemap = `${compiledCode}
  //# sourceMappingURL=${map.toUrl()}`;

  self.postMessage({
    type: 'result',
    transpiledCode: withInlineSourcemap,
  });
});
