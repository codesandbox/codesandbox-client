import { FileSystemConstructor, BFSCallback, FileSystem } from './file_system';
import { ApiError } from './api_error';
import { checkOptions } from './util';
import AsyncMirror from '../backend/AsyncMirror';
// import Dropbox from '../backend/Dropbox';
// import Emscripten from '../backend/Emscripten';
// import FolderAdapter from '../backend/FolderAdapter';
// import HTML5FS from '../backend/HTML5FS';
import InMemory from '../backend/InMemory';
import IndexedDB from '../backend/IndexedDB';
// import LocalStorage from '../backend/LocalStorage';
import MountableFileSystem from '../backend/MountableFileSystem';
// import OverlayFS from '../backend/OverlayFS';
import WorkerFS from '../backend/WorkerFS';
// import HTTPRequest from '../backend/HTTPRequest';
import ZipFS from '../backend/ZipFS';
// import IsoFS from '../backend/IsoFS';
import CodeSandboxFS from '../backend/CodeSandboxFS';

// Monkey-patch `Create` functions to check options before file system initialization.
[
  AsyncMirror,
  // Dropbox,
  // Emscripten,
  // FolderAdapter,
  // HTML5FS,
  InMemory,
  IndexedDB,
  // IsoFS,
  // LocalStorage,
  MountableFileSystem,
  // OverlayFS,
  WorkerFS,
  // HTTPRequest,
  ZipFS,
  CodeSandboxFS,
].forEach((fsType: FileSystemConstructor) => {
  const create = fsType.Create;
  fsType.Create = function(opts?: any, cb?: BFSCallback<FileSystem>): void {
    const oneArg = typeof opts === 'function';
    const normalizedCb = oneArg ? opts : cb;
    const normalizedOpts = oneArg ? {} : opts;

    function wrappedCb(e?: ApiError): void {
      if (e) {
        normalizedCb(e);
      } else {
        create.call(fsType, normalizedOpts, normalizedCb);
      }
    }

    checkOptions(fsType, normalizedOpts, wrappedCb);
  };
});

/**
 * @hidden
 */
const Backends = {
  AsyncMirror,
  // Dropbox,
  // Emscripten,
  // FolderAdapter,
  // HTML5FS,
  InMemory,
  IndexedDB,
  // IsoFS,
  // LocalStorage,
  MountableFileSystem,
  // OverlayFS,
  WorkerFS,
  // HTTPRequest,
  // XmlHttpRequest: HTTPRequest,
  ZipFS,
  CodeSandboxFS,
};
// Make sure all backends cast to FileSystemConstructor (for type checking)
const _: { [name: string]: FileSystemConstructor } = Backends;
// tslint:disable-next-line:no-unused-expression
_;
// tslint:enable-next-line:no-unused-expression
export default Backends;
