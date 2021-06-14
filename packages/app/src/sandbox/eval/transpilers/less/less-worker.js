import { ChildHandler } from '../worker-transpiler/child-handler';

// This is a less plugin to resolve paths
import FileManager from './file-manager';

const childHandler = new ChildHandler('less-worker');

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

declare var less: {
  render: (code: string) => Promise<string>,
};

async function workerCompile(opts) {
  const { code, path, files } = opts;

  const transpilationDependencies = [];
  const context = {
    addDependency: depPath => {
      transpilationDependencies.push({
        path: depPath,
      });
    },
  };

  // Remove the linebreaks at the beginning of the file, it confuses less.
  const cleanCode = code.replace(/^\n$/gm, '');

  // register a custom importer callback
  const { css } = await less.render(cleanCode, {
    filename: path,
    plugins: [FileManager(context, files)],
  });

  return {
    css,
    transpilationDependencies,
  };
}

childHandler.registerFunction('compile', workerCompile);
childHandler.emitReady();
