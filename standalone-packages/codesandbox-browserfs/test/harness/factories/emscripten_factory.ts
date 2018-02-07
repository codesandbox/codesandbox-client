import {FileSystem} from '../../../src/core/file_system';
import {getFileSystem} from '../../../src/core/browserfs';

function emptyDir(FS: any, dir: string): void {
  const files = FS.readdir(dir).filter((file: string) => file !== '.' && file !== '..').map((file: string) => `${dir}/${file}`);
  files.forEach((file: string) => {
    const mode = FS.stat(file).mode;
    if (FS.isFile(mode)) {
      FS.unlink(file);
    } else {
      emptyDir(FS, file);
      FS.rmdir(file);
    }
  });
}

function createEmscriptenFS(idbfs: boolean, cb: (obj: FileSystem) => void): void {
  const emscriptenNop: (Module: any) => void = require('../../tests/emscripten/nop.js');
  const Module = {
    // Block standard input.
    print: function(text: string) {},
    printErr: function(text: string) {},
    stdin: function(): any {
      return null;
    },
    preRun: function() {
      const FS = Module.FS;
      const IDBFS = Module.IDBFS;
      function createFS() {
        getFileSystem({
          fs: "FolderAdapter",
          options: {
            folder: '/files',
            wrapped: {
              fs: "Emscripten",
              options: {
                FS: Module.FS
              }
            }
          }
        }, (e, fs) => {
          cb(fs);
        });
      }
      FS.mkdir('/files');
      if (idbfs) {
        FS.mount(IDBFS, {}, '/files');
        FS.syncfs(true, function (err: any) {
          emptyDir(FS, '/files');
          FS.syncfs(false, function(err: any) {
            createFS();
          });
        });
      } else {
        createFS();
      }
    },
    locateFile: function(fname: string): string {
      return `/test/tests/emscripten/${fname}`;
    },
    // Keep FS active after NOP finishes running.
    noExitRuntime: true,
    ENVIRONMENT: "WEB",
    FS: <any> undefined,
    PATH: <any> undefined,
    ERRNO_CODES: <any> undefined,
    IDBFS: <any> undefined
  };
  emscriptenNop(Module);
}

export default function EmscriptenFactory(cb: (name: string, obj: FileSystem[]) => void): void {
  if (typeof(Uint8Array) !== 'undefined') {
    createEmscriptenFS(false, (inmemory) => {
      createEmscriptenFS(true, (idbfs) => {
        cb('Emscripten', [inmemory, idbfs]);
      });
    });
  } else {
    cb('Emscripten', []);
  }
}
