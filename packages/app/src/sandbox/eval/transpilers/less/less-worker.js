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
  head: { appendChild: () => {}, removeChild: () => {} },
};

// self.importScripts('https://cdn.jsdelivr.net/npm/less@4.1.1/dist/less.min.js');
self.importScripts(
  `${process.env.CODESANDBOX_HOST || ''}/static/js/less.min.js`
);

self.postMessage('ready');

declare var less: {
  render: (code: string) => Promise<string>,
};

self.addEventListener('message', async event => {
  try {
    const { code, path, files } = event.data;

    const context = {
      addDependency: depPath => {
        self.postMessage({
          type: 'add-transpilation-dependency',
          path: depPath,
        });
      },
    };

    // Remove the linebreaks at the beginning of the file, it confuses less.
    const cleanCode = code.replace(/^\n$/gm, '');

    // register a custom importer callback
    less
      .render(cleanCode, {
        filename: path,
        plugins: [FileManager(context, files)],
      })
      .then(({ css }) => {
        self.postMessage({
          type: 'result',
          transpiledCode: css,
        });
      })
      .catch(err => {
        self.postMessage({
          type: 'error',
          error: buildWorkerError(err),
        });
      });
  } catch (e) {
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
});
