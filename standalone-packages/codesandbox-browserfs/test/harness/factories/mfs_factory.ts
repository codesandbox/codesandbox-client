import MountableFileSystem from '../../../src/backend/MountableFileSystem';
import {FileSystem} from '../../../src/core/file_system';
import {getFileSystem} from '../../../src/core/browserfs';

export default function MFSFactory(cb: (name: string, objs: FileSystem[]) => void) {
  if (MountableFileSystem.isAvailable()) {
    getFileSystem({
      fs: "MountableFileSystem",
      options: {
        '/test': { fs: 'InMemory' },
        '/tmp': { fs: "InMemory" }
      }
    }, (e, fs?) => {
      if (e) {
        throw e;
      }
      cb('MountableFileSystem', [fs]);
    });
  } else {
    cb('MountableFileSystem', []);
  }
}
