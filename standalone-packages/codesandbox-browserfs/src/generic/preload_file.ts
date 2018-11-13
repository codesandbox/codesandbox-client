import {BaseFile, File} from '../core/file';
import {FileSystem, BFSOneArgCallback, BFSCallback, BFSThreeArgCallback} from '../core/file_system';
import Stats from '../core/node_fs_stats';
import {FileFlag} from '../core/file_flag';
import {ApiError, ErrorCode} from '../core/api_error';
import fs from '../core/node_fs';
import {emptyBuffer} from '../core/util';

/**
 * An implementation of the File interface that operates on a file that is
 * completely in-memory. PreloadFiles are backed by a Buffer.
 *
 * This is also an abstract class, as it lacks an implementation of 'sync' and
 * 'close'. Each filesystem that wishes to use this file representation must
 * extend this class and implement those two methods.
 * @todo 'close' lever that disables functionality once closed.
 */
export default class PreloadFile<T extends FileSystem> extends BaseFile {
  protected _fs: T;
  private _pos: number = 0;
  private _path: string;
  private _stat: Stats;
  private _flag: FileFlag;
  private _buffer: Buffer;
  private _dirty: boolean = false;
  /**
   * Creates a file with the given path and, optionally, the given contents. Note
   * that, if contents is specified, it will be mutated by the file!
   * @param _fs The file system that created the file.
   * @param _path
   * @param _mode The mode that the file was opened using.
   *   Dictates permissions and where the file pointer starts.
   * @param _stat The stats object for the given file.
   *   PreloadFile will mutate this object. Note that this object must contain
   *   the appropriate mode that the file was opened as.
   * @param contents A buffer containing the entire
   *   contents of the file. PreloadFile will mutate this buffer. If not
   *   specified, we assume it is a new file.
   */
  constructor(_fs: T, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
    super();
    this._fs = _fs;
    this._path = _path;
    this._flag = _flag;
    this._stat = _stat;
    this._buffer = contents ? contents : emptyBuffer();
    // Note: This invariant is *not* maintained once the file starts getting
    // modified.
    // Note: Only actually matters if file is readable, as writeable modes may
    // truncate/append to file.
    if (this._stat.size !== this._buffer.length && this._flag.isReadable()) {
      throw new Error(`Invalid buffer: Buffer is ${this._buffer.length} long, yet Stats object specifies that file is ${this._stat.size} long.`);
    }
  }

  /**
   * NONSTANDARD: Get the underlying buffer for this file. !!DO NOT MUTATE!! Will mess up dirty tracking.
   */
  public getBuffer(): Buffer {
    return this._buffer;
  }

  /**
   * NONSTANDARD: Get underlying stats for this file. !!DO NOT MUTATE!!
   */
  public getStats(): Stats {
    return this._stat;
  }

  public getFlag(): FileFlag {
    return this._flag;
  }

  /**
   * Get the path to this file.
   * @return [String] The path to the file.
   */
  public getPath(): string {
    return this._path;
  }

  /**
   * Get the current file position.
   *
   * We emulate the following bug mentioned in the Node documentation:
   * > On Linux, positional writes don't work when the file is opened in append
   *   mode. The kernel ignores the position argument and always appends the data
   *   to the end of the file.
   * @return [Number] The current file position.
   */
  public getPos(): number {
    if (this._flag.isAppendable()) {
      return this._stat.size;
    }
    return this._pos;
  }

  /**
   * Advance the current file position by the indicated number of positions.
   * @param [Number] delta
   */
  public advancePos(delta: number): number {
    return this._pos += delta;
  }

  /**
   * Set the file position.
   * @param [Number] newPos
   */
  public setPos(newPos: number): number {
    return this._pos = newPos;
  }

