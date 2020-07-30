import {BaseFileSystem, FileSystem, BFSCallback, FileSystemOptions} from '../core/file_system';
import {ApiError, ErrorCode} from '../core/api_error';
import {FileFlag, ActionType} from '../core/file_flag';
import {copyingSlice} from '../core/util';
import {File} from '../core/file';
import Stats from '../core/node_fs_stats';
import {NoSyncFile} from '../generic/preload_file';
import {xhrIsAvailable, asyncDownloadFile, syncDownloadFile, getFileSizeAsync, getFileSizeSync} from '../generic/xhr';
import {fetchIsAvailable, fetchFileAsync, fetchFileSizeAsync} from '../generic/fetch';
import {FileIndex, isFileInode, isDirInode} from '../generic/file_index';

/**
 * Try to convert the given buffer into a string, and pass it to the callback.
 * Optimization that removes the needed try/catch into a helper function, as
 * this is an uncommon case.
 * @hidden
 */
function tryToString(buff: Buffer, encoding: string, cb: BFSCallback<string>) {
  try {
    cb(null, buff.toString(encoding));
  } catch (e) {
    cb(e);
  }
}

/**
 * Configuration options for a HTTPRequest file system.
 */
export interface JSDelivrRequestOptions {
  // Dependency
  dependency: string;
  // Version
  version: string;
  // Whether to prefer XmlHttpRequest or fetch for async operations if both are available.
  // Default: false
  preferXHR?: boolean;
}

interface AsyncDownloadFileMethod {
  (p: string, type: 'buffer', cb: BFSCallback<Buffer>): void;
  (p: string, type: 'json', cb: BFSCallback<any>): void;
  (p: string, type: string, cb: BFSCallback<any>): void;
}

interface SyncDownloadFileMethod {
  (p: string, type: 'buffer'): Buffer;
  (p: string, type: 'json'): any;
  (p: string, type: string): any;
}

function syncNotAvailableError(): never {
  throw new ApiError(ErrorCode.ENOTSUP, `Synchronous HTTP download methods are not available in this environment.`);
}

export type JSDelivrMeta = {
  files: JSDelivrMetaFile[]
};

export interface JSDelivrMetaFile {
  name: string;
  hash: string;
  time: string;
  size: number;
}

/**
 * A simple filesystem backed by HTTP downloads. You must create a directory listing using the
 * `make_http_index` tool provided by BrowserFS.
 *
 * If you install BrowserFS globally with `npm i -g browserfs`, you can generate a listing by
 * running `make_http_index` in your terminal in the directory you would like to index:
 *
 * ```
 * make_http_index > index.json
 * ```
 *
 * Listings objects look like the following:
 *
 * ```json
 * {
 *   "home": {
 *     "jvilk": {
 *       "someFile.txt": null,
 *       "someDir": {
 *         // Empty directory
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * *This example has the folder `/home/jvilk` with subfile `someFile.txt` and subfolder `someDir`.*
 */
export default class JSDelivrRequest extends BaseFileSystem implements FileSystem {
  public static readonly Name = "JSDelivrRequest";

  public static readonly Options: FileSystemOptions = {
    dependency: {
      type: "string",
      description: "Name of dependency"
    },
    version: {
      type: "string",
      description: "Version of dependency, has to be absolute"
    },
    preferXHR: {
      type: "boolean",
      optional: true,
      description: "Whether to prefer XmlHttpRequest or fetch for async operations if both are available. Default: false"
    }
  };

  /**
   * Construct an HTTPRequest file system backend with the given options.
   */
  public static Create(opts: JSDelivrRequestOptions, cb: BFSCallback<JSDelivrRequest>): void {
    const URL = `https://data.jsdelivr.com/v1/package/npm/${opts.dependency}@${opts.version}/flat`;

    asyncDownloadFile(URL, "json", (e, data: JSDelivrMeta) => {
      if (e) {
        cb(e);
      } else {
        cb(null, new JSDelivrRequest(data, opts.dependency, opts.version));
      }
    });

  }

  public static isAvailable(): boolean {
    return xhrIsAvailable || fetchIsAvailable;
  }

  public readonly prefixUrl: string;
  private _index: FileIndex<{}>;
  private _requestFileAsyncInternal: AsyncDownloadFileMethod;
  private _requestFileSizeAsyncInternal: (p: string, cb: BFSCallback<number>) => void;
  private _requestFileSyncInternal: SyncDownloadFileMethod;
  private _requestFileSizeSyncInternal: (p: string) => number;

