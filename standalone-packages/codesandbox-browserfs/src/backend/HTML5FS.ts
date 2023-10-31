import PreloadFile from '../generic/preload_file';
import {BaseFileSystem, FileSystem as IFileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions} from '../core/file_system';
import {ApiError, ErrorCode} from '../core/api_error';
import {FileFlag, ActionType} from '../core/file_flag';
import {default as Stats, FileType} from '../core/node_fs_stats';
import {File as IFile} from '../core/file';
import * as path from 'path';
import global from '../core/global';
import {each as asyncEach} from 'async';
import {buffer2ArrayBuffer, arrayBuffer2Buffer} from '../core/util';

/**
 * @hidden
 */
function isDirectoryEntry(entry: Entry): entry is DirectoryEntry {
  return entry.isDirectory;
}

/**
 * @hidden
 */
const _getFS: (type: number, size: number, successCallback: FileSystemCallback, errorCallback?: ErrorCallback) => void = global.webkitRequestFileSystem || global.requestFileSystem || null;

/**
 * @hidden
 */
function _requestQuota(type: number, size: number, success: (size: number) => void, errorCallback: ErrorCallback) {
  // We cast navigator and window to '<any>' because everything here is
  // nonstandard functionality, despite the fact that Chrome has the only
  // implementation of the HTML5FS and is likely driving the standardization
  // process. Thus, these objects defined off of navigator and window are not
  // present in the DefinitelyTyped TypeScript typings for FileSystem.
  if (typeof (<any> navigator)['webkitPersistentStorage'] !== 'undefined') {
    switch (type) {
      case global.PERSISTENT:
        (<any> navigator).webkitPersistentStorage.requestQuota(size, success, errorCallback);
        break;
      case global.TEMPORARY:
        (<any> navigator).webkitTemporaryStorage.requestQuota(size, success, errorCallback);
        break;
      default:
        errorCallback(new TypeError(`Invalid storage type: ${type}`));
        break;
    }
  } else {
    (<any> global).webkitStorageInfo.requestQuota(type, size, success, errorCallback);
  }
}

/**
 * @hidden
 */
function _toArray(list?: any[]): any[] {
  return Array.prototype.slice.call(list || [], 0);
}

/**
 * Converts the given DOMError into an appropriate ApiError.
 * @url https://developer.mozilla.org/en-US/docs/Web/API/DOMError
 * @hidden
 */
// @ts-ignore
function convertError(err: DOMError, p: string, expectedDir: boolean): ApiError {
  switch (err.name) {
    /* The user agent failed to create a file or directory due to the existence of a file or
        directory with the same path.  */
    case "PathExistsError":
      return ApiError.EEXIST(p);
    /* The operation failed because it would cause the application to exceed its storage quota.  */
    case 'QuotaExceededError':
      return ApiError.FileError(ErrorCode.ENOSPC, p);
    /*  A required file or directory could not be found at the time an operation was processed.   */
    case 'NotFoundError':
      return ApiError.ENOENT(p);
    /* This is a security error code to be used in situations not covered by any other error codes.
        - A required file was unsafe for access within a Web application
        - Too many calls are being made on filesystem resources */
    case 'SecurityError':
      return ApiError.FileError(ErrorCode.EACCES, p);
    /* The modification requested was illegal. Examples of invalid modifications include moving a
        directory into its own child, moving a file into its parent directory without changing its name,
        or copying a directory to a path occupied by a file.  */
    case 'InvalidModificationError':
      return ApiError.FileError(ErrorCode.EPERM, p);
    /* The user has attempted to look up a file or directory, but the Entry found is of the wrong type
        [e.g. is a DirectoryEntry when the user requested a FileEntry].  */
    case 'TypeMismatchError':
      return ApiError.FileError(expectedDir ? ErrorCode.ENOTDIR : ErrorCode.EISDIR, p);
    /* A path or URL supplied to the API was malformed.  */
    case "EncodingError":
    /* An operation depended on state cached in an interface object, but that state that has changed
        since it was read from disk.  */
    case "InvalidStateError":
    /* The user attempted to write to a file or directory which could not be modified due to the state
        of the underlying filesystem.  */
    case "NoModificationAllowedError":
    default:
      return ApiError.FileError(ErrorCode.EINVAL, p);
  }
}

