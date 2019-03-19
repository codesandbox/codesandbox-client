import {FileSystem, BaseFileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions} from '../core/file_system';
import {ApiError, ErrorCode} from '../core/api_error';
import {FileFlag, ActionType} from '../core/file_flag';
import {File} from '../core/file';
import {default as Stats} from '../core/node_fs_stats';
import PreloadFile from '../generic/preload_file';
import LockedFS from '../generic/locked_fs';
import * as path from 'path';
/**
 * @hidden
 */
const deletionLogPath = '/.deletedFiles.log';

/**
 * Given a read-only mode, makes it writable.
 * @hidden
 */
function makeModeWritable(mode: number): number {
  return 0o222 | mode;
}

/**
 * @hidden
 */
function getFlag(f: string): FileFlag {
  return FileFlag.getFileFlag(f);
}

/**
 * Overlays a RO file to make it writable.
 */
class OverlayFile extends PreloadFile<UnlockedOverlayFS> implements File {
  constructor(fs: UnlockedOverlayFS, path: string, flag: FileFlag, stats: Stats, data: Buffer) {
    super(fs, path, flag, stats, data);
  }

  public sync(cb: BFSOneArgCallback): void {
    if (!this.isDirty()) {
      cb(null);
      return;
    }

    this._fs._syncAsync(this, (err: ApiError) => {
      this.resetDirty();
      cb(err);
    });
  }

  public syncSync(): void {
    if (this.isDirty()) {
      this._fs._syncSync(this);
      this.resetDirty();
    }
  }

  public close(cb: BFSOneArgCallback): void {
    this.sync(cb);
  }

  public closeSync(): void {
    this.syncSync();
  }
}

/**
 * *INTERNAL, DO NOT USE DIRECTLY!*
 *
 * Core OverlayFS class that contains no locking whatsoever. We wrap these objects
 * in a LockedFS to prevent races.
 */
export class UnlockedOverlayFS extends BaseFileSystem implements FileSystem {
  public static isAvailable(): boolean {
    return true;
  }

  private _writable: FileSystem;
  private _readable: FileSystem;
  private _isInitialized: boolean = false;
  private _initializeCallbacks: (BFSOneArgCallback)[] = [];
  private _deletedFiles: {[path: string]: boolean} = {};
  private _deleteLog: string = '';
  // If 'true', we have scheduled a delete log update.
  private _deleteLogUpdatePending: boolean = false;
  // If 'true', a delete log update is needed after the scheduled delete log
  // update finishes.
  private _deleteLogUpdateNeeded: boolean = false;
  // If there was an error updating the delete log...
  private _deleteLogError: ApiError | null = null;

  constructor(writable: FileSystem, readable: FileSystem) {
    super();
    this._writable = writable;
    this._readable = readable;
    if (this._writable.isReadOnly()) {
      throw new ApiError(ErrorCode.EINVAL, "Writable file system must be writable.");
    }
  }

  public getOverlayedFileSystems(): { readable: FileSystem; writable: FileSystem; } {
    return {
      readable: this._readable,
      writable: this._writable
    };
  }

  public _syncAsync(file: PreloadFile<UnlockedOverlayFS>, cb: BFSOneArgCallback): void {
    this.createParentDirectoriesAsync(file.getPath(), (err?: ApiError) => {
      if (err) {
        return cb(err);
      }
      this._writable.writeFile(file.getPath(), file.getBuffer(), null, getFlag('w'), file.getStats().mode, cb);
    });
  }

  public _syncSync(file: PreloadFile<UnlockedOverlayFS>): void {
    this.createParentDirectories(file.getPath());
    this._writable.writeFileSync(file.getPath(), file.getBuffer(), null, getFlag('w'), file.getStats().mode);
  }

  public getName() {
    return OverlayFS.Name;
  }

