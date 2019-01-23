import {FileSystem} from '../../../src/core/file_system';
import IDBFSFactory from './idbfs_factory';
import {getFileSystem} from '../../../src/core/browserfs';

export default function AsyncMirrorFactory(cb: (name: string, objs: FileSystem[]) => void) {
  IDBFSFactory((name: string, obj: FileSystem[]) => {
	 if (obj.length > 0) {
     getFileSystem({
       fs: "AsyncMirror",
       options: {
         sync: { fs: "InMemory" },
         async: obj[0]
       }
     }, (e, amfs?) => {
       if (e) {
         throw e;
       } else {
         cb('AsyncMirror', [amfs]);
       }
     });
	 } else {
     cb("AsyncMirror", []);
	 }
  });
}
