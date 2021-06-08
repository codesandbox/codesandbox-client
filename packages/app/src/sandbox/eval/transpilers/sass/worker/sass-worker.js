import delay from '@codesandbox/common/lib/utils/delay';
import { resolveSassUrl } from './resolver';

self.importScripts(
  'https://cdn.jsdelivr.net/npm/sass.js@0.11.0/dist/sass.sync.js'
);

self.postMessage('ready');

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
}

async function compileSass(opts: ISassCompileOptions) {
  const { code, path, indentedSyntax } = opts;

  Sass._path = '/';

  // TODO: Invalidate this in a smarter way
  // we reset the found file cache and resolution cache in case one of the imports/filenames changed
  const foundFileCache = {};
  const resolutionCache = {};

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
      });

      if (!foundPath) {
        throw new Error(`Could not resolve ${importUrl}`);
      }

      self.postMessage({
        type: 'add-transpilation-dependency',
        path: foundPath,
        isAbsolute: true,
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

  Sass.compile(
    code,
    {
      sourceMapEmbed: true,
      indentedSyntax,
    },
    result => {
      if (result.status === 0) {
        self.postMessage({
          type: 'result',
          transpiledCode: result.text,
        });
      } else {
        self.postMessage({
          type: 'error',
          error: {
            name: 'CompileError',
            message: result.formatted,
            fileName: result.file && result.file.replace('/sass/', ''),
          },
        });
      }
    }
  );
}

function initializeBrowserFS() {
  return new Promise(res => {
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
}

let fsInitialized = false;
self.addEventListener('message', async event => {
  const { code, path, indentedSyntax, codesandbox } = event.data;

  if (!codesandbox) {
    return;
  }

  if (event.data.type === 'initialize-fs') {
    await initializeBrowserFS();
    fsInitialized = true;
    return;
  }

  if (!fsInitialized) {
    while (!fsInitialized) {
      await delay(50); // eslint-disable-line
    }
  }

  if (event.data.type === 'compile') {
    compileSass({ code, path, indentedSyntax });
  }
});
