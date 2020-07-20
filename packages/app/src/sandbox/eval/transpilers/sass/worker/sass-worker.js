import resolve from 'browser-resolve';
import { absolute } from '@codesandbox/common/lib/utils/path';
import { extname, join, dirname } from 'path';
import delay from '@codesandbox/common/lib/utils/delay';
import { packageFilter } from '../../../utils/resolve-utils';

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

const SUPPORTED_EXTS = ['scss', 'sass', 'css'];

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

/**
 * Return and stop as soon as one promise returns a truthy value
 */
function firstTrue(promises) {
  const newPromises = promises.map(
    p => new Promise((res, reject) => p.then(v => v && res(v), reject))
  );
  newPromises.push(Promise.all(promises).then(() => false));
  return Promise.race(newPromises);
}

let pathCaches = {};
const getExistingPath = async (fs, p) => {
  if (p.endsWith('.json')) {
    return false;
  }

  if (pathCaches[p]) {
    return pathCaches[p];
  }

  const possiblePaths = Sass.getPathVariations(p);

  const existedFile = await firstTrue(
    possiblePaths.map(path => existsPromise(fs, path))
  );

  pathCaches[p] = existedFile;

  return existedFile;
};

const resolvedCache = {};
const resolveSass = (fs, p, path) => {
  const usedPath = p.startsWith('~') ? p.replace('~', '/node_modules/') : p;

  const sourceDir = dirname(path);
  resolvedCache[sourceDir] = resolvedCache[sourceDir] || {};
  if (resolvedCache[sourceDir][usedPath]) {
    return Promise.resolve(resolvedCache[sourceDir][usedPath]);
  }

  return new Promise((r, reject) => {
    const directPath = join(sourceDir, usedPath);

    // First try to do the relative path, as a performance optimization
    getExistingPath(fs, directPath).then(foundPath => {
      if (foundPath) {
        r(foundPath);
        return;
      }

      resolve(
        usedPath,
        {
          filename: path,
          extensions: ['.scss', '.css', '.sass'],
          moduleDirectory: ['node_modules'],
          packageFilter: packageFilter(),
          isFile: async (pp, c, cb) => {
            const exists = !!(await getExistingPath(fs, pp));
            const callback = c || cb;

            return callback(null, exists);
          },
          readFile: async (pp, encoding, cb) => {
            const newFoundPath = await getExistingPath(fs, pp);

            if (!newFoundPath) {
              const err = new Error('Could not find ' + pp);
              // $FlowIssue
              err.code = 'ENOENT';

              return cb(err);
            }

            return fs.readFile(newFoundPath, encoding, cb);
          },
        },
        async (err, resolvedPath) => {
          if (err) {
            if (/^\w/.test(p)) {
              r(resolveSass(fs, '.' + absolute(p), path));
            }

            reject(err);
          } else {
            const newFoundPath = await getExistingPath(fs, resolvedPath);

            r(newFoundPath);
          }
        }
      );
    });
  }).then(result => {
    resolvedCache[sourceDir][usedPath] = result;
    return result;
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
const foundFileCache = {};

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

      if (foundFileCache[foundPath]) {
        done({ path: foundPath });
        return;
      }
      fs.readFile(foundPath, {}, (error, data) => {
        if (error) {
          done({ error: error.message });
          return;
        }
        const depCode = data.toString();

        Sass.writeFile(foundPath, depCode, () => {
          foundFileCache[foundPath] = true;
          done({ path: foundPath });
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
