import resolve from 'browser-resolve';
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import getRequireStatements from './simple-get-require-statements';

const global = getGlobal();
const path = global.BrowserFS.BFSRequire('path');

function mkDirByPathSync(
  targetDir: string,
  { isRelativeToScript = false } = {}
) {
  const fs = global.BrowserFS.BFSRequire('fs');

  const { sep } = path;
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

interface IResolveResponse {
  found: boolean;
  type: 'resolve-async-transpiled-module-response';
  id: number;
  path: string;
  code: string;
}

const downloadCache = new Map<string, Promise<IResolveResponse>>();
let lastSentId = 0;

export const resolveAsyncModule = (
  modulePath: string,
  { ignoredExtensions }: { ignoredExtensions?: Array<string> }
): Promise<IResolveResponse> => {
  if (downloadCache.get(modulePath)) {
    return downloadCache.get(modulePath);
  }

  downloadCache.set(
    modulePath,
    new Promise((r, reject) => {
      const sendId = lastSentId++;

      global.postMessage({
        type: 'resolve-async-transpiled-module',
        path: modulePath,
        id: sendId,
        options: { isAbsolute: true, ignoredExtensions },
      });

      const resolveFunc = (message: { data: IResolveResponse }) => {
        const { type, id, found } = message.data;

        if (
          type === 'resolve-async-transpiled-module-response' &&
          id === sendId
        ) {
          if (found) {
            r(message.data);
          } else {
            reject(new Error("Could not find path: '" + modulePath + "'."));
          }
          global.removeEventListener('message', resolveFunc);
        }
      };

      global.addEventListener('message', resolveFunc);
    })
  );

  return downloadCache.get(modulePath);
};

export async function downloadPath(
  absolutePath: string
): Promise<{ code: string; path: string }> {
  const r = await resolveAsyncModule(absolutePath, {});

  if (!r.found) {
    throw new Error(`${absolutePath} not found.`);
  }

  global.postMessage({
    type: 'add-transpilation-dependency',
    path: r.path,
  });

  const fs = global.BrowserFS.BFSRequire('fs');

  let existingFile: string;

  try {
    existingFile = fs.readFileSync(r.path);
  } catch (e) {
    /* ignore */
  }

  if (existingFile) {
    try {
      // Maybe there was a redirect from package.json. Manager only returns the redirect,
      // if the babel worker doesn't have the package.json it enters an infinite loop.
      const r2 = await resolveAsyncModule(
        path.join(absolutePath, 'package.json'),
        {}
      );
      if (r2) {
        mkDirByPathSync(path.dirname(r2.path));

        fs.writeFileSync(r2.path, r2.code);
      }
    } catch (e) {
      /* ignore */
    }

    return {
      code: existingFile,
      path: r.path,
    };
  }

  mkDirByPathSync(path.dirname(r.path));
  fs.writeFileSync(r.path, r.code);

  const requires = getRequireStatements(r.code);

  // Download all other needed files
  await Promise.all(
    requires.map(async foundR => {
      if (foundR.type === 'direct') {
        if (foundR.path === 'babel-plugin-macros') {
          return;
        }

        try {
          resolve.sync(foundR.path, {
            filename: r.path,
            extensions: ['.js', '.json'],
            moduleDirectory: ['node_modules'],
          });
        } catch (e) {
          await downloadFromError(e);
        }
      }
    })
  );

  return r;
}

export function downloadFromError(e: Error) {
  if (e.message.indexOf('Cannot find module') > -1) {
    const dep = e.message.match(/Cannot find module '(.*?)'/)[1];
    const from = e.message.match(/from '(.*?)'/)[1];
    const absolutePath = dep.startsWith('.') ? path.join(from, dep) : dep;

    return downloadPath(absolutePath);
  }

  return Promise.resolve();
}
