/**
 * Defines an Emscripten file system object for use in the Emscripten virtual
 * filesystem. Allows you to use synchronous BrowserFS file systems from within
 * Emscripten.
 *
 * You can construct a BFSEmscriptenFS, mount it using its mount command,
 * and then mount it into Emscripten.
 *
 * Adapted from Emscripten's NodeFS:
 * https://raw.github.com/kripken/emscripten/master/src/library_nodefs.js
 */
import FS from '../core/FS';
import fs from '../core/node_fs';
import NodeStats from '../core/node_fs_stats';
import {uint8Array2Buffer} from '../core/util';

export interface Stats {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  timestamp?: number;
}

export interface EmscriptenFSNode {
  name: string;
  mode: number;
  parent: EmscriptenFSNode;
  mount: {opts: {root: string}};
  stream_ops: EmscriptenStreamOps;
  node_ops: EmscriptenNodeOps;
}

export interface EmscriptenStream {
  node: EmscriptenFSNode;
  nfd: any;
  flags: string;
  position: number;
}

export interface EmscriptenNodeOps {
  getattr(node: EmscriptenFSNode): Stats;
  setattr(node: EmscriptenFSNode, attr: Stats): void;
  lookup(parent: EmscriptenFSNode, name: string): EmscriptenFSNode;
  mknod(parent: EmscriptenFSNode, name: string, mode: number, dev: any): EmscriptenFSNode;
  rename(oldNode: EmscriptenFSNode, newDir: EmscriptenFSNode, newName: string): void;
  unlink(parent: EmscriptenFSNode, name: string): void;
  rmdir(parent: EmscriptenFSNode, name: string): void;
  readdir(node: EmscriptenFSNode): string[];
  symlink(parent: EmscriptenFSNode, newName: string, oldPath: string): void;
  readlink(node: EmscriptenFSNode): string;
}

export interface EmscriptenStreamOps {
  open(stream: EmscriptenStream): void;
  close(stream: EmscriptenStream): void;
  read(stream: EmscriptenStream, buffer: Uint8Array, offset: number, length: number, position: number): number;
  write(stream: EmscriptenStream, buffer: Uint8Array, offset: number, length: number, position: number): number;
  llseek(stream: EmscriptenStream, offset: number, whence: number): number;
}

export interface EmscriptenFS {
  node_ops: EmscriptenNodeOps;
  stream_ops: EmscriptenStreamOps;
  mount(mount: {opts: {root: string}}): EmscriptenFSNode;
  createNode(parent: EmscriptenFSNode, name: string, mode: number, dev?: any): EmscriptenFSNode;
  getMode(path: string): number;
  realPath(node: EmscriptenFSNode): string;
}

class BFSEmscriptenStreamOps implements EmscriptenStreamOps {
  public PATH: any;
  private FS: any;
  private ERRNO_CODES: any;
  private nodefs: FS;

  constructor(private fs: BFSEmscriptenFS) {
    this.nodefs = fs.getNodeFS();
    this.FS = fs.getFS();
    this.PATH = fs.getPATH();
    this.ERRNO_CODES = fs.getERRNO_CODES();
  }

