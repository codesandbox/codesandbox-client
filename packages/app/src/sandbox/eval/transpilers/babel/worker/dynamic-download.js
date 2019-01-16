import resolve from 'browser-resolve';
import getRequireStatements from './simple-get-require-statements';

const path = BrowserFS.BFSRequire('path');

function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
  const fs = BrowserFS.BFSRequire('fs');

  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

export const resolveAsyncModule = (
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

const downloads = {};
export async function downloadPath(absolutePath) {
  const r = await resolveAsyncModule(absolutePath, {});

  if (!r.found) {
    throw new Error(`${absolutePath} not found.`);
  }

  self.postMessage({
    type: 'add-transpilation-dependency',
    path: r.path,
  });

  const fs = BrowserFS.BFSRequire('fs');

  mkDirByPathSync(BrowserFS.BFSRequire('path').dirname(r.path));

  fs.writeFileSync(r.path, r.code);

  const requires = getRequireStatements(r.code);

  await Promise.all(
    requires.map(foundR => {
      if (foundR.type === 'direct') {
        if (foundR.path === 'babel-plugin-macros') {
          return '';
        }

        if (downloads[foundR.path]) {
          return downloads[foundR.path];
        }

        try {
          resolve.sync(foundR.path, {
            filename: r.path,
            extensions: ['.js', '.json'],
            moduleDirectory: ['node_modules'],
          });
          return '';
        } catch (e) {
          downloads[foundR.path] = downloadFromError(e)
            .then(() => {
              delete downloads[foundR.path];
            })
            .catch(() => {
              delete downloads[foundR.path];
            });
          return downloads[foundR.path];
        }
      }
      return Promise.resolve();
    })
  );

  return r;
}

export async function downloadFromError(e) {
  if (e.message.indexOf('Cannot find module') > -1) {
    return new Promise(resolve => {
      const dep = e.message.match(/Cannot find module '(.*?)'/)[1];
      const from = e.message.match(/from '(.*?)'/)[1];
      const absolutePath = dep.startsWith('.') ? path.join(from, dep) : dep;

      resolve(downloadPath(absolutePath));
    });
  }

  return Promise.resolve();
}
