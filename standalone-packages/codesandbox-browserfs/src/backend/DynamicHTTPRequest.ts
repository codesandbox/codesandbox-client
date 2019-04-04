import {BaseFileSystem, FileSystem, BFSCallback, FileSystemOptions} from '../core/file_system';
import {ApiError, ErrorCode} from '../core/api_error';
import {FileFlag} from '../core/file_flag';
import {copyingSlice} from '../core/util';
import {File} from '../core/file';
import Stats from '../core/node_fs_stats';
import {NoSyncFile} from '../generic/preload_file';
import {xhrIsAvailable, asyncDownloadFile, syncDownloadFile} from '../generic/xhr';
import {fetchIsAvailable, fetchFileAsync} from '../generic/fetch';

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
 * Configuration options for a DynamicHTTPRequest file system.
 */
export interface DynamicHTTPRequestOptions {
  // URL to a file index as a JSON file or the file index object itself, generated with the make_http_index script.
  // Defaults to `index.json`.
  index?: string | object;
  // Used as the URL prefix for fetched files.
  // Default: Fetch files relative to the index.
  baseUrl?: string;
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
export default class DynamicHTTPRequest extends BaseFileSystem implements FileSystem {
  public static readonly Name = "DynamicHTTPRequest";

  public static readonly Options: FileSystemOptions = {
    baseUrl: {
      type: "string",
      optional: true,
      description: "Used as the URL prefix for fetched files. Default: Fetch files relative to the index."
    },
    preferXHR: {
      type: "boolean",
      optional: true,
      description: "Whether to prefer XmlHttpRequest or fetch for async operations if both are available. Default: false"
    }
  };

  /**
   * Construct an DynamicHTTPRequest file system backend with the given options.
   */
  public static Create(opts: DynamicHTTPRequestOptions, cb: BFSCallback<DynamicHTTPRequest>): void {
    cb(null, new DynamicHTTPRequest(opts.baseUrl));
  }

  public static isAvailable(): boolean {
    return xhrIsAvailable || fetchIsAvailable;
  }

  public readonly prefixUrl: string;
  private _requestFileAsyncInternal: AsyncDownloadFileMethod;
  // private _requestFileSizeAsyncInternal: (p: string, cb: BFSCallback<number>) => void;
  private _requestFileSyncInternal: SyncDownloadFileMethod;
  // private _requestFileSizeSyncInternal: (p: string) => number;

  private constructor(prefixUrl: string = '', preferXHR: boolean = false) {
    super();
    // prefix_url must end in a directory separator.
    if (prefixUrl.length > 0 && prefixUrl.charAt(prefixUrl.length - 1) !== '/') {
      prefixUrl = prefixUrl + '/';
    }
    this.prefixUrl = prefixUrl;

    if (fetchIsAvailable && (!preferXHR || !xhrIsAvailable)) {
      this._requestFileAsyncInternal = fetchFileAsync;
      // this._requestFileSizeAsyncInternal = fetchFileSizeAsync;
    } else {
      this._requestFileAsyncInternal = asyncDownloadFile;
      // this._requestFileSizeAsyncInternal = getFileSizeAsync;
    }

    if (xhrIsAvailable) {
      this._requestFileSyncInternal = syncDownloadFile;
      // this._requestFileSizeSyncInternal = getFileSizeSync;
    } else {
      this._requestFileSyncInternal = syncNotAvailableError;
      // this._requestFileSizeSyncInternal = syncNotAvailableError;
    }
  }

  private convertAPIError(error: any) {
    return new ApiError(error.errno, error.message, error.path);
  }

  public empty(): void {
    // this._index.fileIterator(function(file: Stats) {
    //   file.fileData = null;
    // });
  }

  public getName(): string {
    return DynamicHTTPRequest.Name;
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

  public stat(path: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    this._requestFileAsync(path + '?stat', 'json', (err, data) => {
      if (err || data.error) {
        cb(err || this.convertAPIError(data.error));
      } else {
        cb(null, Stats.fromBuffer(Buffer.from(data.stats)));
      }
    });
  }

  public statSync(path: string, isLstat: boolean): Stats {
    const data = this._requestFileSync(path + '?stat', 'json');

    if (data.error) {
      throw this.convertAPIError(data.error);
    }

    return Stats.fromBuffer(Buffer.from(data.stats));
  }

  public open(path: string, flags: FileFlag, mode: number, cb: BFSCallback<File>): void {
    // INVARIANT: You can't write to files on this file system.
    if (flags.isWriteable()) {
      return cb(new ApiError(ErrorCode.EPERM, path));
    }
    const self = this;

    this._requestFileAsync(path, 'json', (err: ApiError, data: any) => {
      if (err || data.error) {
        return cb(err || this.convertAPIError(data.error));
      }

      return cb(null, new NoSyncFile(self, path, flags, Stats.fromBuffer(Buffer.from(data.stats)), Buffer.from(data.result)));
    });
  }

  public openSync(path: string, flags: FileFlag, mode: number): File {
    // INVARIANT: You can't write to files on this file system.
    if (flags.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, path);
    }
    const self = this;

    const data = this._requestFileSync(path, 'json');
    if (data.error) {
      throw this.convertAPIError(data.error);
    }

    return new NoSyncFile(self, path, flags, Stats.fromBuffer(Buffer.from(data.stats)), Buffer.from(data.result));
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
    const data = this._requestFileSync(path + '?meta', 'json');

    if (data.error) {
      throw this.convertAPIError(data.error);
    }

    return data.result;
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
      const fdCast = <NoSyncFile<DynamicHTTPRequest>> fd;
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
      const fdCast = <NoSyncFile<DynamicHTTPRequest>> fd;
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
    return this.prefixUrl + filePath;
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

  // /**
  //  * Only requests the HEAD content, for the file size.
  //  */
  // private _requestFileSizeAsync(path: string, cb: BFSCallback<number>): void {
  //   this._requestFileSizeAsyncInternal(this._getHTTPPath(path), cb);
  // }

  // private _requestFileSizeSync(path: string): number {
  //   return this._requestFileSizeSyncInternal(this._getHTTPPath(path));
  // }
}