// A note about getFile and getDirectory options:
// These methods are called at numerous places in this file, and are passed
// some combination of these two options:
//   - create: If true, the entry will be created if it doesn't exist.
//             If false, an error will be thrown if it doesn't exist.
//   - exclusive: If true, only create the entry if it doesn't already exist,
//                and throw an error if it does.

export class HTML5FSFile extends PreloadFile<HTML5FS> implements IFile {
  private _entry: FileEntry;

  constructor(fs: HTML5FS, entry: FileEntry, path: string, flag: FileFlag, stat: Stats, contents?: Buffer) {
    super(fs, path, flag, stat, contents);
    this._entry = entry;
  }

  public sync(cb: BFSOneArgCallback): void {
    if (!this.isDirty()) {
      return cb();
    }

    this._entry.createWriter((writer) => {
      const buffer = this.getBuffer();
      const blob = new Blob([buffer2ArrayBuffer(buffer) as ArrayBuffer]);
      const length = blob.size;
      writer.onwriteend = (err?: any) => {
        writer.onwriteend = <any> null;
        writer.onerror = <any> null;
        writer.truncate(length);
        this.resetDirty();
        cb();
      };
      writer.onerror = (err: any) => {
        cb(convertError(err, this.getPath(), false));
      };
      writer.write(blob);
    });
  }

  public close(cb: BFSOneArgCallback): void {
    this.sync(cb);
  }
}

export interface HTML5FSOptions {
  // storage quota to request, in megabytes. Allocated value may be less.
  size?: number;
  // window.PERSISTENT or window.TEMPORARY. Defaults to PERSISTENT.
  type?: number;
}

/**
 * A read-write filesystem backed by the HTML5 FileSystem API.
 *
 * As the HTML5 FileSystem is only implemented in Blink, this interface is
 * only available in Chrome.
 */
export default class HTML5FS extends BaseFileSystem implements IFileSystem {
  public static readonly Name = "HTML5FS";

  public static readonly Options: FileSystemOptions = {
    size: {
      type: "number",
      optional: true,
      description: "Storage quota to request, in megabytes. Allocated value may be less. Defaults to 5."
    },
    type: {
      type: "number",
      optional: true,
      description: "window.PERSISTENT or window.TEMPORARY. Defaults to PERSISTENT."
    }
  };

  /**
   * Creates an HTML5FS instance with the given options.
   */
  public static Create(opts: HTML5FSOptions, cb: BFSCallback<HTML5FS>): void {
    const fs = new HTML5FS(opts.size, opts.type);
    fs._allocate((e) => e ? cb(e) : cb(null, fs));
  }
  public static isAvailable(): boolean {
    return Boolean(_getFS);
  }

  // HTML5File reaches into HTML5FS. :/
  public fs: FileSystem;
  private size: number;
  private type: number;
  /**
   * @param size storage quota to request, in megabytes. Allocated value may be less.
   * @param type window.PERSISTENT or window.TEMPORARY. Defaults to PERSISTENT.
   */
  private constructor(size: number = 5, type: number = global.PERSISTENT) {
    super();
    // Convert MB to bytes.
    this.size = 1024 * 1024 * size;
    this.type = type;
  }

  public getName(): string {
    return HTML5FS.Name;
  }

  public isReadOnly(): boolean {
    return false;
  }

  public supportsSymlinks(): boolean {
    return false;
  }

  public supportsProps(): boolean {
    return false;
  }

  public supportsSynch(): boolean {
    return false;
  }

