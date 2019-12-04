import * as path from 'path';
import * as _fs from 'fs';
import { File } from './file';
import { ApiError, ErrorCode } from './api_error';
import { FileSystem, BFSOneArgCallback, BFSCallback, BFSThreeArgCallback } from './file_system';
import { FileFlag } from './file_flag';
import Stats, { FileType } from './node_fs_stats';
import setImmediate from '../generic/setImmediate';

// Typing info only.
import { FileWatcher } from './file_watcher';

/** Used for unit testing. Defaults to a NOP. */
let wrapCbHook = function <T>(cb: T, numArgs: number): T {
  return cb;
};

/**
 * Wraps a callback function, ensuring it is invoked through setImmediate.
 * @hidden
 */
function wrapCb<T extends Function>(cb: T, numArgs: number): T {
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function.');
  }

  const hookedCb = wrapCbHook(cb, numArgs);

  // We could use `arguments`, but Function.call/apply is expensive. And we only
  // need to handle 1-3 arguments
  switch (numArgs) {
    case 1:
      return <any> function(arg1: any) {
        setImmediate(function() {
          return hookedCb(arg1);
        });
      };
    case 2:
      return <any> function(arg1: any, arg2: any) {
        setImmediate(function() {
          return hookedCb(arg1, arg2);
        });
      };
    case 3:
      return <any> function(arg1: any, arg2: any, arg3: any) {
        setImmediate(function() {
          return hookedCb(arg1, arg2, arg3);
        });
      };
    default:
      throw new Error('Invalid invocation of wrapCb.');
  }
}

/**
 * @hidden
 */
function assertRoot(fs?: FileSystem | null): FileSystem {
  if (fs) {
    return fs;
  }
  throw new ApiError(ErrorCode.EIO, `Initialize BrowserFS with a file system using BrowserFS.initialize(filesystem)`);
}

/**
 * @hidden
 */
function normalizeMode(mode: number | string | null | undefined, def: number): number {
  switch (typeof mode) {
    case 'number':
      // (path, flag, mode, cb?)
      return <number> mode;
    case 'string':
      // (path, flag, modeString, cb?)
      const trueMode = parseInt(<string> mode, 8);
      if (!isNaN(trueMode)) {
        return trueMode;
      }
      // Invalid string.
      return def;
    default:
      return def;
  }
}

/**
 * @hidden
 */
function normalizeTime(time: number | Date): Date {
  if (time instanceof Date) {
    return time;
  } if (typeof time === 'number') {
    return new Date(time * 1000);
  }
  throw new ApiError(ErrorCode.EINVAL, `Invalid time.`);

}

/**
 * @hidden
 */
function normalizePath(p: string): string {
  // Node doesn't allow null characters in paths.
  if (p.indexOf('\u0000') >= 0) {
    throw new ApiError(ErrorCode.EINVAL, 'Path must be a string without null bytes.');
  } else if (p === '') {
    throw new ApiError(ErrorCode.EINVAL, 'Path must not be empty.');
  }
  return path.resolve(p);
}

/**
 * @hidden
 */
function normalizeOptions(options: any, defEnc: string | null, defFlag: string, defMode: number | null): { encoding: string; flag: string; mode: number } {
  // typeof null === 'object' so special-case handing is needed.
  switch (options === null ? 'null' : typeof options) {
    case 'object':
      return {
        encoding: typeof options.encoding !== 'undefined' ? options.encoding : defEnc,
        flag: typeof options.flag !== 'undefined' ? options.flag : defFlag,
        mode: normalizeMode(options.mode, defMode!)
      };
    case 'string':
      return {
        encoding: options,
        flag: defFlag,
        mode: defMode!
      };
    case 'null':
    case 'undefined':
    case 'function':
      return {
        encoding: defEnc!,
        flag: defFlag,
        mode: defMode!
      };
    default:
      throw new TypeError(`"options" must be a string or an object, got ${typeof options} instead.`);
  }
}

/**
 * The default callback is a NOP.
 * @hidden
 * @private
 */
function nopCb() {
  // NOP.
}

/**
 * The node frontend to all filesystems.
 * This layer handles:
 *
 * * Sanity checking inputs.
 * * Normalizing paths.
 * * Resetting stack depth for asynchronous operations which may not go through
 *   the browser by wrapping all input callbacks using `setImmediate`.
 * * Performing the requested operation through the filesystem or the file
 *   descriptor, as appropriate.
 * * Handling optional arguments and setting default arguments.
 * @see http://nodejs.org/api/fs.html
 */
export default class FS {
  /* tslint:disable:variable-name */
  // Exported fs.Stats.
  public static Stats = Stats;
  /* tslint:enable:variable-name */

  public static F_OK: number = 0;
  public static R_OK: number = 4;
  public static W_OK: number = 2;
  public static X_OK: number = 1;

  private root: FileSystem | null = null;
  private fdMap: { [fd: number]: File } = {};
  private nextFd = 100;

  private fileWatcher: FileWatcher = new FileWatcher();

  public initialize(rootFS: FileSystem): FileSystem {
    if (!(<any> rootFS).constructor.isAvailable()) {
      throw new ApiError(ErrorCode.EINVAL, 'Tried to instantiate BrowserFS with an unavailable file system.');
    }
    return this.root = rootFS;
  }

  /**
   * converts Date or number to a fractional UNIX timestamp
   * Grabbed from NodeJS sources (lib/fs.js)
   */
  public _toUnixTimestamp(time: Date | number): number {
    if (typeof time === 'number') {
      return time;
    } if (time instanceof Date) {
      return time.getTime() / 1000;
    }
    throw new Error("Cannot parse time: " + time);
  }

  /**
   * **NONSTANDARD**: Grab the FileSystem instance that backs this API.
   * @return [BrowserFS.FileSystem | null] Returns null if the file system has
   *   not been initialized.
   */
  public getRootFS(): FileSystem | null {
    if (this.root) {
      return this.root;
    }
    return null;

  }

