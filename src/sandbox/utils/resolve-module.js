// @flow
import type { Module } from '../../app/store/entities/modules/';
import type { Directory } from '../../app/store/entities/directories/';

const compareTitle = (original: string, test: string) => {
  if (original === test) return true;
  if (original === `${test}.js`) return true;

  return false;
};

/**
 * Convert the module path to a module
 */
export default (
  path: string,
  modules: Array<Module>,
  directories: Array<Directory>,
  startDirectoryId: ?string = undefined,
) => {
  // Split path
  const splitPath = path.replace(/^.\//, '').split('/');
  const foundDirectoryId = splitPath.reduce((dirId: ?string, pathPart: string, i: number) => {
    // Meaning this is the last argument, so the file
    if (i === splitPath.length - 1) return dirId;

    if (pathPart === '..') {
      // Find the parent
      const dir = directories.find(d => d.id === dirId);
      if (dir == null) throw new Error(`Cannot find module in ${path}`);

      return dir.directoryId;
    }

    // For == check on null
    // eslint-disable-next-line eqeqeq
    const directoriesInDirectory = directories.filter(m => m.directoryId == dirId);
    const nextDirectory = directoriesInDirectory.find(d => compareTitle(d.title, pathPart));

    if (nextDirectory == null) throw new Error(`Cannot find module in ${path}`);

    return nextDirectory.id;
  }, startDirectoryId);


  const lastPath = splitPath[splitPath.length - 1];
  // eslint-disable-next-line eqeqeq
  const modulesInFoundDirectory = modules.filter(m => m.directoryId == foundDirectoryId);

  // Find module with same name
  const foundModule = modulesInFoundDirectory.find(m => compareTitle(m.title, lastPath));
  if (foundModule) return foundModule;

  // eslint-disable-next-line eqeqeq
  const directoriesInFoundDirectory = directories.filter(m => m.directoryId == foundDirectoryId);
  const foundDirectory = directoriesInFoundDirectory.find(m => compareTitle(m.title, lastPath));

  if (foundDirectory) {
    // eslint-disable-next-line eqeqeq
    const indexModule = modules.find(m => m.directoryId == foundDirectory.id && compareTitle(m.title, 'index'));
    if (indexModule == null) throw new Error(`Cannot find module in ${path}`);
    return indexModule;
  }

  if (splitPath[splitPath.length - 1] === '') {
    // Last resort, check if there is something in the same folder called index
    const indexModule = modulesInFoundDirectory.find(m => compareTitle(m.title, 'index'));
    if (indexModule) return indexModule;
  }
  throw new Error(`Cannot find module in ${path}`);
};
