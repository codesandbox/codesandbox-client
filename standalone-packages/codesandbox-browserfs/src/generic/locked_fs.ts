import Mutex from './mutex';
import {FileSystem, BFSOneArgCallback, BFSCallback} from '../core/file_system';
import {ApiError} from '../core/api_error';
import {FileFlag} from '../core/file_flag';
import {default as Stats} from '../core/node_fs_stats';
import {File} from '../core/file';

/**
 * This class serializes access to an underlying async filesystem.
 * For example, on an OverlayFS instance with an async lower
 * directory operations like rename and rmdir may involve multiple
 * requests involving both the upper and lower filesystems -- they
 * are not executed in a single atomic step.  OverlayFS uses this
 * LockedFS to avoid having to reason about the correctness of
 * multiple requests interleaving.
 */
export default class LockedFS<T extends FileSystem> implements FileSystem {
  private _fs: T;
  private _mu: Mutex;

  constructor(fs: T) {
    this._fs = fs;
    this._mu = new Mutex();
  }

  public getName(): string {
    return 'LockedFS<' + this._fs.getName()  + '>';
  }

  public getFSUnlocked(): T {
    return this._fs;
  }

  public diskSpace(p: string, cb: (total: number, free: number) => any): void {
    // FIXME: should this lock?
    this._fs.diskSpace(p, cb);
  }

  public isReadOnly(): boolean {
    return this._fs.isReadOnly();
  }

  public supportsLinks(): boolean {
    return this._fs.supportsLinks();
  }

  public supportsProps(): boolean {
    return this._fs.supportsProps();
  }

  public supportsSynch(): boolean {
    return this._fs.supportsSynch();
  }

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.rename(oldPath, newPath, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public renameSync(oldPath: string, newPath: string): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.renameSync(oldPath, newPath);
  }

  public stat(p: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    this._mu.lock(() => {
      this._fs.stat(p, isLstat, (err?: ApiError, stat?: Stats) => {
        this._mu.unlock();
        cb(err, stat);
      });
    });
  }

  public statSync(p: string, isLstat: boolean): Stats {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.statSync(p, isLstat);
  }

  public open(p: string, flag: FileFlag, mode: number, cb: BFSCallback<File>): void {
    this._mu.lock(() => {
      this._fs.open(p, flag, mode, (err?: ApiError, fd?: File) => {
        this._mu.unlock();
        cb(err, fd);
      });
    });
  }

  public openSync(p: string, flag: FileFlag, mode: number): File {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.openSync(p, flag, mode);
  }

  public unlink(p: string, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.unlink(p, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public unlinkSync(p: string): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.unlinkSync(p);
  }

  public rmdir(p: string, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.rmdir(p, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public rmdirSync(p: string): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.rmdirSync(p);
  }

  public mkdir(p: string, mode: number, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.mkdir(p, mode, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public mkdirSync(p: string, mode: number): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.mkdirSync(p, mode);
  }

  public readdir(p: string, cb: BFSCallback<string[]>): void {
    this._mu.lock(() => {
      this._fs.readdir(p, (err?: ApiError, files?: string[]) => {
        this._mu.unlock();
        cb(err, files);
      });
    });
  }

  public readdirSync(p: string): string[] {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.readdirSync(p);
  }

  public exists(p: string, cb: (exists: boolean) => void): void {
    this._mu.lock(() => {
      this._fs.exists(p, (exists: boolean) => {
        this._mu.unlock();
        cb(exists);
      });
    });
  }

  public existsSync(p: string): boolean {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.existsSync(p);
  }

  public realpath(p: string, cache: {[path: string]: string}, cb: BFSCallback<string>): void {
    this._mu.lock(() => {
      this._fs.realpath(p, cache, (err?: ApiError, resolvedPath?: string) => {
        this._mu.unlock();
        cb(err, resolvedPath);
      });
    });
  }

  public realpathSync(p: string, cache: {[path: string]: string}): string {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.realpathSync(p, cache);
  }

  public truncate(p: string, len: number, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.truncate(p, len, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public truncateSync(p: string, len: number): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.truncateSync(p, len);
  }

  public readFile(fname: string, encoding: string, flag: FileFlag, cb: BFSCallback<string | Buffer>): void {
    this._mu.lock(() => {
      this._fs.readFile(fname, encoding, flag, (err?: ApiError, data?: any) => {
        this._mu.unlock();
        cb(err, data);
      });
    });
  }

  public readFileSync(fname: string, encoding: string, flag: FileFlag): any {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.readFileSync(fname, encoding, flag);
  }

  public writeFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.writeFile(fname, data, encoding, flag, mode, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public writeFileSync(fname: string, data: any, encoding: string, flag: FileFlag, mode: number): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.writeFileSync(fname, data, encoding, flag, mode);
  }

  public appendFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.appendFile(fname, data, encoding, flag, mode, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public appendFileSync(fname: string, data: any, encoding: string, flag: FileFlag, mode: number): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.appendFileSync(fname, data, encoding, flag, mode);
  }

  public chmod(p: string, isLchmod: boolean, mode: number, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.chmod(p, isLchmod, mode, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public chmodSync(p: string, isLchmod: boolean, mode: number): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.chmodSync(p, isLchmod, mode);
  }

  public chown(p: string, isLchown: boolean, uid: number, gid: number, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.chown(p, isLchown, uid, gid, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public chownSync(p: string, isLchown: boolean, uid: number, gid: number): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.chownSync(p, isLchown, uid, gid);
  }

  public utimes(p: string, atime: Date, mtime: Date, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.utimes(p, atime, mtime, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public utimesSync(p: string, atime: Date, mtime: Date): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.utimesSync(p, atime, mtime);
  }

  public link(srcpath: string, dstpath: string, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.link(srcpath, dstpath, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public linkSync(srcpath: string, dstpath: string): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.linkSync(srcpath, dstpath);
  }

  public symlink(srcpath: string, dstpath: string, type: string, cb: BFSOneArgCallback): void {
    this._mu.lock(() => {
      this._fs.symlink(srcpath, dstpath, type, (err?: ApiError) => {
        this._mu.unlock();
        cb(err);
      });
    });
  }

  public symlinkSync(srcpath: string, dstpath: string, type: string): void {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.symlinkSync(srcpath, dstpath, type);
  }

  public readlink(p: string, cb: BFSCallback<string>): void {
    this._mu.lock(() => {
      this._fs.readlink(p, (err?: ApiError, linkString?: string) => {
        this._mu.unlock();
        cb(err, linkString);
      });
    });
  }

  public readlinkSync(p: string): string {
    if (this._mu.isLocked()) {
      throw new Error('invalid sync call');
    }
    return this._fs.readlinkSync(p);
  }
}
