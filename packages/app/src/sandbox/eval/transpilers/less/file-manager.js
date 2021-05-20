import path from 'path';

const PKG_IMPORT_RE = /^~?([@A-Za-z].*)/;

/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
export default function (loaderContext, files) {
  return {
    install(less, pluginManager) {
      function CSBFileManager() {}

      CSBFileManager.prototype = new less.FileManager();
      CSBFileManager.prototype.constructor = CSBFileManager;
      CSBFileManager.prototype.supports = function (filename) {
        return true;
      };

      CSBFileManager.prototype.loadFile = async function (
        importName,
        dirname,
        ...args
      ) {
        // eslint-disable-next-line no-param-reassign
        importName = importName.replace('file://', '');
        // eslint-disable-next-line no-param-reassign
        dirname = dirname || '/';

        let filepath = importName;
        if (importName[0] !== '/') {
          filepath = path.join(dirname, importName);
        }

        const file = files[filepath];
        if (!file) {
          const matches = PKG_IMPORT_RE.match(importName[0]);
          if (matches && matches[1]) {
            return this.loadFile(
              `/node_modules/${matches[1]}`,
              dirname,
              ...args
            );
          }

          throw new Error(`${filepath} not found`);
        }

        loaderContext.addDependency(filepath);

        return {
          contents: file,
          filename: filepath,
        };
      };

      pluginManager.addFileManager(new CSBFileManager());
    },
  };
}