  /**
   * **INTERNAL METHOD**
   *
   * Called once to load up metadata stored on the writable file system.
   */
  public _initialize(cb: BFSOneArgCallback): void {
    const callbackArray = this._initializeCallbacks;

    const end = (e?: ApiError): void => {
      this._isInitialized = !e;
      this._initializeCallbacks = [];
      callbackArray.forEach(((cb) => cb(e)));
    };

    // if we're already initialized, immediately invoke the callback
    if (this._isInitialized) {
      return cb();
    }

    callbackArray.push(cb);
    // The first call to initialize initializes, the rest wait for it to complete.
    if (callbackArray.length !== 1) {
      return;
    }

    // Read deletion log, process into metadata.
    this._writable.readFile(deletionLogPath, 'utf8', getFlag('r'), (err: ApiError, data?: string) => {
      if (err) {
        // ENOENT === Newly-instantiated file system, and thus empty log.
        if (err.errno !== ErrorCode.ENOENT) {
          return end(err);
        }
      } else {
        this._deleteLog = data!;
      }
      this._reparseDeletionLog();
      end();
    });
  }

  public isReadOnly(): boolean { return false; }
  public supportsSynch(): boolean { return this._readable.supportsSynch() && this._writable.supportsSynch(); }
  public supportsLinks(): boolean { return false; }
  public supportsProps(): boolean { return this._readable.supportsProps() && this._writable.supportsProps(); }

  public getDeletionLog(): string {
    return this._deleteLog;
  }

  public restoreDeletionLog(log: string): void {
    this._deleteLog = log;
    this._reparseDeletionLog();
    this.updateLog('');
  }

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    if (!this.checkInitAsync(cb) || this.checkPathAsync(oldPath, cb) || this.checkPathAsync(newPath, cb)) {
      return;
    }

    if (oldPath === deletionLogPath || newPath === deletionLogPath) {
      return cb(ApiError.EPERM('Cannot rename deletion log.'));
    }

    // nothing to do if paths match
    if (oldPath === newPath) {
      return cb();
    }

