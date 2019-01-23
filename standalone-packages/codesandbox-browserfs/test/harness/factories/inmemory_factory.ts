import InMemoryFileSystem from '../../../src/backend/InMemory';
import {FileSystem} from '../../../src/core/file_system';

function InMemoryFSFactory(cb: (name: string, objs: FileSystem[]) => void): void {
  if (InMemoryFileSystem.isAvailable()) {
    InMemoryFileSystem.Create({}, (e, imfs?) => {
      cb('InMemory', [imfs]);
    });
  } else {
    cb('InMemory', []);
  }
}
export default InMemoryFSFactory;
