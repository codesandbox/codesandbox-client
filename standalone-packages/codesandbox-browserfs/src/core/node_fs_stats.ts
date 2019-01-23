import * as fs from 'fs';

/**
 * Indicates the type of the given file. Applied to 'mode'.
 */
export enum FileType {
  FILE = 0x8000,
  DIRECTORY = 0x4000,
  SYMLINK = 0xA000
}

/**
 * Emulation of Node's `fs.Stats` object.
 *
 * Attribute descriptions are from `man 2 stat'
 * @see http://nodejs.org/api/fs.html#fs_class_fs_stats
 * @see http://man7.org/linux/man-pages/man2/stat.2.html
 */
export default class Stats implements fs.Stats {
  public static fromBuffer(buffer: Buffer): Stats {
    const size = buffer.readUInt32LE(0),
      mode = buffer.readUInt32LE(4),
      atime = buffer.readDoubleLE(8),
      mtime = buffer.readDoubleLE(16),
      ctime = buffer.readDoubleLE(24);

    return new Stats(mode & 0xF000, size, mode & 0xFFF, new Date(atime), new Date(mtime), new Date(ctime));
  }

  public blocks: number;
  public mode: number;
  /**
   * UNSUPPORTED ATTRIBUTES
   * I assume no one is going to need these details, although we could fake
   * appropriate values if need be.
   */
  // ID of device containing file
  public dev: number = 0;
  // inode number
  public ino: number = 0;
  // device ID (if special file)
  public rdev: number = 0;
  // number of hard links
  public nlink: number = 1;
  // blocksize for file system I/O
  public blksize: number = 4096;
  // @todo Maybe support these? atm, it's a one-user filesystem.
  // user ID of owner
  public uid: number = 0;
  // group ID of owner
  public gid: number = 0;
  // time file was created (currently unsupported)
  public birthtime: Date = new Date(0);
  // XXX: Some file systems stash data on stats objects.
  public fileData: Buffer | null= null;

  /**
   * Provides information about a particular entry in the file system.
   * @param [Number] item_type type of the item (FILE, DIRECTORY, SYMLINK, or SOCKET)
   * @param [Number] size Size of the item in bytes. For directories/symlinks,
   *   this is normally the size of the struct that represents the item.
   * @param [Number] mode Unix-style file mode (e.g. 0o644)
   * @param [Date?] atime time of last access
   * @param [Date?] mtime time of last modification
   * @param [Date?] ctime time of creation
   */
  constructor(
    itemType: FileType,
    public size: number,
    mode?: number,
    public atime: Date = new Date(),
    public mtime: Date = new Date(),
    public ctime: Date = new Date()) {
    if (!mode) {
      switch (itemType) {
        case FileType.FILE:
          this.mode = 0x1a4;
          break;
        case FileType.DIRECTORY:
        default:
          this.mode = 0x1ff;
      }
    } else {
      this.mode = mode;
    }
    // number of 512B blocks allocated
    this.blocks = Math.ceil(size / 512);
    // Check if mode also includes top-most bits, which indicate the file's
    // type.
    if (this.mode < 0x1000) {
      this.mode |= itemType;
    }
  }

  public toBuffer(): Buffer {
    const buffer = Buffer.alloc(32);
    buffer.writeUInt32LE(this.size, 0);
    buffer.writeUInt32LE(this.mode, 4);
    buffer.writeDoubleLE(this.atime.getTime(), 8);
    buffer.writeDoubleLE(this.mtime.getTime(), 16);
    buffer.writeDoubleLE(this.ctime.getTime(), 24);
    return buffer;
  }

  /**
   * **Nonstandard**: Clone the stats object.
   * @return [BrowserFS.node.fs.Stats]
   */
  public clone(): Stats {
    return new Stats(this.mode & 0xF000, this.size, this.mode & 0xFFF, this.atime, this.mtime, this.ctime);
  }

  /**
   * @return [Boolean] True if this item is a file.
   */
  public isFile(): boolean {
    return (this.mode & 0xF000) === FileType.FILE;
  }

  /**
   * @return [Boolean] True if this item is a directory.
   */
  public isDirectory(): boolean {
    return (this.mode & 0xF000) === FileType.DIRECTORY;
  }

  /**
   * @return [Boolean] True if this item is a symbolic link (only valid through lstat)
   */
  public isSymbolicLink(): boolean {
    return (this.mode & 0xF000) === FileType.SYMLINK;
  }

  /**
   * Change the mode of the file. We use this helper function to prevent messing
   * up the type of the file, which is encoded in mode.
   */
  public chmod(mode: number): void {
    this.mode = (this.mode & 0xF000) | mode;
  }

  // We don't support the following types of files.

  public isSocket(): boolean {
    return false;
  }

  public isBlockDevice(): boolean {
    return false;
  }

  public isCharacterDevice(): boolean {
    return false;
  }

  public isFIFO(): boolean {
    return false;
  }
}
