import * as pathUtils from '@codesandbox/common/lib/utils/path';
import { ChildHandler } from '../../worker-transpiler/child-handler';

// Extensions without `.`, resolver expects it like this
const POTENTIAL_EXTENSIONS = ['scss', 'sass', 'css'];

// Re-implementation of sass.js's `getPathVariations`, dart-sass does not implement this and we have some extra logic on top
export function getPathVariations(filename: string) {
  const hasExtension = !!pathUtils.extname(filename);
  const extensions = hasExtension
    ? ['']
    : POTENTIAL_EXTENSIONS.map(ext => '.' + ext);
  const pathVariations = [];

  // eslint-disable-next-line no-unused-vars
  for (const ext of extensions) {
    pathVariations.push(pathUtils.join(filename + ext));
    pathVariations.push(pathUtils.join('_' + filename + ext));
  }

  if (!hasExtension) {
    // eslint-disable-next-line no-unused-vars
    for (const ext of extensions) {
      pathVariations.push(pathUtils.join(filename, 'index' + ext));
      pathVariations.push(pathUtils.join(filename, '_index' + ext));
    }
  }

  return pathVariations;
}

export function getPossibleSassPaths(
  directories: Array<string>,
  filepath: string
) {
  if (filepath[0] === '~') {
    // eslint-disable-next-line no-param-reassign
    directories = ['/node_modules'];
    // eslint-disable-next-line no-param-reassign
    filepath = filepath.substr(1);
  } else if (filepath[0] !== '.' && filepath[0] !== '/') {
    directories.push('/node_modules');
  }

  return directories.map(directory => pathUtils.join(directory, filepath));
}

export async function resolveAsyncModule(opts: {
  path: string;
  options: {
    isAbsolute: boolean;
    ignoredExtensions: typeof POTENTIAL_EXTENSIONS;
  };
  loaderContextId: number;
  childHandler: ChildHandler;
}) {
  const { path, options = {}, loaderContextId, childHandler } = opts;

  const resolvedModule = await childHandler.callFn({
    method: 'resolve-async-transpiled-module',
    data: {
      path,
      options,
      loaderContextId,
    },
  });

  if (!resolvedModule.found) {
    throw new Error(`Module ${path} not found.`);
  }

  return resolvedModule;
}

function existsPromise(opts: {
  fs: any;
  filepath: string;
  loaderContextId: number;
  childHandler: ChildHandler;
}): Promise<false | string> {
  const { fs, filepath, loaderContextId, childHandler } = opts;
  return new Promise(r => {
    fs.stat(filepath, async (err, stats) => {
      if (err || stats.isDirectory()) {
        if (stats && stats.isDirectory()) {
          r(false);
          return;
        }

        // We try to download it
        try {
          const resolvedModule = await resolveAsyncModule({
            path: filepath,
            options: {
              isAbsolute: filepath.startsWith('/'),
              ignoredExtensions: POTENTIAL_EXTENSIONS,
            },
            loaderContextId,
            childHandler,
          });

          const ext = pathUtils.extname(resolvedModule.path).substring(1);
          if (POTENTIAL_EXTENSIONS.indexOf(ext) === -1) {
            r(false);
            return;
          }

          try {
            fs.mkdirSync(pathUtils.dirname(resolvedModule.path), {
              recursive: true,
            });
          } catch (e) {
            /* noop */
          }
          try {
            fs.writeFileSync(resolvedModule.path, resolvedModule.code);
          } catch (e) {
            /* noop */
          }

          r(resolvedModule.path);
        } catch (e) {
          r(false);
        }
      } else {
        r(filepath);
      }
    });
  });
}

async function resolvePotentialPath(opts: {
  fs: any;
  potentialPath: string;
  loaderContextId: number;
  childHandler: ChildHandler;
}): Promise<string | null> {
  const { fs, potentialPath, loaderContextId, childHandler } = opts;
  try {
    const pathDirName = pathUtils.dirname(potentialPath);
    const pathVariations = getPathVariations(
      pathUtils.basename(potentialPath)
    ).map(variation => pathUtils.join(pathDirName, variation));

    // Try the first one first, that's often the right one and this way we don't spam
    // the main thread.
    const firstPath = pathVariations.shift();
    const firstFoundFilePath = await existsPromise({
      fs,
      filepath: firstPath,
      loaderContextId,
      childHandler,
    });

    if (firstFoundFilePath) {
      return firstPath;
    }

    for (const path of pathVariations) {
      // eslint-disable-next-line no-await-in-loop
      const result = await existsPromise({
        fs,
        filepath: path,
        loaderContextId,
        childHandler,
      });

      if (result) {
        return path;
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

function getFilePathFromUrl(val: string): string {
  try {
    const parsed = new URL(val);
    return parsed.pathname;
  } catch (err) {
    return val;
  }
}

function getFilePathsFromUrls(urls: string[]): string[] {
  return urls.map(getFilePathFromUrl);
}

interface ISassResolverOptions {
  url: string;
  previous: string;
  includePaths?: Array<string>;
  env?: any;
  fs: any;
  resolutionCache: { [k: string]: Promise<string> };
  loaderContextId: number;
  childHandler: ChildHandler;
}

/* Re-implementation of sass importer
Imports are resolved by trying, in order:
  * Loading a file relative to the file in which the `@import` appeared.
  * Each custom importer.
  * Loading a file relative to the current working directory.
  * Each load path in `includePaths`
  * Each load path specified in the `SASS_PATH` environment variable, which should be semicolon-separated on Windows and colon-separated elsewhere.
See: https://sass-lang.com/documentation/js-api#importer
See also: https://github.com/sass/dart-sass/blob/006e6aa62f2417b5267ad5cdb5ba050226fab511/lib/src/importer/node/implementation.dart
*/
export async function resolveSassUrl(opts: ISassResolverOptions) {
  const {
    includePaths = [],
    env = {},
    fs,
    resolutionCache,
    loaderContextId,
    childHandler,
  } = opts;
  let { url, previous } = opts;

  if (loaderContextId == null) {
    throw new Error('Loader context id is required');
  }

  url = getFilePathFromUrl(url);
  previous = getFilePathFromUrl(previous);

  let paths = [pathUtils.dirname(previous)];
  if (includePaths) {
    paths.push(...includePaths);
  }

  if (env.SASS_PATH) {
    paths.push(...env.SASS_PATH.split(':'));
  }

  paths = getFilePathsFromUrls(paths);

  const potentialPaths = getPossibleSassPaths(paths, url);
  // eslint-disable-next-line no-unused-vars
  for (const potentialPath of potentialPaths) {
    if (resolutionCache[potentialPath]) {
      return resolutionCache[potentialPath];
    }

    resolutionCache[potentialPath] = resolvePotentialPath({
      fs,
      potentialPath,
      loaderContextId,
      childHandler,
    });

    // eslint-disable-next-line no-await-in-loop
    const resolvedPath = await resolutionCache[potentialPath];
    if (resolvedPath) {
      return resolvedPath;
    }
  }

  return null;
}
