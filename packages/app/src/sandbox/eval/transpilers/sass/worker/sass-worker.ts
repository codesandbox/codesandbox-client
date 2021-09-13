import delay from '@codesandbox/common/lib/utils/delay';

import { resolveSassUrl } from './resolver';
import { ChildHandler } from '../../worker-transpiler/child-handler';

// @ts-ignore
self.window = self;

let libPromise = null;
async function fetchSassLibrary() {
  if (!libPromise) {
    // @ts-ignore
    libPromise = import('browser-dart-sass').then(x => x.default);
  }
  return libPromise;
}

let fsInitialized = false;
const childHandler = new ChildHandler('sass-worker');

interface ISassCompileOptions {
  code: string;
  path: string;
  indentedSyntax: boolean;
  loaderContextId: number;
}

async function initFS() {
  if (!fsInitialized) {
    while (!fsInitialized) {
      await delay(50); // eslint-disable-line
    }
  }
}

async function compileSass(opts: ISassCompileOptions) {
  const { code, path, indentedSyntax, loaderContextId } = opts;

  const Sass = await fetchSassLibrary();

  await initFS();

  // @ts-ignore
  // eslint-disable-next-line
  const fs = BrowserFS.BFSRequire('fs');

  // TODO: Invalidate this in a smarter way
  // we reset the found file cache and resolution cache in case one of the imports/filenames changed
  const foundFileCache = {};
  const resolutionCache = {};
  const transpilationDependencies = [];

  const readFile = filepath => {
    if (!foundFileCache[filepath]) {
      foundFileCache[filepath] = new Promise(
        (promiseResolve, promiseReject) => {
          fs.readFile(filepath, {}, (error, data) => {
            if (error) {
              promiseReject(error);
              return;
            }

            promiseResolve(data.toString());
          });
        }
      );
    }

    return foundFileCache[filepath];
  };

  const importer = async (
    url,
    prev
  ): Promise<{ file: string; contents: string; isIndentedSyntax: boolean }> => {
    try {
      const previous = prev === 'stdin' ? path : prev;

      // request.path sometimes returns a partially resolved path
      // See: https://github.com/codesandbox/codesandbox-client/issues/4865
      const foundPath = await resolveSassUrl({
        url,
        previous,
        fs,
        resolutionCache,
        loaderContextId,
        childHandler,
      });

      if (!foundPath) {
        throw new Error(`Could not resolve ${url}`);
      }

      transpilationDependencies.push({
        path: foundPath,
        options: {
          isAbsolute: true,
        },
      });

      const contents = await readFile(foundPath);
      return {
        file: foundPath,
        contents,
        isIndentedSyntax: foundPath.endsWith('sass'),
      };
    } catch (err) {
      err.message = `Could not resolve ${url}: ${err.message}`;
      throw err;
    }
  };

  const transpilationResult: {
    css: any;
    map: any;
    stats: any;
  } = await new Promise((resolve, reject) => {
    Sass.render(
      {
        data: code,
        importer: (url, prev, done) => {
          importer(url, prev)
            .then(result => {
              done(result);
            })
            .catch(err => {
              done(err);
            });
        },
        sourceMapEmbed: true,
        indentedSyntax,
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });

  const transpiledCode = transpilationResult.css.toString();
  return {
    transpiledCode,
    transpilationDependencies,
  };
}

async function initializeBrowserFS() {
  await new Promise(res => {
    // @ts-ignore
    // eslint-disable-next-line
    BrowserFS.configure(
      {
        fs: 'WorkerFS',
        options: { worker: self },
      },
      () => {
        res(null);
      }
    );
  });

  fsInitialized = true;
}

childHandler.registerFunction('compile', compileSass);
childHandler.registerFSInitializer(initializeBrowserFS);
childHandler.emitReady();