  // FILE OR DIRECTORY METHODS

  /**
   * Asynchronous rename. No arguments other than a possible exception are given
   * to the completion callback.
   * @param oldPath
   * @param newPath
   * @param callback
   */
  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      setImmediate(() => {
        this.fileWatcher.triggerWatch(oldPath, 'rename');

        this.stat(newPath, (err, stat) => {
          if (err) {
            return;
          }

          this.fileWatcher.triggerWatch(newPath, 'rename', stat);
        });
      });
      assertRoot(this.root).rename(normalizePath(oldPath), normalizePath(newPath), newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous rename.
   * @param oldPath
   * @param newPath
   */
  public renameSync(oldPath: string, newPath: string): void {
    setImmediate(() => {
      this.fileWatcher.triggerWatch(oldPath, 'rename');
      this.fileWatcher.triggerWatch(newPath, 'rename');
    });
    assertRoot(this.root).renameSync(normalizePath(oldPath), normalizePath(newPath));
  }

  /**
   * Test whether or not the given path exists by checking with the file system.
   * Then call the callback argument with either true or false.
   * @example Sample invocation
   *   fs.exists('/etc/passwd', function (exists) {
   *     util.debug(exists ? "it's there" : "no passwd!");
   *   });
   * @param path
   * @param callback
   */
  public exists(path: string, cb: (exists: boolean) => any = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      return assertRoot(this.root).exists(normalizePath(path), newCb);
    } catch (e) {
      // Doesn't return an error. If something bad happens, we assume it just
      // doesn't exist.
      return newCb(false);
    }
  }

  /**
   * Test whether or not the given path exists by checking with the file system.
   * @param path
   * @return [boolean]
   */
  public existsSync(path: string): boolean {
    try {
      return assertRoot(this.root).existsSync(normalizePath(path));
    } catch (e) {
      // Doesn't return an error. If something bad happens, we assume it just
      // doesn't exist.
      return false;
    }
  }

  /**
   * Asynchronous `stat`.
   * @param path
   * @param callback
   */
  public stat(path: string, cb: BFSCallback<Stats> = nopCb): void {
    const newCb = wrapCb(cb, 2);
    try {
      return assertRoot(this.root).stat(normalizePath(path), false, newCb);
    } catch (e) {
      return newCb(e);
    }
  }

  /**
   * Synchronous `stat`.
   * @param path
   * @return [BrowserFS.node.fs.Stats]
   */
  public statSync(path: string): Stats {
    return assertRoot(this.root).statSync(normalizePath(path), false);
  }

  /**
   * Asynchronous `lstat`.
   * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
   * then the link itself is stat-ed, not the file that it refers to.
   * @param path
   * @param callback
   */
  public lstat(path: string, cb: BFSCallback<Stats> = nopCb): void {
    const newCb = wrapCb(cb, 2);
    try {
      return assertRoot(this.root).stat(normalizePath(path), true, newCb);
    } catch (e) {
      return newCb(e);
    }
  }

  /**
   * Synchronous `lstat`.
   * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
   * then the link itself is stat-ed, not the file that it refers to.
   * @param path
   * @return [BrowserFS.node.fs.Stats]
   */
  public lstatSync(path: string): Stats {
    return assertRoot(this.root).statSync(normalizePath(path), true);
  }

  // FILE-ONLY METHODS

  /**
   * Asynchronous `truncate`.
   * @param path
   * @param len
   * @param callback
   */
  public truncate(path: string, cb?: BFSOneArgCallback): void;
  public truncate(path: string, len: number, cb?: BFSOneArgCallback): void;
  public truncate(path: string, arg2: any = 0, cb: BFSOneArgCallback = nopCb): void {
    let len = 0;
    if (typeof arg2 === 'function') {
      cb = arg2;
    } else if (typeof arg2 === 'number') {
      len = arg2;
    }

    const newCb = wrapCb(cb, 1);
    try {
      if (len < 0) {
        throw new ApiError(ErrorCode.EINVAL);
      }
      setImmediate(() => {
        this.stat(path, (err, stat) => {
          this.fileWatcher.triggerWatch(path, 'change', stat);
        });
      });
      return assertRoot(this.root).truncate(normalizePath(path), len, newCb);
    } catch (e) {
      return newCb(e);
    }
  }

  /**
   * Synchronous `truncate`.
   * @param path
   * @param len
   */
  public truncateSync(path: string, len: number = 0): void {
    if (len < 0) {
      throw new ApiError(ErrorCode.EINVAL);
    }
    setImmediate(() => {
      this.stat(path, (err, stat) => {
        this.fileWatcher.triggerWatch(path, 'change', stat);
      });
    });
    return assertRoot(this.root).truncateSync(normalizePath(path), len);
  }