    this.stat(oldPath, false, (oldErr: ApiError, oldStats?: Stats) => {
      if (oldErr) {
        return cb(oldErr);
      }

      return this.stat(newPath, false, (newErr: ApiError, newStats?: Stats) => {
        const self = this;
        // precondition: both oldPath and newPath exist and are dirs.
        // decreases: |files|
        // Need to move *every file/folder* currently stored on
        // readable to its new location on writable.
        function copyDirContents(files: string[]): void {
          const file = files.shift();
          if (!file) {
            return cb();
          }

          const oldFile = path.resolve(oldPath, file);
          const newFile = path.resolve(newPath, file);

          // Recursion! Should work for any nested files / folders.
          self.rename(oldFile, newFile, (err?: ApiError) => {
            if (err) {
              return cb(err);
            }
            copyDirContents(files);
          });
        }

        let mode = 0o777;

        // from linux's rename(2) manpage: oldpath can specify a
        // directory.  In this case, newpath must either not exist, or
        // it must specify an empty directory.
        if (oldStats!.isDirectory()) {
          if (newErr) {
            if (newErr.errno !== ErrorCode.ENOENT) {
              return cb(newErr);
            }

            return this._writable.exists(oldPath, (exists: boolean) => {
              // simple case - both old and new are on the writable layer
              if (exists) {
                return this._writable.rename(oldPath, newPath, cb);
              }

              this._writable.mkdir(newPath, mode, (mkdirErr?: ApiError) => {
                if (mkdirErr) {
                  return cb(mkdirErr);
                }

                this._readable.readdir(oldPath, (err: ApiError, files?: string[]) => {
                  if (err) {
                    return cb();
                  }
                  copyDirContents(files!);
                });
              });
            });
          }

          mode = newStats!.mode;
          if (!newStats!.isDirectory()) {
            return cb(ApiError.ENOTDIR(newPath));
          }

          this.readdir(newPath, (readdirErr: ApiError, files?: string[]) => {
            if (files && files.length) {
              return cb(ApiError.ENOTEMPTY(newPath));
            }

            this._readable.readdir(oldPath, (err: ApiError, files?: string[]) => {
              if (err) {
                return cb();
              }
              copyDirContents(files!);
            });
          });
        }

        if (newStats && newStats.isDirectory()) {
          return cb(ApiError.EISDIR(newPath));
        }

        this.readFile(oldPath, null, getFlag('r'), (err: ApiError, data?: any) => {
          if (err) {
            return cb(err);
          }

          return this.writeFile(newPath, data, null, getFlag('w'), oldStats!.mode, (err: ApiError) => {
            if (err) {
              return cb(err);
            }
            return this.unlink(oldPath, cb);
          });
        });
      });
    });
  }

  public renameSync(oldPath: string, newPath: string): void {
    this.checkInitialized();
    this.checkPath(oldPath);
    this.checkPath(newPath);
    if (oldPath === deletionLogPath || newPath === deletionLogPath) {
      throw ApiError.EPERM('Cannot rename deletion log.');
    }
    // Write newPath using oldPath's contents, delete oldPath.
    const oldStats = this.statSync(oldPath, false);
    if (oldStats.isDirectory()) {
      // Optimization: Don't bother moving if old === new.
      if (oldPath === newPath) {
        return;
      }

      let mode = 0o777;
      if (this.existsSync(newPath)) {
        const stats = this.statSync(newPath, false);
        mode = stats.mode;
        if (stats.isDirectory()) {
          if (this.readdirSync(newPath).length > 0) {
            throw ApiError.ENOTEMPTY(newPath);
          }
        } else {
          throw ApiError.ENOTDIR(newPath);
        }
      }

      // Take care of writable first. Move any files there, or create an empty directory
      // if it doesn't exist.
      if (this._writable.existsSync(oldPath)) {
        this._writable.renameSync(oldPath, newPath);
      } else if (!this._writable.existsSync(newPath)) {
        this._writable.mkdirSync(newPath, mode);
      }

      // Need to move *every file/folder* currently stored on readable to its new location
      // on writable.
      if (this._readable.existsSync(oldPath)) {
        this._readable.readdirSync(oldPath).forEach((name) => {
          // Recursion! Should work for any nested files / folders.
          this.renameSync(path.resolve(oldPath, name), path.resolve(newPath, name));
        });
      }
    } else {
      if (this.existsSync(newPath) && this.statSync(newPath, false).isDirectory()) {
        throw ApiError.EISDIR(newPath);
      }

      this.writeFileSync(newPath,
        this.readFileSync(oldPath, null, getFlag('r')), null, getFlag('w'), oldStats.mode);
    }

    if (oldPath !== newPath && this.existsSync(oldPath)) {
      this.unlinkSync(oldPath);
    }
  }

  public stat(p: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }
    this._writable.stat(p, isLstat, (err: ApiError, stat?: Stats) => {
      if (err && err.errno === ErrorCode.ENOENT) {
        if (this._deletedFiles[p]) {
          cb(ApiError.ENOENT(p));
        }
        this._readable.stat(p, isLstat, (err: ApiError, stat?: Stats) => {
          if (stat) {
            // Make the oldStat's mode writable. Preserve the topmost
            // part of the mode, which specifies if it is a file or a
            // directory.
            stat = Stats.clone(stat);
            stat.mode = makeModeWritable(stat.mode);
          }
          cb(err, stat);
        });
      } else {
        cb(err, stat);
      }
    });
  }

  public statSync(p: string, isLstat: boolean): Stats {
    this.checkInitialized();
    try {
      return this._writable.statSync(p, isLstat);
    } catch (e) {
      if (this._deletedFiles[p]) {
        throw ApiError.ENOENT(p);
      }
      const oldStat = Stats.clone(this._readable.statSync(p, isLstat));
      // Make the oldStat's mode writable. Preserve the topmost part of the
      // mode, which specifies if it is a file or a directory.
      oldStat.mode = makeModeWritable(oldStat.mode);
      return oldStat;
    }
  }

  public open(p: string, flag: FileFlag, mode: number, cb: BFSCallback<File>): void {
    if (!this.checkInitAsync(cb) || this.checkPathAsync(p, cb)) {
      return;
    }
    this.stat(p, false, (err: ApiError, stats?: Stats) => {
      if (stats) {
        switch (flag.pathExistsAction()) {
        case ActionType.TRUNCATE_FILE:
          return this.createParentDirectoriesAsync(p, (err?: ApiError) => {
            if (err) {
              return cb(err);
            }
            this._writable.open(p, flag, mode, cb);
          });
        case ActionType.NOP:
          return this._writable.exists(p, (exists: boolean) => {
            if (exists) {
              this._writable.open(p, flag, mode, cb);
            } else {
              // at this point we know the stats object we got is from
              // the readable FS.
              stats = Stats.clone(stats!);
              stats.mode = mode;
              this._readable.readFile(p, null, getFlag('r'), (readFileErr: ApiError, data?: any) => {
                if (readFileErr) {
                  return cb(readFileErr);
                }
                if (stats!.size === -1) {
                  stats!.size = data.length;
                }
                const f = new OverlayFile(this, p, flag, stats!, data);
                cb(null, f);
              });
            }
          });
        default:
          return cb(ApiError.EEXIST(p));
        }
      } else {
        switch (flag.pathNotExistsAction()) {
        case ActionType.CREATE_FILE:
          return this.createParentDirectoriesAsync(p, (err?: ApiError) => {
            if (err) {
              return cb(err);
            }
            return this._writable.open(p, flag, mode, cb);
          });
        default:
          return cb(ApiError.ENOENT(p));
        }
      }
    });
  }

  public openSync(p: string, flag: FileFlag, mode: number): File {
    this.checkInitialized();
    this.checkPath(p);
    if (p === deletionLogPath) {
      throw ApiError.EPERM('Cannot open deletion log.');
    }
    if (this.existsSync(p)) {
      switch (flag.pathExistsAction()) {
        case ActionType.TRUNCATE_FILE:
          this.createParentDirectories(p);
          return this._writable.openSync(p, flag, mode);
        case ActionType.NOP:
          if (this._writable.existsSync(p)) {
            return this._writable.openSync(p, flag, mode);
          } else {
            // Create an OverlayFile.
            const buf = this._readable.readFileSync(p, null, getFlag('r'));
            const stats = Stats.clone(this._readable.statSync(p, false));
            stats.mode = mode;
            return new OverlayFile(this, p, flag, stats, buf);
          }
        default:
          throw ApiError.EEXIST(p);
      }
    } else {
      switch (flag.pathNotExistsAction()) {
        case ActionType.CREATE_FILE:
          this.createParentDirectories(p);
          return this._writable.openSync(p, flag, mode);
        default:
          throw ApiError.ENOENT(p);
      }
    }
  }

  public unlink(p: string, cb: BFSOneArgCallback): void {
    if (!this.checkInitAsync(cb) || this.checkPathAsync(p, cb)) {
      return;
    }
    this.exists(p, (exists: boolean) => {
      if (!exists) {
        return cb(ApiError.ENOENT(p));
      }

      this._writable.exists(p, (writableExists: boolean) => {
        if (writableExists) {
          return this._writable.unlink(p, (err: ApiError) => {
            if (err) {
              return cb(err);
            }

            this.exists(p, (readableExists: boolean) => {
              if (readableExists) {
                this.deletePath(p);
              }
              cb(null);
            });
          });
        } else {
          // if this only exists on the readable FS, add it to the
          // delete map.
          this.deletePath(p);
          cb(null);
        }
      });
    });
  }

  public unlinkSync(p: string): void {
    this.checkInitialized();
    this.checkPath(p);
    if (this.existsSync(p)) {
      if (this._writable.existsSync(p)) {
        this._writable.unlinkSync(p);
      }

      // if it still exists add to the delete log
      if (this.existsSync(p)) {
        this.deletePath(p);
      }
    } else {
      throw ApiError.ENOENT(p);
    }
  }

  public rmdir(p: string, cb: BFSOneArgCallback): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }

    const rmdirLower = (): void => {
      this.readdir(p, (err: ApiError, files: string[]): void => {
        if (err) {
          return cb(err);
        }

        if (files.length) {
          return cb(ApiError.ENOTEMPTY(p));
        }

        this.deletePath(p);
        cb(null);
      });
    };

    this.exists(p, (exists: boolean) => {
      if (!exists) {
        return cb(ApiError.ENOENT(p));
      }

      this._writable.exists(p, (writableExists: boolean) => {
        if (writableExists) {
          this._writable.rmdir(p, (err: ApiError) => {
            if (err) {
              return cb(err);
            }

            this._readable.exists(p, (readableExists: boolean) => {
              if (readableExists) {
                rmdirLower();
              } else {
                cb();
              }
            });
          });
        } else {
          rmdirLower();
        }
      });
    });
  }

  public rmdirSync(p: string): void {
    this.checkInitialized();
    if (this.existsSync(p)) {
      if (this._writable.existsSync(p)) {
        this._writable.rmdirSync(p);
      }
      if (this.existsSync(p)) {
        // Check if directory is empty.
        if (this.readdirSync(p).length > 0) {
          throw ApiError.ENOTEMPTY(p);
        } else {
          this.deletePath(p);
        }
      }
    } else {
      throw ApiError.ENOENT(p);
    }
  }

  public mkdir(p: string, mode: number, cb: BFSCallback<Stats>): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }
    this.exists(p, (exists: boolean) => {
      if (exists) {
        return cb(ApiError.EEXIST(p));
      }

      // The below will throw should any of the parent directories
      // fail to exist on _writable.
      this.createParentDirectoriesAsync(p, (err: ApiError) => {
        if (err) {
          return cb(err);
        }
        this._writable.mkdir(p, mode, cb);
      });
    });
  }

  public mkdirSync(p: string, mode: number): void {
    this.checkInitialized();
    if (this.existsSync(p)) {
      throw ApiError.EEXIST(p);
    } else {
      // The below will throw should any of the parent directories fail to exist
      // on _writable.
      this.createParentDirectories(p);
      this._writable.mkdirSync(p, mode);
    }
  }

  public readdir(p: string, cb: BFSCallback<string[]>): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }
    this.stat(p, false, (err: ApiError, dirStats?: Stats) => {
      if (err) {
        return cb(err);
      }

      if (!dirStats!.isDirectory()) {
        return cb(ApiError.ENOTDIR(p));
      }

      this._writable.readdir(p, (err: ApiError, wFiles: string[]) => {
        if (err && err.code !== 'ENOENT') {
          return cb(err);
        } else if (err || !wFiles) {
          wFiles = [];
        }

        this._readable.readdir(p, (err: ApiError, rFiles: string[]) => {
          // if the directory doesn't exist on the lower FS set rFiles
          // here to simplify the following code.
          if (err || !rFiles) {
            rFiles = [];
          }

          // Readdir in both, check delete log on read-only file system's files, merge, return.
          const seenMap: {[name: string]: boolean} = {};
          const filtered: string[] = wFiles.concat(rFiles.filter((fPath: string) =>
            !this._deletedFiles[`${p}/${fPath}`]
          )).filter((fPath: string) => {
            // Remove duplicates.
            const result = !seenMap[fPath];
            seenMap[fPath] = true;
            return result;
          });
          cb(null, filtered);
        });
      });
    });
  }

  public readdirSync(p: string): string[] {
    this.checkInitialized();
    const dirStats = this.statSync(p, false);
    if (!dirStats.isDirectory()) {
      throw ApiError.ENOTDIR(p);
    }

    // Readdir in both, check delete log on RO file system's listing, merge, return.
    let contents: string[] = [];
    try {
      contents = contents.concat(this._writable.readdirSync(p));
    } catch (e) {
      // NOP.
    }
    try {
      contents = contents.concat(this._readable.readdirSync(p).filter((fPath: string) =>
        !this._deletedFiles[`${p}/${fPath}`]
      ));
    } catch (e) {
      // NOP.
    }
    const seenMap: {[name: string]: boolean} = {};
    return contents.filter((fileP: string) => {
      const result = !seenMap[fileP];
      seenMap[fileP] = true;
      return result;
    });
  }

  public exists(p: string, cb: (exists: boolean) => void): void {
    // Cannot pass an error back to callback, so throw an exception instead
    // if not initialized.
    this.checkInitialized();
    this._writable.exists(p, (existsWritable: boolean) => {
      if (existsWritable) {
        return cb(true);
      }

      this._readable.exists(p, (existsReadable: boolean) => {
        cb(existsReadable && this._deletedFiles[p] !== true);
      });
    });
  }

  public existsSync(p: string): boolean {
    this.checkInitialized();
    return this._writable.existsSync(p) || (this._readable.existsSync(p) && this._deletedFiles[p] !== true);
  }

  public chmod(p: string, isLchmod: boolean, mode: number, cb: BFSOneArgCallback): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }
    this.operateOnWritableAsync(p, (err?: ApiError) => {
      if (err) {
        return cb(err);
      } else {
        this._writable.chmod(p, isLchmod, mode, cb);
      }
    });
  }

  public chmodSync(p: string, isLchmod: boolean, mode: number): void {
    this.checkInitialized();
    this.operateOnWritable(p, () => {
      this._writable.chmodSync(p, isLchmod, mode);
    });
  }

  public chown(p: string, isLchmod: boolean, uid: number, gid: number, cb: BFSOneArgCallback): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }
    this.operateOnWritableAsync(p, (err?: ApiError) => {
      if (err) {
        return cb(err);
      } else {
        this._writable.chown(p, isLchmod, uid, gid, cb);
      }
    });
  }

  public chownSync(p: string, isLchown: boolean, uid: number, gid: number): void {
    this.checkInitialized();
    this.operateOnWritable(p, () => {
      this._writable.chownSync(p, isLchown, uid, gid);
    });
  }

  public utimes(p: string, atime: Date, mtime: Date, cb: BFSOneArgCallback): void {
    if (!this.checkInitAsync(cb)) {
      return;
    }
    this.operateOnWritableAsync(p, (err?: ApiError) => {
      if (err) {
        return cb(err);
      } else {
        this._writable.utimes(p, atime, mtime, cb);
      }
    });
  }

  public utimesSync(p: string, atime: Date, mtime: Date): void {
    this.checkInitialized();
    this.operateOnWritable(p, () => {
      this._writable.utimesSync(p, atime, mtime);
    });
  }

  private deletePath(p: string): void {
    this._deletedFiles[p] = true;
    this.updateLog(`d${p}\n`);
  }

  private updateLog(addition: string) {
    this._deleteLog += addition;
    if (this._deleteLogUpdatePending) {
      this._deleteLogUpdateNeeded = true;
    } else {
      this._deleteLogUpdatePending = true;
      this._writable.writeFile(deletionLogPath, this._deleteLog, 'utf8', FileFlag.getFileFlag('w'), 0o644, (e) => {
        this._deleteLogUpdatePending = false;
        if (e) {
          this._deleteLogError = e;
        } else if (this._deleteLogUpdateNeeded) {
          this._deleteLogUpdateNeeded = false;
          this.updateLog('');
        }
      });
    }
  }

  private _reparseDeletionLog(): void {
    this._deletedFiles = {};
    this._deleteLog.split('\n').forEach((path: string) => {
      // If the log entry begins w/ 'd', it's a deletion.
      this._deletedFiles[path.slice(1)] = path.slice(0, 1) === 'd';
    });
  }

  private checkInitialized(): void {
    if (!this._isInitialized) {
      throw new ApiError(ErrorCode.EPERM, "OverlayFS is not initialized. Please initialize OverlayFS using its initialize() method before using it.");
    } else if (this._deleteLogError !== null) {
      const e = this._deleteLogError;
      this._deleteLogError = null;
      throw e;
    }
  }

  private checkInitAsync(cb: BFSOneArgCallback): boolean {
    if (!this._isInitialized) {
      cb(new ApiError(ErrorCode.EPERM, "OverlayFS is not initialized. Please initialize OverlayFS using its initialize() method before using it."));
      return false;
    } else if (this._deleteLogError !== null) {
      const e = this._deleteLogError;
      this._deleteLogError = null;
      cb(e);
      return false;
    }
    return true;
  }

  private checkPath(p: string): void {
    if (p === deletionLogPath) {
      throw ApiError.EPERM(p);
    }
  }

  private checkPathAsync(p: string, cb: BFSOneArgCallback): boolean {
    if (p === deletionLogPath) {
      cb(ApiError.EPERM(p));
      return true;
    }
    return false;
  }

  private createParentDirectoriesAsync(p: string, cb: BFSOneArgCallback): void {
    let parent = path.dirname(p);
    const toCreate: string[] = [];
    const self = this;

    this._writable.stat(parent, false, statDone);
    function statDone(err: ApiError, stat?: Stats): void {
      if (err) {
        if (parent === "/") {
          cb(new ApiError(ErrorCode.EBUSY, "Invariant failed: root does not exist!"));
        } else {
          toCreate.push(parent);
          parent = path.dirname(parent);
          self._writable.stat(parent, false, statDone);
        }
      } else {
        createParents();
      }
    }

    function createParents(): void {
      if (!toCreate.length) {
        return cb();
      }

      const dir = toCreate.pop();
      self._readable.stat(dir!, false, (err: ApiError, stats?: Stats) => {
        // stop if we couldn't read the dir
        if (!stats) {
          return cb();
        }

        self._writable.mkdir(dir!, stats.mode, (err?: ApiError) => {
          if (err) {
            return cb(err);
          }
          createParents();
        });
      });
    }
  }

  /**
   * With the given path, create the needed parent directories on the writable storage
   * should they not exist. Use modes from the read-only storage.
   */
  private createParentDirectories(p: string): void {
    let parent = path.dirname(p), toCreate: string[] = [];
    while (!this._writable.existsSync(parent)) {
      toCreate.push(parent);
      parent = path.dirname(parent);
    }
    toCreate = toCreate.reverse();

    toCreate.forEach((p: string) => {
      this._writable.mkdirSync(p, this.statSync(p, false).mode);
    });
  }

  /**
   * Helper function:
   * - Ensures p is on writable before proceeding. Throws an error if it doesn't exist.
   * - Calls f to perform operation on writable.
   */
  private operateOnWritable(p: string, f: () => void): void {
    if (this.existsSync(p)) {
      if (!this._writable.existsSync(p)) {
        // File is on readable storage. Copy to writable storage before
        // changing its mode.
        this.copyToWritable(p);
      }
      f();
    } else {
      throw ApiError.ENOENT(p);
    }
  }

  private operateOnWritableAsync(p: string, cb: BFSOneArgCallback): void {
    this.exists(p, (exists: boolean) => {
      if (!exists) {
        return cb(ApiError.ENOENT(p));
      }

      this._writable.exists(p, (existsWritable: boolean) => {
        if (existsWritable) {
          cb();
        } else {
          return this.copyToWritableAsync(p, cb);
        }
      });
    });
  }

  /**
   * Copy from readable to writable storage.
   * PRECONDITION: File does not exist on writable storage.
   */
  private copyToWritable(p: string): void {
    const pStats = this.statSync(p, false);
    if (pStats.isDirectory()) {
      this._writable.mkdirSync(p, pStats.mode);
    } else {
      this.writeFileSync(p,
        this._readable.readFileSync(p, null, getFlag('r')), null,
        getFlag('w'), this.statSync(p, false).mode);
    }
  }

  private copyToWritableAsync(p: string, cb: BFSOneArgCallback): void {
    this.stat(p, false, (err: ApiError, pStats?: Stats) => {
      if (err) {
        return cb(err);
      }

      if (pStats!.isDirectory()) {
        return this._writable.mkdir(p, pStats!.mode, cb);
      }

      // need to copy file.
      this._readable.readFile(p, null, getFlag('r'), (err: ApiError, data?: Buffer) => {
        if (err) {
          return cb(err);
        }

        this.writeFile(p, data, null, getFlag('w'), pStats!.mode, cb);
      });
    });
  }
}

