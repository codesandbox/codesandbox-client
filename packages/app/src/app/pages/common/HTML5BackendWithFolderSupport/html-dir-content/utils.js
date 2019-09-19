const OPTS_SYM = 'opts_init'; // not using Symbol to avoid polyfill
const BAIL_LEVEL = 1000;
const arrayConcat = Array.prototype.concat;

const initOptions = options =>
  options[OPTS_SYM] === true
    ? options
    : {
        [OPTS_SYM]: true,
        recursive: options === true || !!options.recursive,
        bail: options.bail && options.bail > 0 ? options.bail : BAIL_LEVEL,
      };

const getFileFromFileEntry = entry =>
  new Promise((resolve, reject) => {
    if (entry.file) {
      entry.file(resolve, reject);
    } else {
      resolve(null);
    }
  }).catch(
    () => null // swallow errors
  );

const isItemFileEntry = item => item.kind === 'file';

const getAsEntry = item => {
  if (item.getAsEntry) {
    return item.getAsEntry();
  }
  if (item.webkitGetAsEntry) {
    return item.webkitGetAsEntry();
  }
  return null;
};

const getListAsArray = (
  list // returns a flat array
) => arrayConcat.apply([], list);

export {
  initOptions,
  getFileFromFileEntry,
  isItemFileEntry,
  getAsEntry,
  getListAsArray,
};