  public open(stream: EmscriptenStream): void {
    const path = this.fs.realPath(stream.node);
    const FS = this.FS;
    try {
      if (FS.isFile(stream.node.mode)) {
        stream.nfd = this.nodefs.openSync(path, this.fs.flagsToPermissionString(stream.flags));
      }
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public close(stream: EmscriptenStream): void {
    const FS = this.FS;
    try {
      if (FS.isFile(stream.node.mode) && stream.nfd) {
        this.nodefs.closeSync(stream.nfd);
      }
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public read(stream: EmscriptenStream, buffer: Uint8Array, offset: number, length: number, position: number): number {
    // Avoid copying overhead by reading directly into buffer.
    try {
      return this.nodefs.readSync(stream.nfd, uint8Array2Buffer(buffer), offset, length, position);
    } catch (e) {
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public write(stream: EmscriptenStream, buffer: Uint8Array, offset: number, length: number, position: number): number {
    // Avoid copying overhead.
    try {
      return this.nodefs.writeSync(stream.nfd, uint8Array2Buffer(buffer), offset, length, position);
    } catch (e) {
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public llseek(stream: EmscriptenStream, offset: number, whence: number): number {
    let position = offset;
    if (whence === 1) {  // SEEK_CUR.
      position += stream.position;
    } else if (whence === 2) {  // SEEK_END.
      if (this.FS.isFile(stream.node.mode)) {
        try {
          const stat = this.nodefs.fstatSync(stream.nfd);
          position += stat.size;
        } catch (e) {
          throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
        }
      }
    }

    if (position < 0) {
      throw new this.FS.ErrnoError(this.ERRNO_CODES.EINVAL);
    }

    stream.position = position;
    return position;
  }
}

class BFSEmscriptenNodeOps implements EmscriptenNodeOps {
  private FS: any;
  private PATH: any;
  private ERRNO_CODES: any;
  private nodefs: FS;

  constructor(private fs: BFSEmscriptenFS) {
    this.nodefs = fs.getNodeFS();
    this.FS = fs.getFS();
    this.PATH = fs.getPATH();
    this.ERRNO_CODES = fs.getERRNO_CODES();
  }

  public getattr(node: EmscriptenFSNode): Stats {
    const path = this.fs.realPath(node);
    let stat: NodeStats;
    try {
      stat = this.nodefs.lstatSync(path);
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
    return {
      dev: stat.dev,
      ino: stat.ino,
      mode: stat.mode,
      nlink: stat.nlink,
      uid: stat.uid,
      gid: stat.gid,
      rdev: stat.rdev,
      size: stat.size,
      atime: stat.atime,
      mtime: stat.mtime,
      ctime: stat.ctime,
      blksize: stat.blksize,
      blocks: stat.blocks
    };
  }

  public setattr(node: EmscriptenFSNode, attr: Stats): void {
    const path = this.fs.realPath(node);
    try {
      if (attr.mode !== undefined) {
        this.nodefs.chmodSync(path, attr.mode);
        // update the common node structure mode as well
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        const date = new Date(attr.timestamp);
        this.nodefs.utimesSync(path, date, date);
      }
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      // Ignore not supported errors. Emscripten does utimesSync when it
      // writes files, but never really requires the value to be set.
      if (e.code !== "ENOTSUP") {
        throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
      }
    }
    if (attr.size !== undefined) {
      try {
        this.nodefs.truncateSync(path, attr.size);
      } catch (e) {
        if (!e.code) {
          throw e;
        }
        throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
      }
    }
  }

  public lookup(parent: EmscriptenFSNode, name: string): EmscriptenFSNode {
    const path = this.PATH.join2(this.fs.realPath(parent), name);
    const mode = this.fs.getMode(path);
    return this.fs.createNode(parent, name, mode);
  }

  public mknod(parent: EmscriptenFSNode, name: string, mode: number, dev: any): EmscriptenFSNode {
    const node = this.fs.createNode(parent, name, mode, dev);
    // create the backing node for this in the fs root as well
    const path = this.fs.realPath(node);
    try {
      if (this.FS.isDir(node.mode)) {
        this.nodefs.mkdirSync(path, node.mode);
      } else {
        this.nodefs.writeFileSync(path, '', { mode: node.mode });
      }
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
    return node;
  }

  public rename(oldNode: EmscriptenFSNode, newDir: EmscriptenFSNode, newName: string): void {
    const oldPath = this.fs.realPath(oldNode);
    const newPath = this.PATH.join2(this.fs.realPath(newDir), newName);
    try {
      this.nodefs.renameSync(oldPath, newPath);
      // This logic is missing from the original NodeFS,
      // causing Emscripten's filesystem to think that the old file still exists.
      oldNode.name = newName;
      oldNode.parent = newDir;
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public unlink(parent: EmscriptenFSNode, name: string): void {
    const path = this.PATH.join2(this.fs.realPath(parent), name);
    try {
      this.nodefs.unlinkSync(path);
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public rmdir(parent: EmscriptenFSNode, name: string) {
    const path = this.PATH.join2(this.fs.realPath(parent), name);
    try {
      this.nodefs.rmdirSync(path);
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public readdir(node: EmscriptenFSNode): string[] {
    const path = this.fs.realPath(node);
    try {
      // Node does not list . and .. in directory listings,
      // but Emscripten expects it.
      const contents = this.nodefs.readdirSync(path);
      contents.push('.', '..');
      return contents;
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public symlink(parent: EmscriptenFSNode, newName: string, oldPath: string): void {
    const newPath = this.PATH.join2(this.fs.realPath(parent), newName);
    try {
      this.nodefs.symlinkSync(oldPath, newPath);
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }

  public readlink(node: EmscriptenFSNode): string {
    const path = this.fs.realPath(node);
    try {
      return this.nodefs.readlinkSync(path);
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
  }
}

export default class BFSEmscriptenFS implements EmscriptenFS {
  // This maps the integer permission modes from http://linux.die.net/man/3/open
  // to node.js-specific file open permission strings at http://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback
  public flagsToPermissionStringMap = {
    0/*O_RDONLY*/: 'r',
    1/*O_WRONLY*/: 'r+',
    2/*O_RDWR*/: 'r+',
    64/*O_CREAT*/: 'r',
    65/*O_WRONLY|O_CREAT*/: 'r+',
    66/*O_RDWR|O_CREAT*/: 'r+',
    129/*O_WRONLY|O_EXCL*/: 'rx+',
    193/*O_WRONLY|O_CREAT|O_EXCL*/: 'rx+',
    514/*O_RDWR|O_TRUNC*/: 'w+',
    577/*O_WRONLY|O_CREAT|O_TRUNC*/: 'w',
    578/*O_CREAT|O_RDWR|O_TRUNC*/: 'w+',
    705/*O_WRONLY|O_CREAT|O_EXCL|O_TRUNC*/: 'wx',
    706/*O_RDWR|O_CREAT|O_EXCL|O_TRUNC*/: 'wx+',
    1024/*O_APPEND*/: 'a',
    1025/*O_WRONLY|O_APPEND*/: 'a',
    1026/*O_RDWR|O_APPEND*/: 'a+',
    1089/*O_WRONLY|O_CREAT|O_APPEND*/: 'a',
    1090/*O_RDWR|O_CREAT|O_APPEND*/: 'a+',
    1153/*O_WRONLY|O_EXCL|O_APPEND*/: 'ax',
    1154/*O_RDWR|O_EXCL|O_APPEND*/: 'ax+',
    1217/*O_WRONLY|O_CREAT|O_EXCL|O_APPEND*/: 'ax',
    1218/*O_RDWR|O_CREAT|O_EXCL|O_APPEND*/: 'ax+',
    4096/*O_RDONLY|O_DSYNC*/: 'rs',
    4098/*O_RDWR|O_DSYNC*/: 'rs+'
  };
  /* tslint:disable:variable-name */
  public node_ops: EmscriptenNodeOps;
  public stream_ops: EmscriptenStreamOps;
  /* tslint:enable:variable-name */

  private FS: any;
  private PATH: any;
  private ERRNO_CODES: any;
  private nodefs: FS;
  constructor(_FS = (<any> self)['FS'], _PATH = (<any> self)['PATH'], _ERRNO_CODES = (<any> self)['ERRNO_CODES'], nodefs: FS = fs) {
    this.nodefs = nodefs;
    this.FS = _FS;
    this.PATH = _PATH;
    this.ERRNO_CODES = _ERRNO_CODES;
    this.node_ops = new BFSEmscriptenNodeOps(this);
    this.stream_ops = new BFSEmscriptenStreamOps(this);
  }

  public mount(m: {opts: {root: string}}): EmscriptenFSNode {
    return this.createNode(null, '/', this.getMode(m.opts.root), 0);
  }

  public createNode(parent: EmscriptenFSNode | null, name: string, mode: number, dev?: any): EmscriptenFSNode {
    const FS = this.FS;
    if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
      throw new FS.ErrnoError(this.ERRNO_CODES.EINVAL);
    }
    const node = FS.createNode(parent, name, mode);
    node.node_ops = this.node_ops;
    node.stream_ops = this.stream_ops;
    return node;
  }

  public getMode(path: string): number {
    let stat: NodeStats;
    try {
      stat = this.nodefs.lstatSync(path);
    } catch (e) {
      if (!e.code) {
        throw e;
      }
      throw new this.FS.ErrnoError(this.ERRNO_CODES[e.code]);
    }
    return stat.mode;
  }

  public realPath(node: EmscriptenFSNode): string {
    const parts: string[] = [];
    while (node.parent !== node) {
      parts.push(node.name);
      node = node.parent;
    }
    parts.push(node.mount.opts.root);
    parts.reverse();
    return this.PATH.join.apply(null, parts);
  }

  public flagsToPermissionString(flags: string | number): string {
    let parsedFlags = (typeof flags === "string") ? parseInt(flags, 10) : flags;
    parsedFlags &= 0x1FFF;
    if (parsedFlags in this.flagsToPermissionStringMap) {
      return (<any> this.flagsToPermissionStringMap)[parsedFlags];
    } else {
      return <string> flags;
    }
  }

  public getNodeFS() {
    return this.nodefs;
  }

  public getFS() {
    return this.FS;
  }

  public getPATH() {
    return this.PATH;
  }

  public getERRNO_CODES() {
    return this.ERRNO_CODES;
  }
}
