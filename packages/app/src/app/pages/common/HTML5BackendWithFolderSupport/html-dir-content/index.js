import getFileList from './file-list';
import {
  isItemFileEntry,
  getListAsArray,
  getAsEntry,
  initOptions,
} from './utils';

/**
 * returns a Promise<Array<File>> of File objects for the provided item if it represents a directory
 * will attempt to retrieve all of its children files (optionally recursively)
 * @param item: DataTransferItem
 * @param options (optional)
 *  {options.recursive} (default: false) - whether to recursively follow the dir structure
 *  {options.bail} (default: 1000) - how many levels to follow recursively before bailing
 */
const getFiles = (item, options = {}) =>
  getFileList(getAsEntry(item), initOptions(options));

const getDataTransferItemFiles = (item, options) =>
  getFiles(item, options).then(files => {
    if (!files.length) {
      // perhaps its a regular file
      const file = item.getAsFile();
      // eslint-disable-next-line
      files = file ? [file] : files;
    }

    return files;
  });

/**
 * returns a Promise<Array<File>> for the File objects found in the dataTransfer data of a drag&drop event
 * In case a directory is found, will attempt to retrieve all of its children files (optionally recursively)
 *
 * @param evt: DragEvent - containing dataTransfer
 * @param options (optional)
 *  {options.recursive} (default: false) - whether to recursively follow the dir structure
 *  {options.bail} (default: 1000) - how many levels to follow recursively before bailing
 */
const getFilesFromDragEvent = (evt, options = {}) => {
  // eslint-disable-next-line
  options = initOptions(options);

  return new Promise(resolve => {
    if (evt.dataTransfer.items) {
      Promise.all(
        getListAsArray(evt.dataTransfer.items)
          .filter(item => isItemFileEntry(item))
          .map(item => getDataTransferItemFiles(item, options))
      ).then(files => resolve(getListAsArray(files)));
    } else if (evt.dataTransfer.files) {
      resolve(getListAsArray(evt.dataTransfer.files)); // turn into regular array (instead of FileList)
    } else {
      resolve([]);
    }
  });
};

export { getFiles, getFilesFromDragEvent };