  /**
   * Deletes everything in the FS. Used for testing.
   * Karma clears the storage after you quit it but not between runs of the test
   * suite, and the tests expect an empty FS every time.
   */
  public empty(mainCb: BFSOneArgCallback): void {
    // Get a list of all entries in the root directory to delete them
    this._readdir('/', (err: ApiError, entries?: Entry[]): void => {
      if (err) {
        mainCb(err);
      } else {
        // Called when every entry has been operated on
        const finished = (er: any): void => {
          if (err) {
            mainCb(err);
          } else {
            mainCb();
          }
        };
        // Removes files and recursively removes directories
        const deleteEntry = (entry: Entry, cb: (e?: any) => void): void => {
          const succ = () => {
            cb();
          };
          const error = (err: DOMException) => {
            cb(convertError(err, entry.fullPath, !entry.isDirectory));
          };
          if (isDirectoryEntry(entry)) {
            entry.removeRecursively(succ, error);
          } else {
            entry.remove(succ, error);
          }
        };
        // Loop through the entries and remove them, then call the callback
        // when they're all finished.
        // @ts-ignore
        asyncEach(entries!, deleteEntry, finished);
      }
    });
  }

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    let semaphore: number = 2;
    let successCount: number = 0;
    const root: DirectoryEntry = this.fs.root;
    let currentPath: string = oldPath;
    const error = (err: DOMException): void => {
      if (--semaphore <= 0) {
          cb(convertError(err, currentPath, false));
      }
    };
    const success = (file: Entry): void => {
      if (++successCount === 2) {
        return cb(new ApiError(ErrorCode.EINVAL, "Something was identified as both a file and a directory. This should never happen."));
      }

      // SPECIAL CASE: If newPath === oldPath, and the path exists, then
      // this operation trivially succeeds.
      if (oldPath === newPath) {
        return cb();
      }

      // Get the new parent directory.
      currentPath = path.dirname(newPath);
      root.getDirectory(currentPath, {}, (parentDir: DirectoryEntry): void => {
        currentPath = path.basename(newPath);
        file.moveTo(parentDir, currentPath, (entry: Entry): void => { cb(); }, (err: DOMException): void => {
          // SPECIAL CASE: If oldPath is a directory, and newPath is a
          // file, rename should delete the file and perform the move.
          if (file.isDirectory) {
            currentPath = newPath;
            // Unlink only works on files. Try to delete newPath.
            this.unlink(newPath, (e?): void => {
              if (e) {
                // newPath is probably a directory.
                error(err);
              } else {
                // Recur, now that newPath doesn't exist.
                this.rename(oldPath, newPath, cb);
              }
            });
          } else {
            error(err);
          }
        });
      }, error);
    };

