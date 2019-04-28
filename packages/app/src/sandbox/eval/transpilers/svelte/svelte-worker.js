import semver from 'semver';
import { buildWorkerError } from '../utils/worker-error-handler';
import { buildWorkerWarning } from '../utils/worker-warning-handler';

// Allow svelte to use btoa
self.window = self;

self.importScripts(['https://unpkg.com/svelte@3.0.0/compiler.js']);

self.postMessage('ready');

// declare var svelte: {
//   compile: (code: string, options: Object) => { code: string },
// };

function getV2Code(code, path) {
  const {
    js: { code: compiledCode, map },
  } = window.svelte.compile(code, {
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

function getV3Code(code) {
  self.importScripts(['https://unpkg.com/svelte@3.0.1/compiler.js']);
  try {
    return window.svelte.compile(code, {
      dev: true,
    }).js;
  } catch (e) {
    return self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
}

function getV1Code(code, path) {
  self.importScripts(['https://unpkg.com/svelte@^1.43.1/compiler/svelte.js']);
  return window.svelte.compile(code, {
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
  const { code, path, version } = event.data;
  let versionCode = '';

  switch (version) {
    case semver.satisfies(version, '<2.0.0'): {
      versionCode = getV1Code(code, path);
      break;
    }
    case semver.satisfies(version, '>=3.0.0'): {
      versionCode = getV3Code(code, path);
      break;
    }
    case semver.satisfies(version, '>=2.0.0'): {
      versionCode = getV2Code(code, path);
      break;
    }
    default:
      versionCode = getV3Code(code, path);
  }

  const { code: compiledCode, map } = versionCode;

  const withInlineSourcemap = `${compiledCode}
  //# sourceMappingURL=${map.toUrl()}`;

  self.postMessage({
    type: 'result',
    transpiledCode: withInlineSourcemap,
  });
});
