import IndexedDBFileSystem from '../../../src/backend/IndexedDB';
import {FileSystem} from '../../../src/core/file_system';

export default function IDBFSFactory(cb: (name: string, obj: FileSystem[]) => void): void {
  if (IndexedDBFileSystem.isAvailable()) {
    IndexedDBFileSystem.Create({
      storeName: `test-${Math.random()}`
    }, (e, fs?) => {
      if (e) {
        throw e;
      }
      fs.empty((e?) => {
        if (e) {
          throw e;
        }
        cb('IndexedDB', [fs]);
      });
    });
  } else {
    cb('IndexedDB', []);
  }
}
