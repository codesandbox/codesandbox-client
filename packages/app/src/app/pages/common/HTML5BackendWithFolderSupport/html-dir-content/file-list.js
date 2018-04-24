import { join } from 'path';
import { getFileFromFileEntry, getListAsArray } from './utils';

const getEntryData = (entry, options, level, path) => {
  let promise;

  if (entry.isDirectory) {
    promise = options.recursive
      ? getFileList(entry, options, level + 1, join(path, entry.name)) // eslint-disable-line
      : Promise.resolve([]);
  } else {
    promise = getFileFromFileEntry(entry).then(file => {
      if (file) {
        // eslint-disable-next-line no-param-reassign
        file.path = join(path, file.name);
      }
      return file ? [file] : [];
    });
  }

  return promise;
};

/**
 * returns a flat list of files for root dir item
 * if recursive is true will get all files from sub folders
 */
const getFileList = (root, options, level = 0, path = root.name) =>
  root && level < options.bail && root.isDirectory && root.createReader
    ? new Promise(resolve => {
        root.createReader().readEntries(
          entries =>
            Promise.all(
              entries.map(entry => getEntryData(entry, options, level, path))
            ).then(results => resolve(getListAsArray(results))), // flatten the results
          () => resolve([])
        ); // fail silently
      })
    : Promise.resolve([]);

export default getFileList;