  private constructor(meta: JSDelivrMeta, private dependency: string, private version: string, preferXHR: boolean = false) {
    super();
    this._index = FileIndex.fromJSDelivr(meta);

    if (fetchIsAvailable && (!preferXHR || !xhrIsAvailable)) {
      this._requestFileAsyncInternal = fetchFileAsync;
      this._requestFileSizeAsyncInternal = fetchFileSizeAsync;
    } else {
      this._requestFileAsyncInternal = asyncDownloadFile;
      this._requestFileSizeAsyncInternal = getFileSizeAsync;
    }

    if (xhrIsAvailable) {
      this._requestFileSyncInternal = syncDownloadFile;
      this._requestFileSizeSyncInternal = getFileSizeSync;
    } else {
      this._requestFileSyncInternal = syncNotAvailableError;
      this._requestFileSizeSyncInternal = syncNotAvailableError;
    }
  }

  public empty(): void {
    this._index.fileIterator(function(file: Stats) {
      file.fileData = null;
    });
  }

  public getName(): string {
    return JSDelivrRequest.Name;
  }

  public diskSpace(path: string, cb: (total: number, free: number) => void): void {
    // Read-only file system. We could calculate the total space, but that's not
    // important right now.
    cb(0, 0);
  }

  public isReadOnly(): boolean {
    return true;
  }

  public supportsLinks(): boolean {
    return false;
  }

  public supportsProps(): boolean {
    return false;
  }

  public supportsSynch(): boolean {
    // Synchronous operations are only available via the XHR interface for now.
    return xhrIsAvailable;
  }

  /**
   * Special HTTPFS function: Preload the given file into the index.
   * @param [String] path
   * @param [BrowserFS.Buffer] buffer
   */
  public preloadFile(path: string, buffer: Buffer): void {
    const inode = this._index.getInode(path);
    if (isFileInode<Stats>(inode)) {
      if (inode === null) {
        throw ApiError.ENOENT(path);
      }
      const stats = inode.getData();
      stats.size = buffer.length;
      stats.fileData = buffer;
    } else {
      throw ApiError.EISDIR(path);
    }
  }

  public stat(path: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    const inode = this._index.getInode(path);
    if (inode === null) {
      return cb(ApiError.ENOENT(path));
    }
    let stats: Stats;
    if (isFileInode<Stats>(inode)) {
      stats = inode.getData();
      // At this point, a non-opened file will still have default stats from the listing.
      if (stats.size < 0) {
        this._requestFileSizeAsync(path, function(e: ApiError, size?: number) {
          if (e) {
            return cb(e);
          }
          stats.size = size!;
          cb(null, Stats.clone(stats));
        });
      } else {
        cb(null, Stats.clone(stats));
      }
    } else if (isDirInode(inode)) {
      stats = inode.getStats();
      cb(null, stats);
    } else {
      cb(ApiError.FileError(ErrorCode.EINVAL, path));
    }
  }

  public statSync(path: string, isLstat: boolean): Stats {
    const inode = this._index.getInode(path);
    if (inode === null) {
      throw ApiError.ENOENT(path);
    }
    let stats: Stats;
    if (isFileInode<Stats>(inode)) {
      stats = inode.getData();
      // At this point, a non-opened file will still have default stats from the listing.
      if (stats.size < 0) {
        stats.size = this._requestFileSizeSync(path);
      }
    } else if (isDirInode(inode)) {
      stats = inode.getStats();
    } else {
      throw ApiError.FileError(ErrorCode.EINVAL, path);
    }
    return stats;
  }

  public open(path: string, flags: FileFlag, mode: number, cb: BFSCallback<File>): void {
    // INVARIANT: You can't write to files on this file system.
    if (flags.isWriteable()) {
      return cb(new ApiError(ErrorCode.EPERM, path));
    }
    const self = this;
    // Check if the path exists, and is a file.
    const inode = this._index.getInode(path);
    if (inode === null) {
      return cb(ApiError.ENOENT(path));
    }
    if (isFileInode<Stats>(inode)) {
      const stats = inode.getData();
      switch (flags.pathExistsAction()) {
        case ActionType.THROW_EXCEPTION:
        case ActionType.TRUNCATE_FILE:
          return cb(ApiError.EEXIST(path));
        case ActionType.NOP:
          // Use existing file contents.
          // XXX: Uh, this maintains the previously-used flag.
          if (stats.fileData) {
            return cb(null, new NoSyncFile(self, path, flags, Stats.clone(stats), stats.fileData));
          }
          // @todo be lazier about actually requesting the file
          this._requestFileAsync(path, 'buffer', function(err: ApiError, buffer?: Buffer) {
            if (err) {
              return cb(err);
            }
            // we don't initially have file sizes
            stats.size = buffer!.length;
            stats.fileData = buffer!;
            return cb(null, new NoSyncFile(self, path, flags, Stats.clone(stats), buffer));
          });
          break;
        default:
          return cb(new ApiError(ErrorCode.EINVAL, 'Invalid FileMode object.'));
      }
    } else {
      return cb(ApiError.EISDIR(path));
    }
  }

