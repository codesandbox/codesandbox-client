import path from 'path';

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

      CSBFileManager.prototype.resolve = function (importName, ...args) {
        console.log({ args, files, importName });
        return new Promise((resolve, reject) => {
          try {
            // let dirname = loaderContext.
            // let fullFilePath = importName;
            // if (importName[0] !== '/') {
            //     resolve(path.join())
            // }

            const file = files[importName];
            if (!file) {
              throw new Error(`${importName} not found`);
            }

            loaderContext.addDependency(importName);
            resolve(file);
          } catch (e) {
            reject(e);
          }
        });
      };

      CSBFileManager.prototype.loadFile = function (filename, ...args) {
        console.log(args);
        return this.resolve(...args).then(code => ({
          contents: code,
          filename,
        }));
      };

      pluginManager.addFileManager(new CSBFileManager());
    },
  };
}
