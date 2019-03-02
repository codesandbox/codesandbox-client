import {FileSystemConstructor, BFSCallback, FileSystem} from './file_system';
import {ApiError} from './api_error';
import {checkOptions} from './util';
import AsyncMirror from '../backend/AsyncMirror';
// import Dropbox from '../backend/Dropbox';
// import Emscripten from '../backend/Emscripten';
import FolderAdapter from '../backend/FolderAdapter';
// import HTML5FS from '../backend/HTML5FS';
import InMemory from '../backend/InMemory';
import IndexedDB from '../backend/IndexedDB';
import LocalStorage from '../backend/LocalStorage';
import MountableFileSystem from '../backend/MountableFileSystem';
// import OverlayFS from '../backend/OverlayFS';
import WorkerFS from '../backend/WorkerFS';
import HTTPRequest from '../backend/HTTPRequest';
import BundledHTTPRequest from '../backend/BundledHTTPRequest';
import ZipFS from '../backend/ZipFS';
// import IsoFS from '../backend/IsoFS';
import CodeSandboxFS from '../backend/CodeSandboxFS';
import CodeSandboxEditorFS from '../backend/CodeSandboxEditorFS';
import DynamicHTTPRequest from '../backend/DynamicHTTPRequest';

// Monkey-patch `Create` functions to check options before file system initialization.
[AsyncMirror, InMemory, IndexedDB, FolderAdapter, LocalStorage, MountableFileSystem, WorkerFS, BundledHTTPRequest, HTTPRequest, ZipFS, CodeSandboxFS, CodeSandboxEditorFS, DynamicHTTPRequest].forEach((fsType: FileSystemConstructor) => {
  const create = fsType.Create;
  fsType.Create = function(opts?: any, cb?: BFSCallback<FileSystem>): void {
    const oneArg = typeof(opts) === "function";
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
const Backends = { AsyncMirror, FolderAdapter, InMemory, IndexedDB, LocalStorage, MountableFileSystem, WorkerFS, BundledHTTPRequest, HTTPRequest, XmlHttpRequest: HTTPRequest, ZipFS, CodeSandboxFS, CodeSandboxEditorFS, DynamicHTTPRequest};
// Make sure all backends cast to FileSystemConstructor (for type checking)
const _: {[name: string]: FileSystemConstructor} = Backends;
// tslint:disable-next-line:no-unused-expression
_;
// tslint:enable-next-line:no-unused-expression
export default Backends;