/**
 * Configuration options for OverlayFS instances.
 */
export interface OverlayFSOptions {
  // The file system to write modified files to.
  writable: FileSystem;
  // The file system that initially populates this file system.
  readable: FileSystem;
}

/**
 * OverlayFS makes a read-only filesystem writable by storing writes on a second,
 * writable file system. Deletes are persisted via metadata stored on the writable
 * file system.
 */
export default class OverlayFS extends LockedFS<UnlockedOverlayFS> {
  public static readonly Name = "OverlayFS";

  public static readonly Options: FileSystemOptions = {
    writable: {
      type: "object",
      description: "The file system to write modified files to."
    },
    readable: {
      type: "object",
      description: "The file system that initially populates this file system."
    }
  };

  /**
   * Constructs and initializes an OverlayFS instance with the given options.
   */
  public static Create(opts: OverlayFSOptions, cb: BFSCallback<OverlayFS>): void {
    try {
      const fs = new OverlayFS(opts.writable, opts.readable);
      fs._initialize((e?) => {
        cb(e, fs);
      });
    } catch (e) {
      cb(e);
    }
  }
  public static isAvailable(): boolean {
    return UnlockedOverlayFS.isAvailable();
  }

  /**
   * @param writable The file system to write modified files to.
   * @param readable The file system that initially populates this file system.
   */
  constructor(writable: FileSystem, readable: FileSystem) {
    super(new UnlockedOverlayFS(writable, readable));
  }

  public getOverlayedFileSystems(): { readable: FileSystem; writable: FileSystem; } {
    return super.getFSUnlocked().getOverlayedFileSystems();
  }

  public unwrap(): UnlockedOverlayFS {
    return super.getFSUnlocked();
  }

  private _initialize(cb: BFSOneArgCallback): void {
    super.getFSUnlocked()._initialize(cb);
  }
}
