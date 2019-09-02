import resolve from 'browser-resolve';
import { absolute } from '@codesandbox/common/lib/utils/path';
import { extname } from 'path';
import delay from '@codesandbox/common/lib/utils/delay';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.0/sass.sync.js',
]);

self.postMessage('ready');

declare var Sass: {
  options: Object => void,
  writeFile: ({ [fileName: string]: string }, callback: Function) => void,
  compileFile: (path: string) => string,
  compile: (code: string, options: Object, callback: Function) => string,
  registerPlugin: (name: string, plugin: Function) => void,
};

const resolveAsyncModule = (
  path: string,
  { ignoredExtensions }?: { ignoredExtensions?: Array<string> }
) =>
  new Promise((r, reject) => {
    const sendId = Math.floor(Math.random() * 10000);
    self.postMessage({
      type: 'resolve-async-transpiled-module',
      path,
      id: sendId,
      options: { isAbsolute: true, ignoredExtensions },
    });

    const resolveFunc = message => {
      const { type, id, found } = message.data;

      if (
        type === 'resolve-async-transpiled-module-response' &&
        id === sendId
      ) {
        if (found) {
          r(message.data);
        } else {
          reject(message.data);
        }
        self.removeEventListener('message', resolveFunc);
      }
    };

    self.addEventListener('message', resolveFunc);
  });

const SUPPORTED_EXTS = ['css', 'sass', 'scss'];

const existsPromise = (fs, file) =>
  new Promise(r => {
    fs.stat(file, async (err, stats) => {
      if (err || stats.isDirectory()) {
        if (stats && stats.isDirectory()) {
          r(false);
          return;
        }
        // We try to download it
        try {
          const { path } = await resolveAsyncModule(file, {
            ignoredExtensions: SUPPORTED_EXTS,
          });

          const ext = extname(path).substr(1);

          if (SUPPORTED_EXTS.indexOf(ext) === -1) {
            r(false);
            return;
          }

          r(path);
        } catch (e) {
          r(false);
        }
      } else {
        r(file);
      }
    });
  });

let pathCaches = {};
const getExistingPath = async (fs, p) => {
  if (p.endsWith('.json')) {
    return false;
  }

  if (pathCaches[p]) {
    return pathCaches[p];
  }

  const possiblePaths = Sass.getPathVariations(p);

  let existedFile = false;

  for (let i = 0; i < possiblePaths.length; i++) {
    if (!existedFile) {
      existedFile = await existsPromise(fs, possiblePaths[i]); // eslint-disable-line
    }
  }

  pathCaches[p] = existedFile;

  return existedFile;
};

const resolveSass = (fs, p, path) => {
  const usedPath = p.startsWith('~') ? p.replace('~', '/node_modules/') : p;

  return new Promise((r, reject) => {
    resolve(
      usedPath,
      {
        filename: path,
        extensions: ['.scss', '.css', '.sass'],
        moduleDirectory: ['node_modules'],
        isFile: async (pp, cb) => {
          const exists = !!(await getExistingPath(fs, pp));

          if (!exists) {
            const err = new Error('Could not find ' + pp);
            // $FlowIssue
            err.code = 'ENOENT';

            return cb(err);
          }

          return cb(null, exists);
        },
        readFile: async (pp, encoding, cb) => {
          const foundPath = await getExistingPath(fs, pp);

          if (!foundPath) {
            const err = new Error('Could not find ' + pp);
            // $FlowIssue
            err.code = 'ENOENT';

            return cb(err);
          }

          return fs.readFile(foundPath, encoding, cb);
        },
      },
      async (err, resolvedPath) => {
        if (err) {
          if (/^\w/.test(p)) {
            r(resolveSass(fs, '.' + absolute(p), path));
          }

          reject(err);
        } else {
          const foundPath = await getExistingPath(fs, resolvedPath);

          r(foundPath);
        }
      }
    );
  });
};

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

  pathCaches = {};
  Sass._path = '/';
  Sass.clearFiles();

  // register a custom importer callback
  Sass.importer(async (request, done) => {
    // eslint-disable-next-line
    const fs = BrowserFS.BFSRequire('fs');

    try {
      const currentPath =
        request.previous === 'stdin' ? path : request.previous;

      const foundPath =
        request.path || (await resolveSass(fs, request.current, currentPath));

      self.postMessage({
        type: 'add-transpilation-dependency',
        path: foundPath,
        isAbsolute: true,
      });

      fs.readFile(foundPath, {}, (error, data) => {
        if (error) {
          done({ error: error.message });
          return;
        }

        Sass.writeFile(foundPath, data.toString(), () => {
          done({
            path: foundPath,
          });
        });
      });
    } catch (e) {
      done({ error: e.message });
    }
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
});
