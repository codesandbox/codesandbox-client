export default function(loaderContext, files) {
  return {
    install: function(less, pluginManager) {
      function CSBFileManager() {}

      CSBFileManager.prototype = new less.FileManager();
      CSBFileManager.prototype.constructor = CSBFileManager;
      CSBFileManager.prototype.supports = function(filename) {
        return true;
      };

      CSBFileManager.prototype.resolve = function(filename) {
        return new Promise((resolve, reject) => {
          try {
            loaderContext.addDependency(filename);

            const module = files[filename];
            resolve(module);
          } catch (e) {
            reject(e);
          }
        });
      };

      CSBFileManager.prototype.loadFile = function(filename) {
        return this.resolve(filename).then(code => ({
          contents: code,
          filename,
        }));
      };

      pluginManager.addFileManager(new CSBFileManager());
    },
  };
}
