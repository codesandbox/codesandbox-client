import resolve from 'browser-resolve';
import { join, basename, absolute, dirname } from 'common/utils/path';
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

const existsPromise = (fs, file) =>
  new Promise(r => {
    fs.stat(file, (err, stats) => {
      if (err || stats.isDirectory()) {
        return r(false);
      }

      return r(file);
    });
  });

const getExistingPath = async (fs, p) => {
  const underscoredPath = join(dirname(p), '_' + basename(p));
  const possiblePaths = [
    p,
    `${p}.css`,
    `${p}.scss`,
    `${p}.sass`,
    underscoredPath,
    `${underscoredPath}.css`,
    `${underscoredPath}.scss`,
    `${underscoredPath}.sass`,
  ];

  let existedFile = false;

  for (let i = 0; i < possiblePaths.length; i++) {
    if (!existedFile) {
      existedFile = await existsPromise(fs, possiblePaths[i]); // eslint-disable-line
    }
  }

  return existedFile;
};

const resolveSass = (fs, p, path) =>
  new Promise((r, reject) => {
    resolve(
      p,
      {
        filename: path,
        extensions: ['.scss', '.css', '.sass'],
        moduleDirectory: ['node_modules'],
        isFile: async (pp, cb) => {
          const exists = !!await getExistingPath(fs, pp);

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
  Sass.importer(async (request, done) => {
    // eslint-disable-next-line
    const fs = BrowserFS.BFSRequire('fs');

    try {
      const foundPath = await resolveSass(fs, request.current, path);

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

        done({
          content: data.toString(),
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
