// @flow
import type { Module, Directory } from 'common/types';

const compareTitle = (
  original: string,
  test: string,
  ignoredExtensions: Array<string>,
) => {
  if (original === test) return true;

  return ignoredExtensions.some(ext => original === `${test}.${ext}`);
};

const throwError = (path: string) => {
  throw new Error(`Cannot find module in ${path}`);
};

/**
 * Convert the module path to a module
 */
export default (
  path: ?string,
  modules: Array<Module>,
  directories: Array<Directory>,
  startdirectoryShortid: ?string = undefined,
  ignoredExtensions: Array<string> = ['js', 'jsx', 'json'],
): Module => {
  if (!path) return null;
  // Split path
  const splitPath = path.replace(/^.\//, '').split('/');
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
        m => m.directoryShortid == dirId,
      );
      const nextDirectory = directoriesInDirectory.find(d =>
        compareTitle(d.title, pathPart, ignoredExtensions),
      );

      if (nextDirectory == null) throwError(path);

      return nextDirectory.shortid;
    },
    startdirectoryShortid,
  );

  const lastPath = splitPath[splitPath.length - 1];
  const modulesInFoundDirectory = modules.filter(
    // eslint-disable-next-line eqeqeq
    m => m.directoryShortid == foundDirectoryShortid,
  );

  // Find module with same name
  const foundModule = modulesInFoundDirectory.find(m =>
    compareTitle(m.title, lastPath, ignoredExtensions),
  );
  if (foundModule) return foundModule;

  // Check all directories in said directory for same name
  const directoriesInFoundDirectory = directories.filter(
    // eslint-disable-next-line eqeqeq
    m => m.directoryShortid == foundDirectoryShortid,
  );
  const foundDirectory = directoriesInFoundDirectory.find(m =>
    compareTitle(m.title, lastPath, ignoredExtensions),
  );

  // If it refers to a directory
  if (foundDirectory) {
    // Find module named index
    const indexModule = modules.find(
      m =>
        // eslint-disable-next-line eqeqeq
        m.directoryShortid == foundDirectory.shortid &&
        compareTitle(m.title, 'index', ignoredExtensions),
    );
    if (indexModule == null) throwError(path);
    return indexModule;
  }

  if (splitPath[splitPath.length - 1] === '') {
    // Last resort, check if there is something in the same folder called index
    const indexModule = modulesInFoundDirectory.find(m =>
      compareTitle(m.title, 'index', ignoredExtensions),
    );
    if (indexModule) return indexModule;
  }

  throwError(path);
};
