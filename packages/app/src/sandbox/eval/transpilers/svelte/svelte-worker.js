import semver from 'semver';
import { buildWorkerError } from '../utils/worker-error-handler';
import { buildWorkerWarning } from '../utils/worker-warning-handler';

// Allow svelte to use btoa
self.window = self;

self.postMessage('ready');

function getV3Code(code, version, path) {
  self.importScripts([`https://unpkg.com/svelte@${version}/compiler.js`]);
  try {
    const { js, warnings } = self.svelte.compile(code, {
      filename: path,
      dev: true,
    });

    self.postMessage({
      type: 'clear-warnings',
      path,
      source: 'svelte',
    });

    warnings.forEach(w => {
      self.postMessage({
        type: 'warning',
        warning: buildWorkerWarning(
          {
            fileName: w.fileName,
            lineNumber: w.start && w.start.line,
            columnNumber: w.start && w.start.column,
            message: w.message,
          },
          'svelte'
        ),
      });
    });

    return js;
  } catch (e) {
    return self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
}

function getV2Code(code, version, path) {
  self.importScripts([
    `https://unpkg.com/svelte@${version}/compiler/svelte.js`,
  ]);
  self.postMessage({
    type: 'clear-warnings',
    path,
    source: 'svelte',
  });

  const {
    js: { code: compiledCode, map },
  } = self.svelte.compile(code, {
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

function getV1Code(code, version, path) {
  self.importScripts([
    `https://unpkg.com/svelte@${version}/compiler/svelte.js`,
  ]);
  return self.svelte.compile(code, {
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

  if (semver.satisfies(version, '1.x')) {
    versionCode = getV1Code(code, version, path);
  }
  if (semver.satisfies(version, '2.x')) {
    versionCode = getV2Code(code, version, path);
  }
  if (semver.satisfies(version, '3.x')) {
    versionCode = getV3Code(code, version, path);
  }

  const { code: compiledCode, map } = versionCode;

  const withInlineSourcemap = `${compiledCode}
  //# sourceMappingURL=${map.toUrl()}`;

  self.postMessage({
    type: 'result',
    transpiledCode: withInlineSourcemap,
  });
});
