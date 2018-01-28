import resolve from 'browser-resolve';
import delay from 'common/utils/delay';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.6/sass.sync.min.js',
]);

self.postMessage('ready');

declare var Sass: {
  options: Object => void,
  writeFile: ({ [fileName: string]: string }, callback: Function) => void,
  compileFile: (path: string) => string,
  compile: (code: string, options: Object, callback: Function) => string,
  registerPlugin: (name: string, plugin: Function) => void,
};

function initializeBrowserFS() {
  return new Promise(res => {
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
  const { code, path, codesandbox } = event.data;

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

  // register a custom importer callback
  Sass.importer((request, done) => {
    resolve(
      request.current,
      {
        filename: path,
        extensions: ['.scss', '.css', '.sass'],
        moduleDirectory: ['node_modules'],
      },
      (err, resolvedPath) => {
        if (err) {
          done({ error: err.message });
          return;
        }

        self.postMessage({
          type: 'add-transpilation-dependency',
          path: resolvedPath,
          isAbsolute: true,
        });

        const fs = BrowserFS.BFSRequire('fs');

        fs.readFile(resolvedPath, {}, (error, data) => {
          if (error) {
            done({ error: error.message });
            return;
          }

          done({
            content: data.toString(),
          });
        });
      }
    );
  });

  Sass.compile(
    code,
    {
      sourceMapEmbed: true,
      indentedSyntax: path.endsWith('.sass'),
    },
    result => {
      if (result.status === 0) {
        self.postMessage({
          type: 'compiled',
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
});
