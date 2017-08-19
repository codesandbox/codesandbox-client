import { buildWorkerError } from '../utils/worker-error-handler';

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

Sass.options({
  sourceMapEmbed: true,
});

self.addEventListener('message', event => {
  const { files, path } = event.data;

  Sass.writeFile(files, () => {
    try {
      const code = Sass.compileFile(path);
      self.postMessage({
        type: 'compiled',
        transpiledCode: code,
      });
    } catch (e) {
      self.postMessage({
        type: 'error',
        error: buildWorkerError(e),
      });
    }
  });
});