  /**
   * Asynchronous `unlink`.
   * @param path
   * @param callback
   */
  public unlink(path: string, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      setImmediate(() => {
        this.fileWatcher.triggerWatch(path, 'rename', new Stats(FileType.FILE, 0, undefined, 0, 0, 0, 0));
      });
      return assertRoot(this.root).unlink(normalizePath(path), newCb);
    } catch (e) {
      return newCb(e);
    }
  }

  /**
   * Synchronous `unlink`.
   * @param path
   */
  public unlinkSync(path: string): void {
    setImmediate(() => {
      this.fileWatcher.triggerWatch(path, 'rename', new Stats(FileType.FILE, 0, undefined, 0, 0, 0, 0));
    });
    return assertRoot(this.root).unlinkSync(normalizePath(path));
  }

  /**
   * Asynchronous file open.
   * Exclusive mode ensures that path is newly created.
   *
   * `flags` can be:
   *
   * * `'r'` - Open file for reading. An exception occurs if the file does not exist.
   * * `'r+'` - Open file for reading and writing. An exception occurs if the file does not exist.
   * * `'rs'` - Open file for reading in synchronous mode. Instructs the filesystem to not cache writes.
   * * `'rs+'` - Open file for reading and writing, and opens the file in synchronous mode.
   * * `'w'` - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
   * * `'wx'` - Like 'w' but opens the file in exclusive mode.
   * * `'w+'` - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
   * * `'wx+'` - Like 'w+' but opens the file in exclusive mode.
   * * `'a'` - Open file for appending. The file is created if it does not exist.
   * * `'ax'` - Like 'a' but opens the file in exclusive mode.
   * * `'a+'` - Open file for reading and appending. The file is created if it does not exist.
   * * `'ax+'` - Like 'a+' but opens the file in exclusive mode.
   *
   * @see http://www.manpagez.com/man/2/open/
   * @param path
   * @param flags
   * @param mode defaults to `0644`
   * @param callback
   */
  public open(path: string, flag: string, cb?: BFSCallback<number>): void;
  public open(path: string, flag: string, mode: number | string, cb?: BFSCallback<number>): void;
  public open(path: string, flag: string, arg2?: any, cb: BFSCallback<number> = nopCb): void {
    const mode = normalizeMode(arg2, 0x1a4);
    cb = typeof arg2 === 'function' ? arg2 : cb;
    const newCb = wrapCb(cb, 2);
    try {
      assertRoot(this.root).open(normalizePath(path), FileFlag.getFileFlag(flag), mode, (e: ApiError, file?: File) => {
        if (file) {
          newCb(e, this.getFdForFile(file));
        } else {
          newCb(e);
        }
      });
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous file open.
   * @see http://www.manpagez.com/man/2/open/
   * @param path
   * @param flags
   * @param mode defaults to `0644`
   * @return [BrowserFS.File]
   */
  public openSync(path: string, flag: string, mode: number | string = 0x1a4): number {
    return this.getFdForFile(
      assertRoot(this.root).openSync(normalizePath(path), FileFlag.getFileFlag(flag), normalizeMode(mode, 0x1a4)));
  }

  /**
   * Asynchronously reads the entire contents of a file.
   * @example Usage example
   *   fs.readFile('/etc/passwd', function (err, data) {
   *     if (err) throw err;
   *     console.log(data);
   *   });
   * @param filename
   * @param options
   * @option options [String] encoding The string encoding for the file contents. Defaults to `null`.
   * @option options [String] flag Defaults to `'r'`.
   * @param callback If no encoding is specified, then the raw buffer is returned.
   */
  public readFile(filename: string, cb: BFSCallback<Buffer>): void;
  public readFile(filename: string, options: { flag?: string; }, callback?: BFSCallback<Buffer>): void;
  public readFile(filename: string, options: { encoding: string; flag?: string; }, callback?: BFSCallback<string>): void;
  public readFile(filename: string, encoding: string, cb: BFSCallback<string>): void;
  public readFile(filename: string, arg2: any = {}, cb: BFSCallback<any> = nopCb) {
    const options = normalizeOptions(arg2, null, 'r', null);
    cb = typeof arg2 === 'function' ? arg2 : cb;
    const newCb = wrapCb(cb, 2);
    try {
      const flag = FileFlag.getFileFlag(options.flag);
      if (!flag.isReadable()) {
        return newCb(new ApiError(ErrorCode.EINVAL, 'Flag passed to readFile must allow for reading.'));
      }
      return assertRoot(this.root).readFile(normalizePath(filename), options.encoding, flag, newCb);
    } catch (e) {
      return newCb(e);
    }
  }

  /**
   * Synchronously reads the entire contents of a file.
   * @param filename
   * @param options
   * @option options [String] encoding The string encoding for the file contents. Defaults to `null`.
   * @option options [String] flag Defaults to `'r'`.
   * @return [String | BrowserFS.node.Buffer]
   */
  public readFileSync(filename: string, options?: { flag?: string; }): Buffer;
  public readFileSync(filename: string, options: { encoding: string; flag?: string; }): string;
  public readFileSync(filename: string, encoding: string): string;
  public readFileSync(filename: string, arg2: any = {}): any {
    const options = normalizeOptions(arg2, null, 'r', null);
    const flag = FileFlag.getFileFlag(options.flag);
    if (!flag.isReadable()) {
      throw new ApiError(ErrorCode.EINVAL, 'Flag passed to readFile must allow for reading.');
    }
    return assertRoot(this.root).readFileSync(normalizePath(filename), options.encoding, flag);
  }

  /**
   * Asynchronously writes data to a file, replacing the file if it already
   * exists.
   *
   * The encoding option is ignored if data is a buffer.
   *
   * @example Usage example
   *   fs.writeFile('message.txt', 'Hello Node', function (err) {
   *     if (err) throw err;
   *     console.log('It\'s saved!');
   *   });
   * @param filename
   * @param data
   * @param options
   * @option options [String] encoding Defaults to `'utf8'`.
   * @option options [Number] mode Defaults to `0644`.
   * @option options [String] flag Defaults to `'w'`.
   * @param callback
   */
  public writeFile(filename: string, data: any, cb?: BFSOneArgCallback): void;
  public writeFile(filename: string, data: any, encoding?: string, cb?: BFSOneArgCallback): void;
  public writeFile(filename: string, data: any, options?: { encoding?: string; mode?: string | number; flag?: string; }, cb?: BFSOneArgCallback): void;
  public writeFile(filename: string, data: any, arg3: any = {}, cb: BFSOneArgCallback = nopCb): void {
    const options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
    cb = typeof arg3 === 'function' ? arg3 : cb;
    const newCb = wrapCb(cb, 1);
    try {
      const flag = FileFlag.getFileFlag(options.flag);
      if (!flag.isWriteable()) {
        return newCb(new ApiError(ErrorCode.EINVAL, 'Flag passed to writeFile must allow for writing.'));
      }

      assertRoot(this.root).writeFile(normalizePath(filename), data, options.encoding, flag, options.mode, (...args) => {
        setImmediate(() => {
          this.stat(filename, (_err, stat) => {
            this.fileWatcher.triggerWatch(filename, 'change', stat);
          });
        });

        newCb(...args);
      });

    } catch (e) {
      return newCb(e);
    }
  }

  /**
   * Synchronously writes data to a file, replacing the file if it already
   * exists.
   *
   * The encoding option is ignored if data is a buffer.
   * @param filename
   * @param data
   * @param options
   * @option options [String] encoding Defaults to `'utf8'`.
   * @option options [Number] mode Defaults to `0644`.
   * @option options [String] flag Defaults to `'w'`.
   */
  public writeFileSync(filename: string, data: any, options?: { encoding?: string; mode?: number | string; flag?: string; }): void;
  public writeFileSync(filename: string, data: any, encoding?: string): void;
  public writeFileSync(filename: string, data: any, arg3?: any): void {
    const options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
    const flag = FileFlag.getFileFlag(options.flag);
    if (!flag.isWriteable()) {
      throw new ApiError(ErrorCode.EINVAL, 'Flag passed to writeFile must allow for writing.');
    }
    setImmediate(() => {
      this.stat(filename, (err, stat) => {
        this.fileWatcher.triggerWatch(filename, 'change', stat);
      });
    });
    return assertRoot(this.root).writeFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
  }

  /**
   * Asynchronously append data to a file, creating the file if it not yet
   * exists.
   *
   * @example Usage example
   *   fs.appendFile('message.txt', 'data to append', function (err) {
   *     if (err) throw err;
   *     console.log('The "data to append" was appended to file!');
   *   });
   * @param filename
   * @param data
   * @param options
   * @option options [String] encoding Defaults to `'utf8'`.
   * @option options [Number] mode Defaults to `0644`.
   * @option options [String] flag Defaults to `'a'`.
   * @param callback
   */
  public appendFile(filename: string, data: any, cb?: BFSOneArgCallback): void;
  public appendFile(filename: string, data: any, options?: { encoding?: string; mode?: number | string; flag?: string; }, cb?: BFSOneArgCallback): void;
  public appendFile(filename: string, data: any, encoding?: string, cb?: BFSOneArgCallback): void;
  public appendFile(filename: string, data: any, arg3?: any, cb: BFSOneArgCallback = nopCb): void {
    const options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
    cb = typeof arg3 === 'function' ? arg3 : cb;
    const newCb = wrapCb(cb, 1);
    try {
      const flag = FileFlag.getFileFlag(options.flag);
      if (!flag.isAppendable()) {
        return newCb(new ApiError(ErrorCode.EINVAL, 'Flag passed to appendFile must allow for appending.'));
      }
      setImmediate(() => {
        this.stat(filename, (err, stat) => {
          this.fileWatcher.triggerWatch(filename, 'rename', stat);
        });
      });
      assertRoot(this.root).appendFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Asynchronously append data to a file, creating the file if it not yet
   * exists.
   *
   * @example Usage example
   *   fs.appendFile('message.txt', 'data to append', function (err) {
   *     if (err) throw err;
   *     console.log('The "data to append" was appended to file!');
   *   });
   * @param filename
   * @param data
   * @param options
   * @option options [String] encoding Defaults to `'utf8'`.
   * @option options [Number] mode Defaults to `0644`.
   * @option options [String] flag Defaults to `'a'`.
   */
  public appendFileSync(filename: string, data: any, options?: { encoding?: string; mode?: number | string; flag?: string; }): void;
  public appendFileSync(filename: string, data: any, encoding?: string): void;
  public appendFileSync(filename: string, data: any, arg3?: any): void {
    const options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
    const flag = FileFlag.getFileFlag(options.flag);
    if (!flag.isAppendable()) {
      throw new ApiError(ErrorCode.EINVAL, 'Flag passed to appendFile must allow for appending.');
    }
    setImmediate(() => {
      this.stat(filename, (err, stat) => {
        this.fileWatcher.triggerWatch(filename, 'change', stat);
      });
    });
    return assertRoot(this.root).appendFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
  }

  // FILE DESCRIPTOR METHODS

  /**
   * Asynchronous `fstat`.
   * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
   * specified by the file descriptor `fd`.
   * @param fd
   * @param callback
   */
  public fstat(fd: number, cb: BFSCallback<Stats> = nopCb): void {
    const newCb = wrapCb(cb, 2);
    try {
      const file = this.fd2file(fd);
      file.stat(newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `fstat`.
   * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
   * specified by the file descriptor `fd`.
   * @param fd
   * @return [BrowserFS.node.fs.Stats]
   */
  public fstatSync(fd: number): Stats {
    return this.fd2file(fd).statSync();
  }

  /**
   * Asynchronous close.
   * @param fd
   * @param callback
   */
  public close(fd: number, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      this.fd2file(fd).close((e: ApiError) => {
        if (!e) {
          this.closeFd(fd);
        }
        newCb(e);
      });
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous close.
   * @param fd
   */
  public closeSync(fd: number): void {
    this.fd2file(fd).closeSync();
    this.closeFd(fd);
  }

  /**
   * Asynchronous ftruncate.
   * @param fd
   * @param len
   * @param callback
   */
  public ftruncate(fd: number, cb?: BFSOneArgCallback): void;
  public ftruncate(fd: number, len?: number, cb?: BFSOneArgCallback): void;
  public ftruncate(fd: number, arg2?: any, cb: BFSOneArgCallback = nopCb): void {
    const length = typeof arg2 === 'number' ? arg2 : 0;
    cb = typeof arg2 === 'function' ? arg2 : cb;
    const newCb = wrapCb(cb, 1);
    try {
      const file = this.fd2file(fd);
      if (length < 0) {
        throw new ApiError(ErrorCode.EINVAL);
      }
      file.truncate(length, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous ftruncate.
   * @param fd
   * @param len
   */
  public ftruncateSync(fd: number, len: number = 0): void {
    const file = this.fd2file(fd);
    if (len < 0) {
      throw new ApiError(ErrorCode.EINVAL);
    }
    file.truncateSync(len);
  }

  /**
   * Asynchronous fsync.
   * @param fd
   * @param callback
   */
  public fsync(fd: number, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      this.fd2file(fd).sync(newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous fsync.
   * @param fd
   */
  public fsyncSync(fd: number): void {
    this.fd2file(fd).syncSync();
  }

  /**
   * Asynchronous fdatasync.
   * @param fd
   * @param callback
   */
  public fdatasync(fd: number, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      this.fd2file(fd).datasync(newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous fdatasync.
   * @param fd
   */
  public fdatasyncSync(fd: number): void {
    this.fd2file(fd).datasyncSync();
  }

  /**
   * Write buffer to the file specified by `fd`.
   * Note that it is unsafe to use fs.write multiple times on the same file
   * without waiting for the callback.
   * @param fd
   * @param buffer Buffer containing the data to write to
   *   the file.
   * @param offset Offset in the buffer to start reading data from.
   * @param length The amount of bytes to write to the file.
   * @param position Offset from the beginning of the file where this
   *   data should be written. If position is null, the data will be written at
   *   the current position.
   * @param callback The number specifies the number of bytes written into the file.
   */
  public write(fd: number, buffer: Buffer, offset: number, length: number, cb?: BFSThreeArgCallback<number, Buffer>): void;
  public write(fd: number, buffer: Buffer, offset: number, length: number, position: number | null, cb?: BFSThreeArgCallback<number, Buffer>): void;
  public write(fd: number, data: any, cb?: BFSThreeArgCallback<number, string>): void;
  public write(fd: number, data: any, position: number | null, cb?: BFSThreeArgCallback<number, string>): void;
  public write(fd: number, data: any, position: number | null, encoding: string, cb?: BFSThreeArgCallback<number, string>): void;
  public write(fd: number, arg2: any, arg3?: any, arg4?: any, arg5?: any, cb: BFSThreeArgCallback<number, any> = nopCb): void {
    let buffer: Buffer; let offset: number; let length: number; let position: number | null = null;
    if (typeof arg2 === 'string') {
      // Signature 1: (fd, string, [position?, [encoding?]], cb?)
      let encoding = 'utf8';
      switch (typeof arg3) {
        case 'function':
          // (fd, string, cb)
          cb = arg3;
          break;
        case 'number':
          // (fd, string, position, encoding?, cb?)
          position = arg3;
          encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
          cb = typeof arg5 === 'function' ? arg5 : cb;
          break;
        default:
          // ...try to find the callback and get out of here!
          cb = typeof arg4 === 'function' ? arg4 : typeof arg5 === 'function' ? arg5 : cb;
          return cb(new ApiError(ErrorCode.EINVAL, 'Invalid arguments.'));
      }
      buffer = Buffer.from(arg2, encoding);
      offset = 0;
      length = buffer.length;
    } else {
      // Signature 2: (fd, buffer, offset, length, position?, cb?)
      buffer = arg2;
      offset = arg3;
      length = arg4;
      position = typeof arg5 === 'number' ? arg5 : null;
      cb = typeof arg5 === 'function' ? arg5 : cb;
    }

    const newCb = wrapCb(cb, 3);
    try {
      const file = this.fd2file(fd);
      if (position === undefined || position === null) {
        position = file.getPos()!;
      }
      file.write(buffer, offset, length, position, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Write buffer to the file specified by `fd`.
   * Note that it is unsafe to use fs.write multiple times on the same file
   * without waiting for it to return.
   * @param fd
   * @param buffer Buffer containing the data to write to
   *   the file.
   * @param offset Offset in the buffer to start reading data from.
   * @param length The amount of bytes to write to the file.
   * @param position Offset from the beginning of the file where this
   *   data should be written. If position is null, the data will be written at
   *   the current position.
   */
  public writeSync(fd: number, buffer: Buffer, offset: number, length: number, position?: number | null): number;
  public writeSync(fd: number, data: string, position?: number | null, encoding?: string): number;
  public writeSync(fd: number, arg2: any, arg3?: any, arg4?: any, arg5?: any): number {
    let buffer: Buffer; let offset: number = 0; let length: number; let position: number | null;
    if (typeof arg2 === 'string') {
      // Signature 1: (fd, string, [position?, [encoding?]])
      position = typeof arg3 === 'number' ? arg3 : null;
      const encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
      offset = 0;
      buffer = Buffer.from(arg2, encoding);
      length = buffer.length;
    } else {
      // Signature 2: (fd, buffer, offset, length, position?)
      buffer = arg2;
      offset = arg3;
      length = arg4;
      position = typeof arg5 === 'number' ? arg5 : null;
    }

    const file = this.fd2file(fd);
    if (position === undefined || position === null) {
      position = file.getPos()!;
    }
    return file.writeSync(buffer, offset, length, position);
  }

  /**
   * Read data from the file specified by `fd`.
   * @param buffer The buffer that the data will be
   *   written to.
   * @param offset The offset within the buffer where writing will
   *   start.
   * @param length An integer specifying the number of bytes to read.
   * @param position An integer specifying where to begin reading from
   *   in the file. If position is null, data will be read from the current file
   *   position.
   * @param callback The number is the number of bytes read
   */
  public read(fd: number, length: number, position: number | null, encoding: string, cb?: BFSThreeArgCallback<string, number>): void;
  public read(fd: number, buffer: Buffer, offset: number, length: number, position: number | null, cb?: BFSThreeArgCallback<number, Buffer>): void;
  public read(fd: number, arg2: any, arg3: any, arg4: any, arg5?: any, cb: BFSThreeArgCallback<string, number> | BFSThreeArgCallback<number, Buffer> = nopCb): void {
    let position: number | null; let offset: number; let length: number; let buffer: Buffer; let newCb: BFSThreeArgCallback<number, Buffer>;
    if (typeof arg2 === 'number') {
      // legacy interface
      // (fd, length, position, encoding, callback)
      length = arg2;
      position = arg3;
      const encoding = arg4;
      cb = typeof arg5 === 'function' ? arg5 : cb;
      offset = 0;
      buffer = Buffer.alloc(length);
      // XXX: Inefficient.
      // Wrap the cb so we shelter upper layers of the API from these
      // shenanigans.
      newCb = wrapCb((err?: ApiError | null, bytesRead?: number, buf?: Buffer) => {
        if (err) {
          return (<Function> cb)(err);
        }
        (<BFSThreeArgCallback<string, number>> cb)(err, buf!.toString(encoding), bytesRead!);
      }, 3);
    } else {
      buffer = arg2;
      offset = arg3;
      length = arg4;
      position = arg5;
      newCb = wrapCb(<BFSThreeArgCallback<number, Buffer>> cb, 3);
    }

    try {
      const file = this.fd2file(fd);
      if (position === undefined || position === null) {
        position = file.getPos()!;
      }
      file.read(buffer, offset, length, position, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Read data from the file specified by `fd`.
   * @param fd
   * @param buffer The buffer that the data will be
   *   written to.
   * @param offset The offset within the buffer where writing will
   *   start.
   * @param length An integer specifying the number of bytes to read.
   * @param position An integer specifying where to begin reading from
   *   in the file. If position is null, data will be read from the current file
   *   position.
   * @return [Number]
   */
  public readSync(fd: number, length: number, position: number, encoding: string): string;
  public readSync(fd: number, buffer: Buffer, offset: number, length: number, position: number): number;
  public readSync(fd: number, arg2: any, arg3: any, arg4: any, arg5?: any): any {
    let shenanigans = false;
    let buffer: Buffer; let offset: number; let length: number; let position: number; let encoding: string = 'utf8';
    if (typeof arg2 === 'number') {
      length = arg2;
      position = arg3;
      encoding = arg4;
      offset = 0;
      buffer = Buffer.alloc(length);
      shenanigans = true;
    } else {
      buffer = arg2;
      offset = arg3;
      length = arg4;
      position = arg5;
    }
    const file = this.fd2file(fd);
    if (position === undefined || position === null) {
      position = file.getPos()!;
    }

    const rv = file.readSync(buffer, offset, length, position);
    if (!shenanigans) {
      return rv;
    }
    return [buffer.toString(encoding), rv];

  }

  /**
   * Asynchronous `fchown`.
   * @param fd
   * @param uid
   * @param gid
   * @param callback
   */
  public fchown(fd: number, uid: number, gid: number, callback: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(callback, 1);
    try {
      this.fd2file(fd).chown(uid, gid, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `fchown`.
   * @param fd
   * @param uid
   * @param gid
   */
  public fchownSync(fd: number, uid: number, gid: number): void {
    this.fd2file(fd).chownSync(uid, gid);
  }

  /**
   * Asynchronous `fchmod`.
   * @param fd
   * @param mode
   * @param callback
   */
  public fchmod(fd: number, mode: string | number, cb: BFSOneArgCallback): void {
    const newCb = wrapCb(cb, 1);
    try {
      const numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
      this.fd2file(fd).chmod(numMode, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `fchmod`.
   * @param fd
   * @param mode
   */
  public fchmodSync(fd: number, mode: number | string): void {
    const numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
    this.fd2file(fd).chmodSync(numMode);
  }

  /**
   * Change the file timestamps of a file referenced by the supplied file
   * descriptor.
   * @param fd
   * @param atime
   * @param mtime
   * @param callback
   */
  public futimes(fd: number, atime: number | Date, mtime: number | Date, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      const file = this.fd2file(fd);
      if (typeof atime === 'number') {
        atime = new Date(atime * 1000);
      }
      if (typeof mtime === 'number') {
        mtime = new Date(mtime * 1000);
      }
      file.utimes(atime, mtime, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Change the file timestamps of a file referenced by the supplied file
   * descriptor.
   * @param fd
   * @param atime
   * @param mtime
   */
  public futimesSync(fd: number, atime: number | Date, mtime: number | Date): void {
    this.fd2file(fd).utimesSync(normalizeTime(atime), normalizeTime(mtime));
  }

  // DIRECTORY-ONLY METHODS

  /**
   * Asynchronous `rmdir`.
   * @param path
   * @param callback
   */
  public rmdir(path: string, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      path = normalizePath(path);

      setImmediate(() => {
        this.fileWatcher.triggerWatch(path, 'rename');
      });
      assertRoot(this.root).rmdir(path, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `rmdir`.
   * @param path
   */
  public rmdirSync(path: string): void {
    path = normalizePath(path);

    setImmediate(() => {
      this.fileWatcher.triggerWatch(path, 'rename');
    });
    return assertRoot(this.root).rmdirSync(path);
  }

  /**
   * Asynchronous `mkdir`.
   * @param path
   * @param mode defaults to `0777`
   * @param callback
   */
  public mkdir(path: string, mode?: any, cb: BFSOneArgCallback = nopCb): void {
    if (typeof mode === 'function') {
      cb = mode;
      mode = 0x1ff;
    }
    const newCb = wrapCb(cb, 1);
    try {
      path = normalizePath(path);
      setImmediate(() => {
        this.fileWatcher.triggerWatch(path, 'rename');
      });
      assertRoot(this.root).mkdir(path, mode, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `mkdir`.
   * @param path
   * @param mode defaults to `0777`
   */
  public mkdirSync(path: string, mode?: number | string): void {
    setImmediate(() => {
      this.fileWatcher.triggerWatch(path, 'rename');
    });
    assertRoot(this.root).mkdirSync(normalizePath(path), normalizeMode(mode, 0x1ff));
  }

  /**
   * Asynchronous `readdir`. Reads the contents of a directory.
   * The callback gets two arguments `(err, files)` where `files` is an array of
   * the names of the files in the directory excluding `'.'` and `'..'`.
   * @param path
   * @param callback
   */
  public readdir(path: string, cb: BFSCallback<string[]> = nopCb): void {
    const newCb = <(err: ApiError, files?: string[]) => void> wrapCb(cb, 2);
    try {
      path = normalizePath(path);
      assertRoot(this.root).readdir(path, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `readdir`. Reads the contents of a directory.
   * @param path
   * @return [String[]]
   */
  public readdirSync(path: string): string[] {
    path = normalizePath(path);
    return assertRoot(this.root).readdirSync(path);
  }

  // SYMLINK METHODS

  /**
   * Asynchronous `link`.
   * @param srcpath
   * @param dstpath
   * @param callback
   */
  public link(srcpath: string, dstpath: string, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      srcpath = normalizePath(srcpath);
      dstpath = normalizePath(dstpath);
      assertRoot(this.root).link(srcpath, dstpath, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `link`.
   * @param srcpath
   * @param dstpath
   */
  public linkSync(srcpath: string, dstpath: string): void {
    srcpath = normalizePath(srcpath);
    dstpath = normalizePath(dstpath);
    return assertRoot(this.root).linkSync(srcpath, dstpath);
  }

  /**
   * Asynchronous `symlink`.
   * @param srcpath
   * @param dstpath
   * @param type can be either `'dir'` or `'file'` (default is `'file'`)
   * @param callback
   */
  public symlink(srcpath: string, dstpath: string, cb?: BFSOneArgCallback): void;
  public symlink(srcpath: string, dstpath: string, type?: string, cb?: BFSOneArgCallback): void;
  public symlink(srcpath: string, dstpath: string, arg3?: any, cb: BFSOneArgCallback = nopCb): void {
    const type = typeof arg3 === 'string' ? arg3 : 'file';
    cb = typeof arg3 === 'function' ? arg3 : cb;
    const newCb = wrapCb(cb, 1);
    try {
      if (type !== 'file' && type !== 'dir') {
        return newCb(new ApiError(ErrorCode.EINVAL, "Invalid type: " + type));
      }
      srcpath = normalizePath(srcpath);
      dstpath = normalizePath(dstpath);
      assertRoot(this.root).symlink(srcpath, dstpath, type, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `symlink`.
   * @param srcpath
   * @param dstpath
   * @param type can be either `'dir'` or `'file'` (default is `'file'`)
   */
  public symlinkSync(srcpath: string, dstpath: string, type?: string): void {
    if (!type) {
      type = 'file';
    } else if (type !== 'file' && type !== 'dir') {
      throw new ApiError(ErrorCode.EINVAL, "Invalid type: " + type);
    }
    srcpath = normalizePath(srcpath);
    dstpath = normalizePath(dstpath);
    return assertRoot(this.root).symlinkSync(srcpath, dstpath, type);
  }

  /**
   * Asynchronous readlink.
   * @param path
   * @param callback
   */
  public readlink(path: string, cb: BFSCallback<string> = nopCb): void {
    const newCb = wrapCb(cb, 2);
    try {
      path = normalizePath(path);
      assertRoot(this.root).readlink(path, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous readlink.
   * @param path
   * @return [String]
   */
  public readlinkSync(path: string): string {
    path = normalizePath(path);
    return assertRoot(this.root).readlinkSync(path);
  }

  // PROPERTY OPERATIONS

  /**
   * Asynchronous `chown`.
   * @param path
   * @param uid
   * @param gid
   * @param callback
   */
  public chown(path: string, uid: number, gid: number, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      path = normalizePath(path);
      assertRoot(this.root).chown(path, false, uid, gid, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `chown`.
   * @param path
   * @param uid
   * @param gid
   */
  public chownSync(path: string, uid: number, gid: number): void {
    path = normalizePath(path);
    assertRoot(this.root).chownSync(path, false, uid, gid);
  }

  /**
   * Asynchronous `lchown`.
   * @param path
   * @param uid
   * @param gid
   * @param callback
   */
  public lchown(path: string, uid: number, gid: number, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      path = normalizePath(path);
      assertRoot(this.root).chown(path, true, uid, gid, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `lchown`.
   * @param path
   * @param uid
   * @param gid
   */
  public lchownSync(path: string, uid: number, gid: number): void {
    path = normalizePath(path);
    assertRoot(this.root).chownSync(path, true, uid, gid);
  }

  /**
   * Asynchronous `chmod`.
   * @param path
   * @param mode
   * @param callback
   */
  public chmod(path: string, mode: number | string, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      const numMode = normalizeMode(mode, -1);
      if (numMode < 0) {
        throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
      }
      assertRoot(this.root).chmod(normalizePath(path), false, numMode, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `chmod`.
   * @param path
   * @param mode
   */
  public chmodSync(path: string, mode: string | number): void {
    const numMode = normalizeMode(mode, -1);
    if (numMode < 0) {
      throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
    }
    path = normalizePath(path);
    assertRoot(this.root).chmodSync(path, false, numMode);
  }

  /**
   * Asynchronous `lchmod`.
   * @param path
   * @param mode
   * @param callback
   */
  public lchmod(path: string, mode: number | string, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      const numMode = normalizeMode(mode, -1);
      if (numMode < 0) {
        throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
      }
      assertRoot(this.root).chmod(normalizePath(path), true, numMode, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `lchmod`.
   * @param path
   * @param mode
   */
  public lchmodSync(path: string, mode: number | string): void {
    const numMode = normalizeMode(mode, -1);
    if (numMode < 1) {
      throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
    }
    assertRoot(this.root).chmodSync(normalizePath(path), true, numMode);
  }

  /**
   * Change file timestamps of the file referenced by the supplied path.
   * @param path
   * @param atime
   * @param mtime
   * @param callback
   */
  public utimes(path: string, atime: number | Date, mtime: number | Date, cb: BFSOneArgCallback = nopCb): void {
    const newCb = wrapCb(cb, 1);
    try {
      assertRoot(this.root).utimes(normalizePath(path), normalizeTime(atime), normalizeTime(mtime), newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Change file timestamps of the file referenced by the supplied path.
   * @param path
   * @param atime
   * @param mtime
   */
  public utimesSync(path: string, atime: number | Date, mtime: number | Date): void {
    assertRoot(this.root).utimesSync(normalizePath(path), normalizeTime(atime), normalizeTime(mtime));
  }

  /**
   * Asynchronous `realpath`. The callback gets two arguments
   * `(err, resolvedPath)`. May use `process.cwd` to resolve relative paths.
   *
   * @example Usage example
   *   let cache = {'/etc':'/private/etc'};
   *   fs.realpath('/etc/passwd', cache, function (err, resolvedPath) {
   *     if (err) throw err;
   *     console.log(resolvedPath);
   *   });
   *
   * @param path
   * @param cache An object literal of mapped paths that can be used to
   *   force a specific path resolution or avoid additional `fs.stat` calls for
   *   known real paths.
   * @param callback
   */
  public realpath(path: string, cb?: BFSCallback<string>): void;
  public realpath(path: string, cache: { [path: string]: string }, cb: BFSCallback<string>): void;
  public realpath(path: string, arg2?: any, cb: BFSCallback<string> = nopCb): void {
    const cache = typeof (arg2) === 'object' ? arg2 : {};
    cb = typeof (arg2) === 'function' ? arg2 : nopCb;
    const newCb = <(err: ApiError, resolvedPath?: string) => any> wrapCb(cb, 2);
    try {
      path = normalizePath(path);
      assertRoot(this.root).realpath(path, cache, newCb);
    } catch (e) {
      newCb(e);
    }
  }

  /**
   * Synchronous `realpath`.
   * @param path
   * @param cache An object literal of mapped paths that can be used to
   *   force a specific path resolution or avoid additional `fs.stat` calls for
   *   known real paths.
   * @return [String]
   */
  public realpathSync(path: string, cache: { [path: string]: string } = {}): string {
    path = normalizePath(path);
    return assertRoot(this.root).realpathSync(path, cache);
  }

  public watchFile(filename: string, listener: (curr: Stats, prev: Stats) => void): void;
  public watchFile(filename: string, options: { persistent?: boolean; interval?: number; }, listener: (curr: Stats, prev: Stats) => void): void;
  public watchFile(filename: string, arg2: any, listener: (curr: Stats, prev: Stats) => void = nopCb): void {
    this.stat(filename, (err, stat) => {
      let usedStat = stat;
      if (err) {
        usedStat = new Stats(FileType.FILE, 0, undefined, 0, 0, 0, 0)
      }

      this.fileWatcher.watchFile(usedStat!, filename, arg2, listener);
    });
  }

  public unwatchFile(filename: string, listener: (curr: Stats, prev: Stats) => void = nopCb): void {
    this.fileWatcher.unwatchFile(filename, listener);
  }

  public watch(filename: string, listener?: (event: string, filename: string) => any): _fs.FSWatcher;
  public watch(filename: string, options: { persistent?: boolean; }, listener?: (event: string, filename: string) => any): _fs.FSWatcher;
  public watch(filename: string, arg2: any, listener: (event: string, filename: string) => any = nopCb): _fs.FSWatcher {
    return this.fileWatcher.watch(filename, arg2, listener);
  }

  public access(path: string, callback: (err: ApiError) => void): void;
  public access(path: string, mode: number, callback: (err: ApiError) => void): void;
  public access(path: string, arg2: any, cb: (e: ApiError) => void = nopCb): void {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  public accessSync(path: string, mode?: number): void {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  public createReadStream(path: string, options?: {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
  }): _fs.ReadStream {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  public createWriteStream(path: string, options?: {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
  }): _fs.WriteStream {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  /**
   * For unit testing. Passes all incoming callbacks to cbWrapper for wrapping.
   */
  public wrapCallbacks(cbWrapper: (cb: Function, args: number) => Function) {
    wrapCbHook = <any> cbWrapper;
  }

  private getFdForFile(file: File): number {
    const fd = this.nextFd++;
    this.fdMap[fd] = file;
    return fd;
  }

  private fd2file(fd: number): File {
    const rv = this.fdMap[fd];
    if (rv) {
      return rv;
    }
    throw new ApiError(ErrorCode.EBADF, 'Invalid file descriptor.');

  }

  private closeFd(fd: number): void {
    delete this.fdMap[fd];
  }
}

export interface FSModule extends FS {
  /**
   * The FS constructor.
   */
  FS: typeof FS;
  /**
   * The FS.Stats constructor.
   */
  Stats: typeof Stats;
  /**
   * Retrieve the FS object backing the fs module.
   */
  getFSModule(): FS;
  /**
   * Set the FS object backing the fs module.
   */
  changeFSModule(newFs: FS): void;

  /**
   * Accessors
   */
  F_OK: number;
  R_OK: number;
  W_OK: number;
  X_OK: number;
}
