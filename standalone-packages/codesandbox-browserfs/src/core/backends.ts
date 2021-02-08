import AsyncMirror from '../backend/AsyncMirror';
import BundledHTTPRequest from '../backend/BundledHTTPRequest';
import CodeSandboxEditorFS from '../backend/CodeSandboxEditorFS';
// import IsoFS from '../backend/IsoFS';
import CodeSandboxFS from '../backend/CodeSandboxFS';
import DynamicHTTPRequest from '../backend/DynamicHTTPRequest';
// import Dropbox from '../backend/Dropbox';
// import Emscripten from '../backend/Emscripten';
import FolderAdapter from '../backend/FolderAdapter';
import HTTPRequest from '../backend/HTTPRequest';
import IndexedDB from '../backend/IndexedDB';
// import HTML5FS from '../backend/HTML5FS';
import InMemory from '../backend/InMemory';
import LocalStorage from '../backend/LocalStorage';
import MountableFileSystem from '../backend/MountableFileSystem';
import OverlayFS from '../backend/OverlayFS';
import UNPKGRequest from '../backend/UNPKGRequest';
import JSDelivrRequest from '../backend/JSDelivrRequest';
import WebsocketFS from '../backend/WebsocketFS';
import WorkerFS from '../backend/WorkerFS';
import ZipFS from '../backend/ZipFS';
import {ApiError} from './api_error';
import {BFSCallback, FileSystem, FileSystemConstructor} from './file_system';
import {checkOptions} from './util';

// Monkey-patch `Create` functions to check options before file system initialization.
[AsyncMirror, InMemory, IndexedDB, FolderAdapter, OverlayFS, LocalStorage, MountableFileSystem, WorkerFS, BundledHTTPRequest, HTTPRequest, UNPKGRequest, JSDelivrRequest, ZipFS, CodeSandboxFS, CodeSandboxEditorFS, WebsocketFS, DynamicHTTPRequest].forEach((fsType: FileSystemConstructor) => {
  const create = fsType.Create;
  fsType.Create = function(opts?: any, cb?: BFSCallback<FileSystem>): void {
    const oneArg = typeof(opts) === 'function';
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
const Backends = { AsyncMirror, FolderAdapter, InMemory, IndexedDB, OverlayFS, LocalStorage, MountableFileSystem, WorkerFS, BundledHTTPRequest, HTTPRequest, UNPKGRequest, JSDelivrRequest, XmlHttpRequest: HTTPRequest, ZipFS, CodeSandboxFS, CodeSandboxEditorFS, WebsocketFS, DynamicHTTPRequest};
// Make sure all backends cast to FileSystemConstructor (for type checking)
const _: {[name: string]: FileSystemConstructor} = Backends;
// tslint:disable-next-line:no-unused-expression
_; // eslint-disable-line no-unused-expressions

export default Backends;
