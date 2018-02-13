//import OverlayFS from '../../../src/backend/OverlayFS';
import {FileSystem} from '../../../src/core/file_system';
//import InMemoryFileSystem from '../../../src/backend/InMemory';
import ZipFactory from './zipfs_factory';
import {getFileSystem} from '../../../src/core/browserfs';

export default function OverlayFactory(cb: (name: string, objs: FileSystem[]) => void) {
  ZipFactory((name: string, obj: FileSystem[]) => {
    getFileSystem({
      fs: "OverlayFS",
      options: {
        readable: obj[0],
        writable: {
          fs: "InMemory",
          options: {}
        }
      }
    }, (e, fs?) => {
      if (e) {
        throw e;
      }
      cb('OverlayFS', [fs]);
    });
  });
}