  /**
   * **Core**: Asynchronous sync. Must be implemented by subclasses of this
   * class.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public sync(cb: BFSOneArgCallback): void {
    try {
      this.syncSync();
      cb();
    } catch (e) {
      cb(e);
    }
  }

  /**
   * **Core**: Synchronous sync.
   */
  public syncSync(): void {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  /**
   * **Core**: Asynchronous close. Must be implemented by subclasses of this
   * class.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public close(cb: BFSOneArgCallback): void {
    try {
      this.closeSync();
      cb();
    } catch (e) {
      cb(e);
    }
  }

  /**
   * **Core**: Synchronous close.
   */
  public closeSync(): void {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  /**
   * Asynchronous `stat`.
   * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] cb
   */
  public stat(cb: BFSCallback<Stats>): void {
    try {
      cb(null, Stats.clone(this._stat));
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Synchronous `stat`.
   */
  public statSync(): Stats {
    return Stats.clone(this._stat);
  }

  /**
   * Asynchronous truncate.
   * @param [Number] len
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public truncate(len: number, cb: BFSOneArgCallback): void {
    try {
      this.truncateSync(len);
      if (this._flag.isSynchronous() && !fs.getRootFS()!.supportsSynch()) {
        this.sync(cb);
      }
      cb();
    } catch (e) {
      return cb(e);
    }
  }

  /**
   * Synchronous truncate.
   * @param [Number] len
   */
  public truncateSync(len: number): void {
    this._dirty = true;
    if (!this._flag.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, 'File not opened with a writeable mode.');
    }
    this._stat.mtimeMs = Date.now();
    if (len > this._buffer.length) {
      const buf = Buffer.alloc(len - this._buffer.length, 0);
      // Write will set @_stat.size for us.
      this.writeSync(buf, 0, buf.length, this._buffer.length);
      if (this._flag.isSynchronous() && fs.getRootFS()!.supportsSynch()) {
        this.syncSync();
      }
      return;
    }
    this._stat.size = len;
    // Truncate buffer to 'len'.
    const newBuff = Buffer.alloc(len);
    this._buffer.copy(newBuff, 0, 0, len);
    this._buffer = newBuff;
    if (this._flag.isSynchronous() && fs.getRootFS()!.supportsSynch()) {
      this.syncSync();
    }
  }

  /**
   * Write buffer to the file.
   * Note that it is unsafe to use fs.write multiple times on the same file
   * without waiting for the callback.
   * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
   *  the file.
   * @param [Number] offset Offset in the buffer to start reading data from.
   * @param [Number] length The amount of bytes to write to the file.
   * @param [Number] position Offset from the beginning of the file where this
   *   data should be written. If position is null, the data will be written at
   *   the current position.
   * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)]
   *   cb The number specifies the number of bytes written into the file.
   */
  public write(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void {
    try {
      cb(null, this.writeSync(buffer, offset, length, position), buffer);
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Write buffer to the file.
   * Note that it is unsafe to use fs.writeSync multiple times on the same file
   * without waiting for the callback.
   * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
   *  the file.
   * @param [Number] offset Offset in the buffer to start reading data from.
   * @param [Number] length The amount of bytes to write to the file.
   * @param [Number] position Offset from the beginning of the file where this
   *   data should be written. If position is null, the data will be written at
   *   the current position.
   * @return [Number]
   */
  public writeSync(buffer: Buffer, offset: number, length: number, position: number): number {
    this._dirty = true;
    if (position === undefined || position === null) {
      position = this.getPos();
    }
    if (!this._flag.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, 'File not opened with a writeable mode.');
    }
    const endFp = position + length;
    if (endFp > this._stat.size) {
      this._stat.size = endFp;
      if (endFp > this._buffer.length) {
        // Extend the buffer!
        const newBuff = Buffer.alloc(endFp);
        this._buffer.copy(newBuff);
        this._buffer = newBuff;
      }
    }
    const len = buffer.copy(this._buffer, position, offset, offset + length);
    this._stat.mtimeMs = Date.now();
    if (this._flag.isSynchronous()) {
      this.syncSync();
      return len;
    }
    this.setPos(position + len);
    return len;
  }

  /**
   * Read data from the file.
   * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
   *   written to.
   * @param [Number] offset The offset within the buffer where writing will
   *   start.
   * @param [Number] length An integer specifying the number of bytes to read.
   * @param [Number] position An integer specifying where to begin reading from
   *   in the file. If position is null, data will be read from the current file
   *   position.
   * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)] cb The
   *   number is the number of bytes read
   */
  public read(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void {
    try {
      cb(null, this.readSync(buffer, offset, length, position), buffer);
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Read data from the file.
   * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
   *   written to.
   * @param [Number] offset The offset within the buffer where writing will
   *   start.
   * @param [Number] length An integer specifying the number of bytes to read.
   * @param [Number] position An integer specifying where to begin reading from
   *   in the file. If position is null, data will be read from the current file
   *   position.
   * @return [Number]
   */
  public readSync(buffer: Buffer, offset: number, length: number, position: number): number {
    if (!this._flag.isReadable()) {
      throw new ApiError(ErrorCode.EPERM, 'File not opened with a readable mode.');
    }
    if (position === undefined || position === null) {
      position = this.getPos();
    }
    const endRead = position + length;
    if (endRead > this._stat.size) {
      length = this._stat.size - position;
    }
    const rv = this._buffer.copy(buffer, offset, position, position + length);
    this._stat.atimeMs = Date.now();
    this._pos = position + length;
    return rv;
  }

  /**
   * Asynchronous `fchmod`.
   * @param [Number|String] mode
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public chmod(mode: number, cb: BFSOneArgCallback): void {
    try {
      this.chmodSync(mode);
      cb();
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Asynchronous `fchmod`.
   * @param [Number] mode
   */
  public chmodSync(mode: number): void {
    if (!this._fs.supportsProps()) {
      throw new ApiError(ErrorCode.ENOTSUP);
    }
    this._dirty = true;
    this._stat.chmod(mode);
    this.syncSync();
  }

  protected isDirty(): boolean {
    return this._dirty;
  }

  /**
   * Resets the dirty bit. Should only be called after a sync has completed successfully.
   */
  protected resetDirty() {
    this._dirty = false;
  }
}

/**
 * File class for the InMemory and XHR file systems.
 * Doesn't sync to anything, so it works nicely for memory-only files.
 */
export class NoSyncFile<T extends FileSystem> extends PreloadFile<T> implements File {
  constructor(_fs: T, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
    super(_fs, _path, _flag, _stat, contents);
  }
  /**
   * Asynchronous sync. Doesn't do anything, simply calls the cb.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public sync(cb: BFSOneArgCallback): void {
    cb();
  }
  /**
   * Synchronous sync. Doesn't do anything.
   */
  public syncSync(): void {
    // NOP.
  }
  /**
   * Asynchronous close. Doesn't do anything, simply calls the cb.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public close(cb: BFSOneArgCallback): void {
    cb();
  }
  /**
   * Synchronous close. Doesn't do anything.
   */
  public closeSync(): void {
    // NOP.
  }
}
