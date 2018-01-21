import LocalStorageFileSystem from '../../../src/backend/LocalStorage';
import {FileSystem} from '../../../src/core/file_system';

export default function LSFSFactory(cb: (name: string, objs: FileSystem[]) => void) {
  if (LocalStorageFileSystem.isAvailable()) {
    LocalStorageFileSystem.Create({}, (e, lsfs?) => {
      lsfs.empty();
      cb('localStorage', [lsfs]);
    });
  } else {
    cb('localStorage', []);
  }
}
