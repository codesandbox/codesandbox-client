import memoize from 'lodash/memoize';

import getTemplateDefinition from '../templates';
import parse from '../templates/configuration/parse';
import { Directory, Module, Sandbox } from '../types';

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

export function resolveDirectory(
  _path: string | undefined,
  modules: Array<Module>,
  directories: Array<Directory>,
  _startdirectoryShortid: string | undefined = undefined
) {
  if (!_path) {
    return throwError('');
  }

  let path = _path;
  let startdirectoryShortid = _startdirectoryShortid;
  // If paths start with {{sandboxRoot}} we see them as root paths
  if (path.startsWith('{{sandboxRoot}}')) {
    startdirectoryShortid = undefined;
    path = _path.replace('{{sandboxRoot}}/', './');
  }

  // Split path
  const splitPath = path.replace(/^.\//, '').split('/').filter(Boolean);

  const foundDirectoryShortid = splitPath.reduce(
    (dirId: string | undefined, pathPart: string, i: number) => {
      // Meaning this is the last argument, so the directory
      if (i === splitPath.length) {
        return dirId;
      }

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

  return directories.find(d => d.shortid === foundDirectoryShortid);
}

export function getModulesAndDirectoriesInDirectory(
  directory: Directory,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const { path } = directory;
  const parentPath = `${path}/`;
  return {
    removedModules: modules.filter(moduleItem =>
      moduleItem.path.startsWith(parentPath)
    ),
    removedDirectories: directories.filter(
      directoryItem =>
        directoryItem.path.startsWith(parentPath) && directoryItem !== directory
    ),
  };
}

export function getModulesInDirectory(
  _path: string | undefined,
  modules: Array<Module>,
  directories: Array<Directory>,
  _startdirectoryShortid: string | undefined = undefined
) {
  if (!_path) return throwError('');

  let path = _path;
  // If paths start with {{sandboxRoot}} we see them as root paths
  if (path.startsWith('{{sandboxRoot}}')) {
    path = _path.replace('{{sandboxRoot}}/', './');
  }

  // Split path
  const splitPath = path.replace(/^.\//, '').split('/').filter(Boolean);

  const dirPath = path.replace(/^.\//, '').split('/').filter(Boolean);
  dirPath.pop();

  const dir = resolveDirectory(
    dirPath.join('/') || '/',
    modules,
    directories,
    _startdirectoryShortid
  );
  const foundDirectoryShortid = dir ? dir.shortid : null;

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
  path: string | undefined,
  modules: Array<Module>,
  directories: Array<Directory>,
  startdirectoryShortid: string | undefined = undefined,
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

function findByShortid(
  entities: Array<Module | Directory>,
  shortid: string | undefined
) {
  return entities.find(e => e.shortid === shortid);
}

const getPath = (
  arrayToLookIn: Array<Module> | Array<Directory>,
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string
) => {
  const module = findById(arrayToLookIn, id);

  if (!module) return '';

  let directory = findByShortid(directories, module.directoryShortid);
  let path = '/';

  if (directory == null && module.directoryShortid) {
    // Parent got deleted, return '';

    return '';
  }

  while (directory != null) {
    path = `/${directory.title}${path}`;
    const lastDirectoryShortid = directory.directoryShortid;
    directory = findByShortid(directories, directory.directoryShortid);

    // In this case it couldn't find the parent directory of this dir, so probably
    // deleted. we just return '' in that case
    if (!directory && lastDirectoryShortid) {
      return '';
    }
  }
  return `${path}${module.title}`;
};

const memoizeFunction = (modules, directories, id) =>
  id +
  modules.map(m => m.id + m.title + m.directoryShortid).join(',') +
  directories.map(d => d.id + d.title + d.directoryShortid).join(',');

export const getModulePath = (
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string
) => getPath(modules, modules, directories, id);

export const getDirectoryPath = (
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string
) => getPath(directories, modules, directories, id);

export const getChildren = memoize(
  (
    modules: Array<Module> = [],
    directories: Array<Directory> = [],
    id: string
  ) => [
    ...directories.filter(d => d.directoryShortid === id),
    ...modules.filter(m => m.directoryShortid === id),
  ],
  memoizeFunction
);

export const isMainModule = (
  module: Module,
  modules: Module[],
  directories: Directory[],
  entry: string = 'index.js'
) => {
  const path = getModulePath(modules, directories, module.id);

  return path.replace('/', '') === entry;
};

export const findMainModule = (sandbox?: Sandbox) => {
  const resolve = resolveModuleWrapped(sandbox);

  // first attempt: try loading the first file that exists from
  // the list of possible defaults in the template defination
  const templateDefinition = getTemplateDefinition(sandbox.template);

  const parsedConfigs = parse(
    sandbox.template,
    templateDefinition.configurationFiles,
    resolve,
    sandbox
  );

  const defaultOpenedFiles = templateDefinition.getDefaultOpenedFiles(
    parsedConfigs
  );

  const defaultOpenModule = defaultOpenedFiles
    .map(path => resolve(path))
    .find(module => Boolean(module));

  if (defaultOpenModule) {
    return defaultOpenModule;
  }

  // second attempt: try loading the entry file if it exists
  const entryModule = resolve(sandbox.entry);
  if (entryModule) {
    return entryModule;
  }

  // third attempt: give up and load the first file in the list
  return sandbox.modules[0];
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

export const resolveModuleWrapped = sandbox => (path: string) => {
  try {
    return resolveModule(path, sandbox.modules, sandbox.directories);
  } catch (e) {
    return undefined;
  }
};

export const resolveDirectoryWrapped = sandbox => (path: string) => {
  try {
    return resolveDirectory(path, sandbox.modules, sandbox.directories);
  } catch (e) {
    return undefined;
  }
};

const inDirectoryMemoize = (directories, sourceShortid, destinationShortid) =>
  sourceShortid +
  destinationShortid +
  directories.map(d => d.id + d.title + d.directoryShortid).join(',');

export const inDirectory = memoize(
  (directories: Directory[], rootShortid: string, shortid: string) => {
    let directory = findByShortid(directories, shortid);

    while (directory) {
      if (directory.directoryShortid === rootShortid) {
        return true;
      }

      directory = findByShortid(directories, directory.directoryShortid);
    }

    return false;
  },
  inDirectoryMemoize
);
