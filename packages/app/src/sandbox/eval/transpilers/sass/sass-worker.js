self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.6/sass.sync.min.js',
]);

self.postMessage('ready');

declare var Sass: {
  options: Object => void,
  writeFile: ({ [fileName: string]: string }, callback: Function) => void,
  compileFile: (path: string) => string,
  registerPlugin: (name: string, plugin: Function) => void,
};

self.addEventListener('message', event => {
  const { files, path } = event.data;

  // register a custom importer callback
  Sass.importer((request, done) => {
    // We use this to mark dependencies of this file
    if (request.path) {
      self.postMessage({
        type: 'add-transpilation-dependency',
        path: request.path.replace('/sass/', './'),
        isAbsolute: true,
      });
    }
    done();
  });

  Sass.clearFiles(() => {
    Sass.options(
      { sourceMapEmbed: true, indentedSyntax: path.endsWith('.sass') },
      () => {
        Sass.writeFile(files, () => {
          Sass.compileFile(path, result => {
            if (result.status === 0) {
              self.postMessage({
                type: 'compiled',
                transpiledCode: result.text,
              });
            } else {
              self.postMessage({
                type: 'error',
                error: {
                  name: 'CompileError',
                  message: result.formatted,
                  fileName: result.file && result.file.replace('/sass/', ''),
                },
              });
            }
          });
        });
      }
    );
  });
});
