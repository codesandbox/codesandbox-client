import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { ModuleNotFoundError } from 'sandpack-core/lib/resolver/errors/ModuleNotFound';

import getRequireStatements from './simple-get-require-statements';
import { convertEsModule } from '../ast/convert-esmodule';
import { generateCode, parseModule } from '../ast/utils';
import { ChildHandler } from '../../worker-transpiler/child-handler';
import { patchedResolve } from './utils/resolvePatch';

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
  path: string;
  code: string;
}

const downloadCache = new Map<string, Promise<IResolveResponse>>();
export const resolveAsyncModule = (
  modulePath: string,
  opts: {
    ignoredExtensions?: Array<string>;
    childHandler: ChildHandler;
    loaderContextId: number;
  }
): Promise<IResolveResponse> => {
  const { ignoredExtensions, childHandler, loaderContextId } = opts;
  if (downloadCache.get(modulePath)) {
    return downloadCache.get(modulePath);
  }

  downloadCache.set(
    modulePath,
    childHandler
      .callFn({
        method: 'resolve-async-transpiled-module',
        data: {
          loaderContextId,
          path: modulePath,
          options: {
            // isAbsolute is very confusing, it means that we use the current module as the root
            isAbsolute: true,
            ignoredExtensions,
          },
        },
      })
      .then(data => {
        if (!data.found) {
          throw new Error(`Could not find path: "${modulePath}".`);
        }

        return data;
      })
  );

  return downloadCache.get(modulePath);
};

function downloadRequires(
  currentPath: string,
  code: string,
  opts: {
    childHandler: ChildHandler;
    loaderContextId: number;
  }
) {
  const { childHandler, loaderContextId } = opts;
  const requires = getRequireStatements(code);

  // Download all other needed files
  return Promise.all(
    requires.map(async foundR => {
      if (foundR.type === 'direct') {
        if (foundR.path === 'babel-plugin-macros') {
          return;
        }

        try {
          patchedResolve().sync(foundR.path, {
            filename: currentPath,
            extensions: ['.js', '.json'],
          });
        } catch (err) {
          await downloadFromError({
            error: err,
            childHandler,
            loaderContextId,
          });
        }
      }
    })
  );
}

export async function downloadPath(
  absolutePath: string,
  {
    childHandler,
    loaderContextId,
  }: {
    childHandler: ChildHandler;
    loaderContextId: number;
  }
): Promise<{ code: string; path: string }> {
  const r = await resolveAsyncModule(absolutePath, {
    childHandler,
    loaderContextId,
  });

  if (!r.found) {
    throw new Error(`${absolutePath} not found.`);
  }

  await childHandler.callFn({
    method: 'add-transpilation-dependency',
    data: {
      loaderContextId,
      path: r.path,
    },
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
        absolutePath.endsWith('/package.json')
          ? absolutePath
          : path.join(absolutePath, 'package.json'),
        {
          childHandler,
          loaderContextId,
        }
      );
      if (r2) {
        mkDirByPathSync(path.dirname(r2.path));

        fs.writeFileSync(r2.path, r2.code);
      }
    } catch (e) {
      /* ignore */
    }

    const code = existingFile.toString();
    await downloadRequires(r.path, code, {
      childHandler,
      loaderContextId,
    });

    return {
      code,
      path: r.path,
    };
  }

  mkDirByPathSync(path.dirname(r.path));

  let code = r.code;
  try {
    const ast = parseModule(r.code);
    convertEsModule(ast);
    code = generateCode(ast);
  } catch (err) {
    console.warn(err);
  }

  fs.writeFileSync(r.path, code);

  await downloadRequires(r.path, code, {
    childHandler,
    loaderContextId,
  });

  return r;
}

function extractPathFromError(err: Error | ModuleNotFoundError): string {
  if (err instanceof ModuleNotFoundError) {
    return err.filepath;
  }

  if (err.message.indexOf('Cannot find module') > -1) {
    const matches = err.message.match(
      /Cannot find module '(.*?)'.*from '(.*?)'/
    );
    const dep = matches[1];
    const from = matches[2];
    const absolutePath = dep.startsWith('.') ? path.join(from, dep) : dep;
    return absolutePath;
  }

  return null;
}

export function downloadFromError(opts: {
  error: Error;
  childHandler: ChildHandler;
  loaderContextId: number;
}) {
  const { error, childHandler, loaderContextId } = opts;
  const moduleSpecifier = extractPathFromError(error);
  if (moduleSpecifier) {
    return downloadPath(moduleSpecifier, {
      childHandler,
      loaderContextId,
    });
  }
  return Promise.resolve();
}
