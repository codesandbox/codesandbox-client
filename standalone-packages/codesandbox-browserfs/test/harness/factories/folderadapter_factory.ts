import {FileSystem} from '../../../src/core/file_system';
import {getFileSystem} from '../../../src/core/browserfs';

export default function FolderAdapterFactory(cb: (name: string, obj: FileSystem[]) => void): void {
  getFileSystem({
    fs: "FolderAdapter",
    options: {
      folder: "/home",
      wrapped: { fs: "InMemory" }
    }
  }, (err, fa) => {
    if (!err) {
      cb('FolderAdapter', [fa]);
    } else {
      cb('FolderAdapter', []);
    }
  });
}
