// @flow
import type { Module, Directory } from 'common/types';

const compareTitle = (
  original: string,
  test: string,
  ignoredExtensions: Array<string>
) => {
  if (original === test) return true;

  return ignoredExtensions.some(ext => original === `${test}.${ext}`);
};

const throwError = (path: string) => {
  throw new Error(`Cannot find module in ${path}`);
};

export function getModulesInDirectory(
  _path: ?string,
  modules: Array<Module>,
  directories: Array<Directory>,
  _startdirectoryShortid: ?string = undefined
) {
  if (!_path) return throwError('');

  let path = _path;
  let startdirectoryShortid = _startdirectoryShortid;
  // If paths start with {{sandboxRoot}} we see them as root paths
  if (path.startsWith('{{sandboxRoot}}')) {
    startdirectoryShortid = undefined;
    path = _path.replace('{{sandboxRoot}}/', './');
  }

  // Split path
  const splitPath = path
    .replace(/^.\//, '')
    .split('/')
    .filter(part => Boolean(part));
  const foundDirectoryShortid = splitPath.reduce(
    (dirId: ?string, pathPart: string, i: number) => {
      // Meaning this is the last argument, so the file
      if (i === splitPath.length - 1) return dirId;

      if (pathPart === '..') {
        // Find the parent
        const dir = directories.find(d => d.shortid === dirId);
        if (dir == null) throwError(path);

        return dir.directoryShortid;
      }

      const directoriesInDirectory = directories.filter(
        // eslint-disable-next-line eqeqeq
        m => m.directoryShortid == dirId
      );
      const nextDirectory = directoriesInDirectory.find(d =>
        compareTitle(d.title, pathPart, [])
      );

      if (nextDirectory == null) throwError(path);

      return nextDirectory.shortid;
    },
    startdirectoryShortid
  );

  const lastPath = splitPath[splitPath.length - 1];
  const modulesInFoundDirectory = modules.filter(
    // eslint-disable-next-line eqeqeq
    m => m.directoryShortid == foundDirectoryShortid
  );

  return {
    modules: modulesInFoundDirectory,
    foundDirectoryShortid,
    lastPath,
    splitPath,
  };
}

/**
 * Convert the module path to a module
 */
export const resolveModule = (
  path: ?string,
  modules: Array<Module>,
  directories: Array<Directory>,
  startdirectoryShortid: ?string = undefined,
  ignoredExtensions: Array<string> = ['js', 'jsx', 'json']
): Module => {
  const {
    modules: modulesInFoundDirectory,
    lastPath,
    splitPath,
    foundDirectoryShortid,
  } = getModulesInDirectory(path, modules, directories, startdirectoryShortid);

  // Find module with same name
  const foundModule = modulesInFoundDirectory.find(m =>
    compareTitle(m.title, lastPath, ignoredExtensions)
  );
  if (foundModule) return foundModule;

  // Check all directories in said directory for same name
  const directoriesInFoundDirectory = directories.filter(
    // eslint-disable-next-line eqeqeq
    m => m.directoryShortid == foundDirectoryShortid
  );
  const foundDirectory = directoriesInFoundDirectory.find(m =>
    compareTitle(m.title, lastPath, ignoredExtensions)
  );

  // If it refers to a directory
  if (foundDirectory) {
    // Find module named index
    const indexModule = modules.find(
      m =>
        // eslint-disable-next-line eqeqeq
        m.directoryShortid == foundDirectory.shortid &&
        compareTitle(m.title, 'index', ignoredExtensions)
    );
    if (indexModule == null) throwError(path);
    return indexModule;
  }

  if (splitPath[splitPath.length - 1] === '') {
    // Last resort, check if there is something in the same folder called index
    const indexModule = modulesInFoundDirectory.find(m =>
      compareTitle(m.title, 'index', ignoredExtensions)
    );
    if (indexModule) return indexModule;
  }

  return throwError(path);
};

function findById(entities: Array<Module | Directory>, id: string) {
  return entities.find(e => e.id === id);
}

function findByShortid(entities: Array<Module | Directory>, shortid: ?string) {
  return entities.find(e => e.shortid === shortid);
}

export const getModulePath = (
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string
) => {
  const module = findById(modules, id);

  if (!module) return '';

  let directory = findByShortid(directories, module.directoryShortid);
  let path = '/';
  while (directory != null) {
    path = `/${directory.title}${path}`;
    directory = findByShortid(directories, directory.directoryShortid);

    if (!directory && directory.directoryShortid) {
      return '';
    }
  }
  return `${path}${module.title}`;
};

export const isMainModule = (
  module: Module,
  modules: Module[],
  directories: Directory[],
  entry: string = 'index.js'
) => {
  const path = getModulePath(modules, directories, module.id);

  return path.replace('/', '') === entry;
};

export const findMainModule = (
  modules: Module[],
  directories: Directory[],
  entry: string = 'index.js'
) => {
  try {
    const module = resolveModule(entry, modules, directories);

    return module;
  } catch (e) {
    return modules[0];
  }
};

export const findCurrentModule = (
  modules: Module[],
  directories: Directory[],
  modulePath: string = '',
  mainModule: Module
): Module => {
  // cleanPath, encode and replace first /
  const cleanPath = decodeURIComponent(modulePath).replace('/', '');
  let foundModule = null;
  try {
    foundModule = resolveModule(cleanPath, modules, directories);
  } catch (e) {
    /* leave empty */
  }

  return (
    foundModule ||
    modules.find(m => m.id === modulePath) ||
    modules.find(m => m.shortid === modulePath) || // deep-links requires this
    mainModule
  );
};
