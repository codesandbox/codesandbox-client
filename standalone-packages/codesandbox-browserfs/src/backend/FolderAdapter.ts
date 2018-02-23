import {BaseFileSystem, FileSystem, BFSCallback, FileSystemOptions} from '../core/file_system';
import * as path from 'path';
import {ApiError} from '../core/api_error';

/**
 * Configuration options for a FolderAdapter file system.
 */
export interface FolderAdapterOptions {
  // The folder to use as the root directory.
  folder: string;
  // The file system to wrap.
  wrapped: FileSystem;
}

/**
 * The FolderAdapter file system wraps a file system, and scopes all interactions to a subfolder of that file system.
 *
 * Example: Given a file system `foo` with folder `bar` and file `bar/baz`...
 *
 * ```javascript
 * BrowserFS.configure({
 *   fs: "FolderAdapter",
 *   options: {
 *     folder: "bar",
 *     wrapped: foo
 *   }
 * }, function(e) {
 *   var fs = BrowserFS.BFSRequire('fs');
 *   fs.readdirSync('/'); // ['baz']
 * });
 * ```
 */
export default class FolderAdapter extends BaseFileSystem implements FileSystem {
  public static readonly Name = "FolderAdapter";

  public static readonly Options: FileSystemOptions = {
    folder: {
      type: "string",
      description: "The folder to use as the root directory"
    },
    wrapped: {
      type: "object",
      description: "The file system to wrap"
    }
  };

  /**
   * Creates a FolderAdapter instance with the given options.
   */
  public static Create(opts: FolderAdapterOptions, cb: BFSCallback<FolderAdapter>): void {
    const fa = new FolderAdapter(opts.folder, opts.wrapped);
    fa._initialize(function(e?) {
      if (e) {
        cb(e);
      } else {
        cb(null, fa);
      }
    });
  }
  public static isAvailable(): boolean {
    return true;
  }

  public _wrapped: FileSystem;
  public _folder: string;

  private constructor(folder: string, wrapped: FileSystem) {
    super();
    this._folder = folder;
    this._wrapped = wrapped;
  }

  public getName(): string { return this._wrapped.getName(); }
  public isReadOnly(): boolean { return this._wrapped.isReadOnly(); }
  public supportsProps(): boolean { return this._wrapped.supportsProps(); }
  public supportsSynch(): boolean { return this._wrapped.supportsSynch(); }
  public supportsLinks(): boolean { return false; }

  /**
   * Initialize the file system. Ensures that the wrapped file system
   * has the given folder.
   */
  private _initialize(cb: (e?: ApiError) => void) {
    this._wrapped.exists(this._folder, (exists: boolean) => {
      if (exists) {
        cb();
      } else if (this._wrapped.isReadOnly()) {
        cb(ApiError.ENOENT(this._folder));
      } else {
        this._wrapped.mkdir(this._folder, 0x1ff, cb);
      }
    });
  }
}

/**
 * @hidden
 */
function translateError(folder: string, e: any): any {
  if (e !== null && typeof e === 'object') {
    const err = <ApiError> e;
    let p = err.path;
    if (p) {
      p = '/' + path.relative(folder, p);
      err.message = err.message.replace(err.path!, p);
      err.path = p;
    }
  }
  return e;
}

/**
 * @hidden
 */
function wrapCallback(folder: string, cb: any): any {
  if (typeof cb === 'function') {
    return function(err: ApiError) {
      if (arguments.length > 0) {
        arguments[0] = translateError(folder, err);
      }
      (<Function> cb).apply(null, arguments);
    };
  } else {
    return cb;
  }
}

/**
 * @hidden
 */
function wrapFunction(name: string, wrapFirst: boolean, wrapSecond: boolean): Function {
  if (name.slice(name.length - 4) !== 'Sync') {
    // Async function. Translate error in callback.
    return function(this: FolderAdapter) {
      if (arguments.length > 0) {
        if (wrapFirst) {
          arguments[0] = path.join(this._folder, arguments[0]);
        }
        if (wrapSecond) {
          arguments[1] = path.join(this._folder, arguments[1]);
        }
        arguments[arguments.length - 1] = wrapCallback(this._folder, arguments[arguments.length - 1]);
      }
      return (<any> this._wrapped)[name].apply(this._wrapped, arguments);
    };
  } else {
    // Sync function. Translate error in catch.
    return function(this: FolderAdapter) {
      try {
        if (wrapFirst) {
          arguments[0] = path.join(this._folder, arguments[0]);
        }
        if (wrapSecond) {
          arguments[1] = path.join(this._folder, arguments[1]);
        }
        return (<any> this._wrapped)[name].apply(this._wrapped, arguments);
      } catch (e) {
        throw translateError(this._folder, e);
      }
    };
  }
}

// First argument is a path.
['diskSpace', 'stat', 'statSync', 'open', 'openSync', 'unlink', 'unlinkSync',
 'rmdir', 'rmdirSync', 'mkdir', 'mkdirSync', 'readdir', 'readdirSync', 'exists',
 'existsSync', 'realpath', 'realpathSync', 'truncate', 'truncateSync', 'readFile',
 'readFileSync', 'writeFile', 'writeFileSync', 'appendFile', 'appendFileSync',
 'chmod', 'chmodSync', 'chown', 'chownSync', 'utimes', 'utimesSync', 'readlink',
 'readlinkSync'].forEach((name: string) => {
  (<any> FolderAdapter.prototype)[name] = wrapFunction(name, true, false);
});

// First and second arguments are paths.
['rename', 'renameSync', 'link', 'linkSync', 'symlink', 'symlinkSync'].forEach((name: string) => {
  (<any> FolderAdapter.prototype)[name] = wrapFunction(name, true, true);
});
