import { ChildHandler } from '../worker-transpiler/child-handler';

// This is a less plugin to resolve paths
import FileManager from './file-manager';

const childHandler = new ChildHandler('less-worker');

export interface LessLibrary {
  render: (code: string, opts: Record<string, any>) => Promise<{ css: string }>;
}

// @ts-ignore
self.less = {
  env: 'development',
};

// Stub window for less....
// @ts-ignore
self.window = self;
// @ts-ignore
self.window.document = {
  // @ts-ignore
  currentScript: { async: true },
  // @ts-ignore
  createElement: () => ({ appendChild: () => {} }),
  // @ts-ignore
  createTextNode: () => ({}),
  // @ts-ignore
  getElementsByTagName: () => [],
  // @ts-ignore
  head: { appendChild: () => {}, removeChild: () => {} },
};

// self.importScripts('https://cdn.jsdelivr.net/npm/less@4.1.1/dist/less.min.js');
self.importScripts(
  `${process.env.CODESANDBOX_HOST || ''}/static/js/less-4.1.2.min.js`
);

interface ILessCompileOptions {
  code: string;
  path: string;
  files: Record<string, string>;
  loaderContextId: number;
}

export interface ILessLoaderContext {
  loaderContextId: number;
  files: Record<string, string>;
  addDependency: (path: string) => void;
  childHandler: ChildHandler;
}

async function workerCompile(opts: ILessCompileOptions) {
  const { code, path, files, loaderContextId } = opts;

  const transpilationDependencies = [];
  const context: ILessLoaderContext = {
    files,
    loaderContextId,
    childHandler,
    addDependency: depPath => {
      transpilationDependencies.push({
        path: depPath,
      });
    },
  };

  // Remove the linebreaks at the beginning of the file, it confuses less.
  const cleanCode = code.replace(/^\n$/gm, '');

  // register a custom importer callback
  // @ts-ignore
  const lessLibrary: LessLibrary = less;
  const { css } = await lessLibrary.render(cleanCode, {
    filename: path,
    plugins: [FileManager(context)],
  });

  return {
    css,
    transpilationDependencies,
  };
}

childHandler.registerFunction('compile', workerCompile);
childHandler.emitReady();
