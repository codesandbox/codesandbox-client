import * as pathUtils from '@codesandbox/common/lib/utils/path';

const POTENTIAL_EXTENSIONS = ['.scss', '.sass', '.css'];

// Re-implementation of sass.js's `getPathVariations`, dart-sass does not implement this and we have some extra logic on top
export function getPathVariations(filename: string) {
  const hasExtension = !!pathUtils.extname(filename);
  const extensions = hasExtension ? [''] : POTENTIAL_EXTENSIONS;
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
  const potentialPaths: Array<string> = [];

  if (filepath[0] === '~') {
    // eslint-disable-next-line no-param-reassign
    directories = ['/node_modules'];
    // eslint-disable-next-line no-param-reassign
    filepath = filepath.substr(1);
  }

  if (filepath[0] !== '.') {
    directories.push('/node_modules');
  }

  // eslint-disable-next-line no-unused-vars
  for (const directory of directories) {
    potentialPaths.push(pathUtils.join(directory, filepath));
  }

  return potentialPaths;
}

function resolveAsyncModule(
  path: string,
  { ignoredExtensions }: { ignoredExtensions?: Array<string> } = {}
) {
  return new Promise((r, reject) => {
    const sendId = Math.floor(Math.random() * 10000);

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

    self.postMessage({
      type: 'resolve-async-transpiled-module',
      path,
      id: sendId,
      options: { isAbsolute: true, ignoredExtensions },
    });
  });
}

function existsPromise(fs, file) {
  return new Promise(r => {
    fs.stat(file, async (err, stats) => {
      if (err || stats.isDirectory()) {
        if (stats && stats.isDirectory()) {
          r(false);
          return;
        }

        // We try to download it
        try {
          const resolvedModule = await resolveAsyncModule(file, {
            ignoredExtensions: POTENTIAL_EXTENSIONS,
          });

          const ext = pathUtils.extname(resolvedModule.path);
          if (POTENTIAL_EXTENSIONS.indexOf(ext) === -1) {
            r(false);
            return;
          }

          r(resolvedModule.path);
        } catch (e) {
          r(false);
        }
      } else {
        r(file);
      }
    });
  });
}

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

const resolutionCache: { [k: string]: string } = {};
async function resolvePotentialPath(fs: any, p: string) {
  if (resolutionCache[p]) {
    return resolutionCache[p];
  }

  try {
    const pathDirName = pathUtils.dirname(p);
    const pathVariations = getPathVariations(
      pathUtils.basename(p)
    ).map(variation => pathUtils.join(pathDirName, variation));
    const foundFilePath = await firstTrue(
      pathVariations.map(path => existsPromise(fs, path))
    );
    if (foundFilePath) {
      resolutionCache[p] = foundFilePath;
    }
    return foundFilePath;
  } catch (err) {
    return null;
  }
}

interface ISassResolverOptions {
  previousFilePath: string;
  importUrl: string;
  includePaths?: Array<string>;
  env?: any;
  fs: any;
}

// This is a reimplementation of the Sass resolution algorithm that utilizes the codesandbox filesystem.
export async function resolveSassUrl(opts: ISassResolverOptions) {
  const { importUrl, previousFilePath, includePaths = [], env = {}, fs } = opts;

  const url = importUrl.replace(/^file:\/\//, '');

  /*
    Imports are resolved by trying, in order:
      * Loading a file relative to the file in which the `@import` appeared.
      * Each custom importer.
      * Loading a file relative to the current working directory.
    We don't support these yet:
      * Each load path in `includePaths`
      * Each load path specified in the `SASS_PATH` environment variable, which should be semicolon-separated on Windows and colon-separated elsewhere.
    See: https://sass-lang.com/documentation/js-api#importer
    See also: https://github.com/sass/dart-sass/blob/006e6aa62f2417b5267ad5cdb5ba050226fab511/lib/src/importer/node/implementation.dart
    */

  const paths = [pathUtils.dirname(previousFilePath.replace(/^file:\/\//, ''))];
  if (includePaths) {
    paths.push(...includePaths);
  }

  if (env.SASS_PATH) {
    paths.push(
      ...env.SASS_PATH.split(process.platform === 'win32' ? ';' : ':')
    );
  }

  const potentialPaths = getPossibleSassPaths(paths, url);
  // eslint-disable-next-line no-unused-vars
  for (const potentialPath of potentialPaths) {
    // eslint-disable-next-line no-await-in-loop
    const resolvedPath = await resolvePotentialPath(fs, potentialPath);
    if (resolvedPath) {
      return resolvedPath;
    }
  }

  return null;
}