  public openSync(path: string, flags: FileFlag, mode: number): File {
    // INVARIANT: You can't write to files on this file system.
    if (flags.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, path);
    }
    // Check if the path exists, and is a file.
    const inode = this._index.getInode(path);
    if (inode === null) {
      throw ApiError.ENOENT(path);
    }
    if (isFileInode<Stats>(inode)) {
      const stats = inode.getData();
      switch (flags.pathExistsAction()) {
        case ActionType.THROW_EXCEPTION:
        case ActionType.TRUNCATE_FILE:
          throw ApiError.EEXIST(path);
        case ActionType.NOP:
          // Use existing file contents.
          // XXX: Uh, this maintains the previously-used flag.
          if (stats.fileData) {
            return new NoSyncFile(this, path, flags, Stats.clone(stats), stats.fileData);
          }
          // @todo be lazier about actually requesting the file
          const buffer = this._requestFileSync(path, 'buffer');
          // we don't initially have file sizes
          stats.size = buffer.length;
          stats.fileData = buffer;
          return new NoSyncFile(this, path, flags, Stats.clone(stats), buffer);
        default:
          throw new ApiError(ErrorCode.EINVAL, 'Invalid FileMode object.');
      }
    } else {
      throw ApiError.EISDIR(path);
    }
  }

  public readdir(path: string, cb: BFSCallback<string[]>): void {
    try {
      cb(null, this.readdirSync(path));
    } catch (e) {
      cb(e);
    }
  }

  public readdirSync(path: string): string[] {
    // Check if it exists.
    const inode = this._index.getInode(path);
    if (inode === null) {
      throw ApiError.ENOENT(path);
    } else if (isDirInode(inode)) {
      return inode.getListing();
    } else {
      throw ApiError.ENOTDIR(path);
    }
  }

  /**
   * We have the entire file as a buffer; optimize readFile.
   */
  public readFile(fname: string, encoding: string, flag: FileFlag, cb: BFSCallback<string | Buffer>): void {
    // Wrap cb in file closing code.
    const oldCb = cb;
    // Get file.
    this.open(fname, flag, 0x1a4, function(err: ApiError, fd?: File) {
      if (err) {
        return cb(err);
      }
      cb = function(err: ApiError, arg?: Buffer) {
        fd!.close(function(err2: any) {
          if (!err) {
            err = err2;
          }
          return oldCb(err, arg);
        });
      };
      const fdCast = <NoSyncFile<JSDelivrRequest>> fd;
      const fdBuff = <Buffer> fdCast.getBuffer();
      if (encoding === null) {
        cb(err, copyingSlice(fdBuff));
      } else {
        tryToString(fdBuff, encoding, cb);
      }
    });
  }

  /**
   * Specially-optimized readfile.
   */
  public readFileSync(fname: string, encoding: string, flag: FileFlag): any {
    // Get file.
    const fd = this.openSync(fname, flag, 0x1a4);
    try {
      const fdCast = <NoSyncFile<JSDelivrRequest>> fd;
      const fdBuff = <Buffer> fdCast.getBuffer();
      if (encoding === null) {
        return copyingSlice(fdBuff);
      }
      return fdBuff.toString(encoding);
    } finally {
      fd.closeSync();
    }
  }

  private _getHTTPPath(filePath: string): string {
    if (filePath.charAt(0) === '/') {
      filePath = filePath.slice(1);
    }
    return `https://cdn.jsdelivr.net/npm/${this.dependency}@${this.version}/${filePath}`;
  }

  /**
   * Asynchronously download the given file.
   */
  private _requestFileAsync(p: string, type: 'buffer', cb: BFSCallback<Buffer>): void;
  private _requestFileAsync(p: string, type: 'json', cb: BFSCallback<any>): void;
  private _requestFileAsync(p: string, type: string, cb: BFSCallback<any>): void;
  private _requestFileAsync(p: string, type: string, cb: BFSCallback<any>): void {
    this._requestFileAsyncInternal(this._getHTTPPath(p), type, cb);
  }

  /**
   * Synchronously download the given file.
   */
  private _requestFileSync(p: string, type: 'buffer'): Buffer;
  private _requestFileSync(p: string, type: 'json'): any;
  private _requestFileSync(p: string, type: string): any;
  private _requestFileSync(p: string, type: string): any {
    return this._requestFileSyncInternal(this._getHTTPPath(p), type);
  }

  /**
   * Only requests the HEAD content, for the file size.
   */
  private _requestFileSizeAsync(path: string, cb: BFSCallback<number>): void {
    this._requestFileSizeAsyncInternal(this._getHTTPPath(path), cb);
  }

  private _requestFileSizeSync(path: string): number {
    return this._requestFileSizeSyncInternal(this._getHTTPPath(path));
  }
}
