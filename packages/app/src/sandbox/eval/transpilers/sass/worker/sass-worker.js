import delay from '@codesandbox/common/lib/utils/delay';
import { resolveSassUrl } from './resolver';
import { ChildHandler } from '../../worker-transpiler/child-handler';

self.importScripts(
  'https://cdn.jsdelivr.net/npm/sass.js@0.11.0/dist/sass.sync.js'
);

let fsInitialized = false;
const childHandler = new ChildHandler('sass-worker');

declare var Sass: {
  options: Object => void,
  writeFile: ({ [fileName: string]: string }, callback: Function) => void,
  compileFile: (path: string) => string,
  compile: (code: string, options: Object, callback: Function) => string,
  registerPlugin: (name: string, plugin: Function) => void,
};

interface ISassCompileOptions {
  code: string;
  path: string;
  indentedSyntax: boolean;
  loaderContextId: number;
}

async function compileSass(opts: ISassCompileOptions) {
  const { code, path, indentedSyntax, loaderContextId } = opts;

  if (!fsInitialized) {
    while (!fsInitialized) {
      await delay(50); // eslint-disable-line
    }
  }

  Sass._path = '/';

  // TODO: Invalidate this in a smarter way
  // we reset the found file cache and resolution cache in case one of the imports/filenames changed
  const foundFileCache = {};
  const resolutionCache = {};
  const transpilationDependencies = [];

  const importer = async request => {
    // eslint-disable-next-line
    const fs = BrowserFS.BFSRequire('fs');
    const importUrl = request.current;

    try {
      const previousFilePath =
        request.previous === 'stdin' ? path : request.previous;

      // request.path sometimes returns a partially resolved path
      // See: https://github.com/codesandbox/codesandbox-client/issues/4865
      const foundPath = await resolveSassUrl({
        previousFilePath,
        importUrl,
        fs,
        resolutionCache,
        loaderContextId,
        childHandler,
      });

      if (!foundPath) {
        throw new Error(`Could not resolve ${importUrl}`);
      }

      transpilationDependencies.push({
        path: foundPath,
        options: {
          isAbsolute: true,
        },
      });

      if (!foundFileCache[foundPath]) {
        await new Promise((promiseResolve, promiseReject) => {
          fs.readFile(foundPath, {}, (error, data) => {
            if (error) {
              promiseReject(error);
              return;
            }

            const depCode = data.toString();
            Sass.writeFile(foundPath, depCode, () => {
              foundFileCache[foundPath] = true;
              promiseResolve(null);
            });
          });
        });
      }

      return { path: foundPath };
    } catch (err) {
      err.message = `Could not resolve ${importUrl}: ${err.message}`;
      throw err;
    }
  };

  // register a custom importer callback
  Sass.importer((request, done) => {
    importer(request)
      .then(done)
      .catch(err => done({ error: err.message || 'Could not resolve import' }));
  });

  const transpiledCode = await new Promise((resolve, reject) => {
    Sass.compile(
      code,
      {
        sourceMapEmbed: true,
        indentedSyntax,
      },
      result => {
        if (result.status === 0) {
          resolve(result.text);
        } else {
          reject(new Error(result.formatted));
        }
      }
    );
  });

  return { transpiledCode, transpilationDependencies };
}

async function initializeBrowserFS() {
  await new Promise(res => {
    // eslint-disable-next-line
    BrowserFS.configure(
      {
        fs: 'WorkerFS',
        options: { worker: self },
      },
      () => {
        res();
      }
    );
  });

  fsInitialized = true;
}

childHandler.registerFunction('compile', compileSass);
childHandler.registerFSInitializer(initializeBrowserFS);
childHandler.emitReady();
