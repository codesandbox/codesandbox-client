import {SynchronousFileSystem, BFSOneArgCallback, BFSCallback, BFSThreeArgCallback, FileSystemOptions} from '../core/file_system';
import {default as Stats, FileType} from '../core/node_fs_stats';
import {FileFlag} from '../core/file_flag';
import {BaseFile, File} from '../core/file';
import {uint8Array2Buffer, buffer2Uint8array} from '../core/util';
import {ApiError, ErrorCode, ErrorStrings} from '../core/api_error';
import {EmscriptenFSNode} from '../generic/emscripten_fs';

/**
 * @hidden
 */
interface EmscriptenError {
  node: EmscriptenFSNode;
  errno: number;
}

/**
 * @hidden
 */
function convertError(e: EmscriptenError, path: string = ''): ApiError {
  const errno = e.errno;
  let parent = e.node;
  const paths: string[] = [];
  while (parent) {
    paths.unshift(parent.name);
    if (parent === parent.parent) {
      break;
    }
    parent = parent.parent;
  }
  return new ApiError(errno, ErrorStrings[errno], paths.length > 0 ? '/' + paths.join('/') : path);
}

export class EmscriptenFile extends BaseFile implements File {
  constructor(
    private _fs: EmscriptenFileSystem,
    private _FS: any,
    private _path: string,
    private _stream: any) {
    super();
  }
  public getPos(): number | undefined {
    return undefined;
  }
  public close(cb: BFSOneArgCallback): void {
    let err: ApiError | null = null;
    try {
      this.closeSync();
    } catch (e) {
      err = e;
    } finally {
      cb(err);
    }
  }
  public closeSync(): void {
    try {
      this._FS.close(this._stream);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public stat(cb: BFSCallback<Stats>): void {
    try {
      cb(null, this.statSync());
    } catch (e) {
      cb(e);
    }
  }
  public statSync(): Stats {
    try {
      return this._fs.statSync(this._path, false);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public truncate(len: number, cb: BFSOneArgCallback): void {
    let err: ApiError | null = null;
    try {
      this.truncateSync(len);
    } catch (e) {
      err = e;
    } finally {
      cb(err);
    }
  }
  public truncateSync(len: number): void {
    try {
      this._FS.ftruncate(this._stream.fd, len);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public write(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void {
    try {
      cb(null, this.writeSync(buffer, offset, length, position), buffer);
    } catch (e) {
      cb(e);
    }
  }
  public writeSync(buffer: Buffer, offset: number, length: number, position: number | null): number {
    try {
      const u8 = buffer2Uint8array(buffer);
      // Emscripten is particular about what position is set to.
      const emPosition = position === null ? undefined : position;
      return this._FS.write(this._stream, u8, offset, length, emPosition);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public read(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void {
    try {
      cb(null, this.readSync(buffer, offset, length, position), buffer);
    } catch (e) {
      cb(e);
    }
  }
  public readSync(buffer: Buffer, offset: number, length: number, position: number | null): number {
    try {
      const u8 = buffer2Uint8array(buffer);
      // Emscripten is particular about what position is set to.
      const emPosition = position === null ? undefined : position;
      return this._FS.read(this._stream, u8, offset, length, emPosition);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public sync(cb: BFSOneArgCallback): void {
    // NOP.
    cb();
  }
  public syncSync(): void {
    // NOP.
  }
  public chown(uid: number, gid: number, cb: BFSOneArgCallback): void {
    let err: ApiError | null = null;
    try {
      this.chownSync(uid, gid);
    } catch (e) {
      err = e;
    } finally {
      cb(err);
    }
  }
  public chownSync(uid: number, gid: number): void {
    try {
      this._FS.fchown(this._stream.fd, uid, gid);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public chmod(mode: number, cb: BFSOneArgCallback): void {
    let err: ApiError | null = null;
    try {
      this.chmodSync(mode);
    } catch (e) {
      err = e;
    } finally {
      cb(err);
    }
  }
  public chmodSync(mode: number): void {
    try {
      this._FS.fchmod(this._stream.fd, mode);
    } catch (e) {
      throw convertError(e, this._path);
    }
  }
  public utimes(atime: Date, mtime: Date, cb: BFSOneArgCallback): void {
    let err: ApiError | null = null;
    try {
      this.utimesSync(atime, mtime);
    } catch (e) {
      err = e;
    } finally {
      cb(err);
    }
  }
  public utimesSync(atime: Date, mtime: Date): void {
    this._fs.utimesSync(this._path, atime, mtime);
  }
}

/**
 * Configuration options for Emscripten file systems.
 */
export interface EmscriptenFileSystemOptions {
  // The Emscripten file system to use (`FS`)
  FS: any;
}

/**
 * Mounts an Emscripten file system into the BrowserFS file system.
 */
export default class EmscriptenFileSystem extends SynchronousFileSystem {
  public static readonly Name = "EmscriptenFileSystem";

  public static readonly Options: FileSystemOptions = {
    FS: {
      type: "object",
      description: "The Emscripten file system to use (the `FS` variable)"
    }
  };

  /**
   * Create an EmscriptenFileSystem instance with the given options.
   */
  public static Create(opts: EmscriptenFileSystemOptions, cb: BFSCallback<EmscriptenFileSystem>): void {
    cb(null, new EmscriptenFileSystem(opts.FS));
  }
  public static isAvailable(): boolean { return true; }

  private _FS: any;

  private constructor(_FS: any) {
    super();
    this._FS = _FS;
  }
  public getName(): string { return this._FS.DB_NAME(); }
  public isReadOnly(): boolean { return false; }
  public supportsLinks(): boolean { return true; }
  public supportsProps(): boolean { return true; }
  public supportsSynch(): boolean { return true; }

  public renameSync(oldPath: string, newPath: string): void {
    try {
      this._FS.rename(oldPath, newPath);
    } catch (e) {
      if (e.errno === ErrorCode.ENOENT) {
        throw convertError(e, this.existsSync(oldPath) ? newPath : oldPath);
      } else {
        throw convertError(e);
      }
    }
  }

  public statSync(p: string, isLstat: boolean): Stats {
    try {
      const stats = isLstat ? this._FS.lstat(p) : this._FS.stat(p);
      const itemType = this.modeToFileType(stats.mode);
      return new Stats(
        itemType,
        stats.size,
        stats.mode,
        stats.atime.getTime(),
        stats.mtime.getTime(),
        stats.ctime.getTime()
      );
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public openSync(p: string, flag: FileFlag, mode: number): EmscriptenFile {
    try {
      const stream = this._FS.open(p, flag.getFlagString(), mode);
      if (this._FS.isDir(stream.node.mode)) {
        this._FS.close(stream);
        throw ApiError.EISDIR(p);
      }
      return new EmscriptenFile(this, this._FS, p, stream);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public unlinkSync(p: string): void {
    try {
      this._FS.unlink(p);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public rmdirSync(p: string): void {
    try {
      this._FS.rmdir(p);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public mkdirSync(p: string, mode: number): void {
    try {
      this._FS.mkdir(p, mode);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public readdirSync(p: string): string[] {
    try {
      // Emscripten returns items for '.' and '..'. Node does not.
      return this._FS.readdir(p).filter((p: string) => p !== '.' && p !== '..');
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public truncateSync(p: string, len: number): void {
    try {
      this._FS.truncate(p, len);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public readFileSync(p: string, encoding: string, flag: FileFlag): any {
    try {
      const data: Uint8Array = this._FS.readFile(p, { flags: flag.getFlagString() });
      const buff = uint8Array2Buffer(data);
      if (encoding) {
        return buff.toString(encoding);
      } else {
        return buff;
      }
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public writeFileSync(p: string, data: any, encoding: string, flag: FileFlag, mode: number): void {
    try {
      if (encoding) {
        data = Buffer.from(data, encoding);
      }
      const u8 = buffer2Uint8array(data);
      this._FS.writeFile(p, u8, { flags: flag.getFlagString(), encoding: 'binary' });
      this._FS.chmod(p, mode);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public chmodSync(p: string, isLchmod: boolean, mode: number) {
    try {
      isLchmod ? this._FS.lchmod(p, mode) : this._FS.chmod(p, mode);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public chownSync(p: string, isLchown: boolean, uid: number, gid: number): void {
    try {
      isLchown ? this._FS.lchown(p, uid, gid) : this._FS.chown(p, uid, gid);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public symlinkSync(srcpath: string, dstpath: string, type: string): void {
    try {
      this._FS.symlink(srcpath, dstpath);
    } catch (e) {
      throw convertError(e);
    }
  }

  public readlinkSync(p: string): string {
    try {
      return this._FS.readlink(p);
    } catch (e) {
      throw convertError(e, p);
    }
  }

  public utimesSync(p: string, atime: Date, mtime: Date): void {
    try {
      this._FS.utime(p, atime.getTime(), mtime.getTime());
    } catch (e) {
      throw convertError(e, p);
    }
  }

  private modeToFileType(mode: number): FileType {
    if (this._FS.isDir(mode)) {
      return FileType.DIRECTORY;
    } else if (this._FS.isFile(mode)) {
      return FileType.FILE;
    } else if (this._FS.isLink(mode)) {
      return FileType.SYMLINK;
    } else {
      throw ApiError.EPERM(`Invalid mode: ${mode}`);
    }
  }

}
