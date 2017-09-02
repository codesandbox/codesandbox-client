import { buildWorkerError } from '../utils/worker-error-handler';

// This is a less plugin to resolve paths
import FileManager from './file-manager';

self.less = {
  env: 'development',
};

// Stub window for less....
self.window = self;
self.window.document = {
  currentScript: { async: true },
  createElement: () => ({ appendChild: () => {} }),
  createTextNode: () => ({}),
  getElementsByTagName: () => [],
  head: { appendChild: () => {} },
};

self.importScripts(['/static/js/less.min.js']);

self.postMessage('ready');

declare var less: {
  render: (code: string) => Promise<string>,
};

self.addEventListener('message', event => {
  const { code, path, files } = event.data;

  const context = {
    addDependency: depPath => {
      self.postMessage({ type: 'add-transpilation-dependency', path: depPath });
    },
  };

  const filename = path.split('/').pop();

  // register a custom importer callback
  less
    .render(code, { filename, plugins: [FileManager(context, files)] })
    .then(({ css }) =>
      self.postMessage({
        type: 'compiled',
        transpiledCode: css,
      })
    )
    .catch(err =>
      self.postMessage({
        type: 'error',
        error: buildWorkerError(err),
      })
    );
});