    // We don't know if oldPath is a *file* or a *directory*, and there's no
    // way to stat items. So launch both requests, see which one succeeds.
    root.getFile(oldPath, {}, success, error);
    root.getDirectory(oldPath, {}, success, error);
  }

  public stat(path: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    // Throw an error if the entry doesn't exist, because then there's nothing
    // to stat.
    const opts = {
      create: false
    };
    // Called when the path has been successfully loaded as a file.
    const loadAsFile = (entry: FileEntry): void => {
      const fileFromEntry = (file: File): void => {
        const stat = new Stats(FileType.FILE, file.size);
        cb(null, stat);
      };
      entry.file(fileFromEntry, failedToLoad);
    };
    // Called when the path has been successfully loaded as a directory.
    const loadAsDir = (dir: DirectoryEntry): void => {
      // Directory entry size can't be determined from the HTML5 FS API, and is
      // implementation-dependant anyway, so a dummy value is used.
      const size = 4096;
      const stat = new Stats(FileType.DIRECTORY, size);
      cb(null, stat);
    };
    // Called when the path couldn't be opened as a directory or a file.
    const failedToLoad = (err: DOMException): void => {
      cb(convertError(err, path, false /* Unknown / irrelevant */));
    };
    // Called when the path couldn't be opened as a file, but might still be a
    // directory.
    const failedToLoadAsFile = (): void => {
      this.fs.root.getDirectory(path, opts, loadAsDir, failedToLoad);
    };
    // No method currently exists to determine whether a path refers to a
    // directory or a file, so this implementation tries both and uses the first
    // one that succeeds.
    this.fs.root.getFile(path, opts, loadAsFile, failedToLoadAsFile);
  }

  public open(p: string, flags: FileFlag, mode: number, cb: BFSCallback<IFile>): void {
    // XXX: err is a DOMError
    const error = (err: any): void => {
      if (err.name === 'InvalidModificationError' && flags.isExclusive()) {
        cb(ApiError.EEXIST(p));
      } else {
        cb(convertError(err, p, false));
      }
    };

    this.fs.root.getFile(p, {
      create: flags.pathNotExistsAction() === ActionType.CREATE_FILE,
      exclusive: flags.isExclusive()
    }, (entry: FileEntry): void => {
      // Try to fetch corresponding file.
      entry.file((file: File): void => {
        const reader = new FileReader();
        reader.onloadend = (event: Event): void => {
          const bfsFile = this._makeFile(p, entry, flags, file, <ArrayBuffer> reader.result);
          cb(null, bfsFile);
        };
        reader.onerror = (ev: Event) => {
          error(reader.error);
        };
        reader.readAsArrayBuffer(file);
      }, error);
    }, error);
  }

  public unlink(path: string, cb: BFSOneArgCallback): void {
    this._remove(path, cb, true);
  }

  public rmdir(path: string, cb: BFSOneArgCallback): void {
    // Check if directory is non-empty, first.
    this.readdir(path, (e, files?) => {
      if (e) {
        cb(e);
      } else if (files!.length > 0) {
        cb(ApiError.ENOTEMPTY(path));
      } else {
        this._remove(path, cb, false);
      }
    });
  }

  public mkdir(path: string, mode: number, cb: BFSOneArgCallback): void {
    // Create the directory, but throw an error if it already exists, as per
    // mkdir(1)
    const opts = {
      create: true,
      exclusive: true
    };
    const success = (dir: DirectoryEntry): void => {
      cb();
    };
    const error = (err: DOMException): void => {
      cb(convertError(err, path, true));
    };
    this.fs.root.getDirectory(path, opts, success, error);
  }

  /**
   * Map _readdir's list of `FileEntry`s to their names and return that.
   */
  public readdir(path: string, cb: BFSCallback<string[]>): void {
    this._readdir(path, (e: ApiError, entries?: Entry[]): void => {
      if (entries) {
        const rv: string[] = [];
        for (const entry of entries) {
          rv.push(entry.name);
        }
        cb(null, rv);
      } else {
        return cb(e);
      }
    });
  }

  /**
   * Returns a BrowserFS object representing a File.
   */
  private _makeFile(path: string, entry: FileEntry, flag: FileFlag, stat: File, data: ArrayBuffer = new ArrayBuffer(0)): HTML5FSFile {
    const stats = new Stats(FileType.FILE, stat.size);
    const buffer = arrayBuffer2Buffer(data);
    return new HTML5FSFile(this, entry, path, flag, stats, buffer);
  }

  /**
   * Returns an array of `FileEntry`s. Used internally by empty and readdir.
   */
  private _readdir(path: string, cb: BFSCallback<Entry[]>): void {
    const error = (err: DOMException): void => {
      cb(convertError(err, path, true));
    };
    // Grab the requested directory.
    this.fs.root.getDirectory(path, { create: false }, (dirEntry: DirectoryEntry) => {
      const reader = dirEntry.createReader();
      let entries: Entry[] = [];

      // Call the reader.readEntries() until no more results are returned.
      const readEntries = () => {
        reader.readEntries(((results) => {
          if (results.length) {
            entries = entries.concat(_toArray(results));
            readEntries();
          } else {
            cb(null, entries);
          }
        }), error);
      };
      readEntries();
    }, error);
  }

  /**
   * Requests a storage quota from the browser to back this FS.
   */
  private _allocate(cb: BFSOneArgCallback): void {
    const success = (fs: FileSystem): void => {
      this.fs = fs;
      cb();
    };
    const error = (err: DOMException): void => {
      cb(convertError(err, "/", true));
    };
    if (this.type === global.PERSISTENT) {
      _requestQuota(this.type, this.size, (granted: number) => {
        _getFS(this.type, granted, success, error);
      }, error);
    } else {
      _getFS(this.type, this.size, success, error);
    }
  }

  /**
   * Delete a file or directory from the file system
   * isFile should reflect which call was made to remove the it (`unlink` or
   * `rmdir`). If this doesn't match what's actually at `path`, an error will be
   * returned
   */
  private _remove(path: string, cb: BFSOneArgCallback, isFile: boolean): void {
    const success = (entry: Entry): void => {
      const succ = () => {
        cb();
      };
      const err = (err: DOMException) => {
        cb(convertError(err, path, !isFile));
      };
      entry.remove(succ, err);
    };
    const error = (err: DOMException): void => {
      cb(convertError(err, path, !isFile));
    };
    // Deleting the entry, so don't create it
    const opts = {
      create: false
    };

    if (isFile) {
      this.fs.root.getFile(path, opts, success, error);
    } else {
      this.fs.root.getDirectory(path, opts, success, error);
    }
  }
}
