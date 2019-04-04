import {FileSystem, BaseFileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions} from '../core/file_system';
import InMemoryFileSystem from './InMemory';
import {ApiError, ErrorCode} from '../core/api_error';
import fs from '../core/node_fs';
import * as path from 'path';
import {mkdirpSync} from '../core/util';

/**
 * Configuration options for the MountableFileSystem backend.
 */
export interface MountableFileSystemOptions {
  // Locations of mount points. Can be empty.
  [mountPoint: string]: FileSystem;
}

/**
 * The MountableFileSystem allows you to mount multiple backend types or
 * multiple instantiations of the same backend into a single file system tree.
 * The file systems do not need to know about each other; all interactions are
 * automatically facilitated through this interface.
 *
 * For example, if a file system is mounted at /mnt/blah, and a request came in
 * for /mnt/blah/foo.txt, the file system would see a request for /foo.txt.
 *
 * You can mount file systems when you configure the file system:
 * ```javascript
 * BrowserFS.configure({
 *   fs: "MountableFileSystem",
 *   options: {
 *     '/data': { fs: 'HTTPRequest', options: { index: "http://mysite.com/files/index.json" } },
 *     '/home': { fs: 'LocalStorage' }
 *   }
 * }, function(e) {
 *
 * });
 * ```
 *
 * For advanced users, you can also mount file systems *after* MFS is constructed:
 * ```javascript
 * BrowserFS.FileSystem.HTTPRequest.Create({
 *   index: "http://mysite.com/files/index.json"
 * }, function(e, xhrfs) {
 *   BrowserFS.FileSystem.MountableFileSystem.Create({
 *     '/data': xhrfs
 *   }, function(e, mfs) {
 *     BrowserFS.initialize(mfs);
 *
 *     // Added after-the-fact...
 *     BrowserFS.FileSystem.LocalStorage.Create(function(e, lsfs) {
 *       mfs.mount('/home', lsfs);
 *     });
 *   });
 * });
 * ```
 *
 * Since MountableFileSystem simply proxies requests to mounted file systems, it supports all of the operations that the mounted file systems support.
 *
 * With no mounted file systems, `MountableFileSystem` acts as a simple `InMemory` filesystem.
 */
export default class MountableFileSystem extends BaseFileSystem implements FileSystem {
  public static readonly Name = "MountableFileSystem";

  public static readonly Options: FileSystemOptions = {};

  /**
   * Creates a MountableFileSystem instance with the given options.
   */
  public static Create(opts: MountableFileSystemOptions, cb: BFSCallback<MountableFileSystem>): void {
    InMemoryFileSystem.Create({}, (e, imfs?) => {
      if (imfs) {
        const fs = new MountableFileSystem(imfs);
        try {
          Object.keys(opts).forEach((mountPoint) => {
            fs.mount(mountPoint, opts[mountPoint]);
          });
        } catch (e) {
          return cb(e);
        }
        cb(null, fs);
      } else {
        cb(e);
      }
    });
  }
  public static isAvailable(): boolean {
    return true;
  }

  private mntMap: {[path: string]: FileSystem};
  // Contains the list of mount points in mntMap, sorted by string length in decreasing order.
  // Ensures that we scan the most specific mount points for a match first, which lets us
  // nest mount points.
  private mountList: string[] = [];
  private rootFs: FileSystem;

  /**
   * Creates a new, empty MountableFileSystem.
   */
  private constructor(rootFs: FileSystem) {
    super();
    this.mntMap = {};
    this.rootFs = rootFs;
  }

  /**
   * Mounts the file system at the given mount point.
   */
  public mount(mountPoint: string, fs: FileSystem): void {
    if (mountPoint[0] !== '/') {
      mountPoint = `/${mountPoint}`;
    }
    mountPoint = path.resolve(mountPoint);
    if (this.mntMap[mountPoint]) {
      throw new ApiError(ErrorCode.EINVAL, "Mount point " + mountPoint + " is already taken.");
    }
    mkdirpSync(mountPoint, 0x1ff, this.rootFs);
    this.mntMap[mountPoint] = fs;
    this.mountList.push(mountPoint);
    this.mountList = this.mountList.sort((a, b) => b.length - a.length);
  }

  public umount(mountPoint: string): void {
    if (mountPoint[0] !== '/') {
      mountPoint = `/${mountPoint}`;
    }
    mountPoint = path.resolve(mountPoint);
    if (!this.mntMap[mountPoint]) {
      throw new ApiError(ErrorCode.EINVAL, "Mount point " + mountPoint + " is already unmounted.");
    }
    delete this.mntMap[mountPoint];
    this.mountList.splice(this.mountList.indexOf(mountPoint), 1);

    while (mountPoint !== '/') {
      if (this.rootFs.readdirSync(mountPoint).length === 0) {
        this.rootFs.rmdirSync(mountPoint);
        mountPoint = path.dirname(mountPoint);
      } else {
        break;
      }
    }
  }

  /**
   * Returns the file system that the path points to.
   */
  public _getFs(path: string): {fs: FileSystem; path: string, mountPoint: string} {
    const mountList = this.mountList, len = mountList.length;
    for (let i = 0; i < len; i++) {
      const mountPoint = mountList[i];
      // We know path is normalized, so it is a substring of the mount point.
      if (mountPoint.length <= path.length && path.indexOf(mountPoint) === 0) {
        path = path.substr(mountPoint.length > 1 ? mountPoint.length : 0);
        if (path === '') {
          path = '/';
        }
        return {fs: this.mntMap[mountPoint], path: path, mountPoint: mountPoint};
      }
    }
    // Query our root file system.
    return {fs: this.rootFs, path: path, mountPoint: '/'};
  }

  // Global information methods

  public getName(): string {
    return MountableFileSystem.Name;
  }

  public diskSpace(path: string, cb: (total: number, free: number) => void): void {
    cb(0, 0);
  }

  public isReadOnly(): boolean {
    return false;
  }

  public supportsLinks(): boolean {
    // I'm not ready for cross-FS links yet.
    return false;
  }

  public supportsProps(): boolean {
    return false;
  }

  public supportsSynch(): boolean {
    return true;
  }

  /**
   * Fixes up error messages so they mention the mounted file location relative
   * to the MFS root, not to the particular FS's root.
   * Mutates the input error, and returns it.
   */
  public standardizeError(err: ApiError, path: string, realPath: string): ApiError {
    const index = err.message.indexOf(path);
    if (index !== -1) {
      err.message = err.message.substr(0, index) + realPath + err.message.substr(index + path.length);
      err.path = realPath;
    }
    return err;
  }

  // The following methods involve multiple file systems, and thus have custom
  // logic.
  // Note that we go through the Node API to use its robust default argument
  // processing.

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    // Scenario 1: old and new are on same FS.
    const fs1rv = this._getFs(oldPath);
    const fs2rv = this._getFs(newPath);
    if (fs1rv.fs === fs2rv.fs) {
      return fs1rv.fs.rename(fs1rv.path, fs2rv.path, (e?: ApiError) => {
        if (e) {
          this.standardizeError(this.standardizeError(e, fs1rv.path, oldPath), fs2rv.path, newPath);
        }
        cb(e);
      });
    }

    // Scenario 2: Different file systems.
    // Read old file, write new file, delete old file.
    return fs.readFile(oldPath, function(err: ApiError, data?: any) {
      if (err) {
        return cb(err);
      }
      fs.writeFile(newPath, data, function(err: ApiError) {
        if (err) {
          return cb(err);
        }
        fs.unlink(oldPath, cb);
      });
    });
  }

  public renameSync(oldPath: string, newPath: string): void {
    // Scenario 1: old and new are on same FS.
    const fs1rv = this._getFs(oldPath);
    const fs2rv = this._getFs(newPath);
    if (fs1rv.fs === fs2rv.fs) {
      try {
        return fs1rv.fs.renameSync(fs1rv.path, fs2rv.path);
      } catch (e) {
        this.standardizeError(this.standardizeError(e, fs1rv.path, oldPath), fs2rv.path, newPath);
        throw e;
      }
    }
    // Scenario 2: Different file systems.
    const data = fs.readFileSync(oldPath);
    fs.writeFileSync(newPath, data);
    return fs.unlinkSync(oldPath);
  }

  public readdirSync(p: string): string[] {
    const fsInfo = this._getFs(p);

    // If null, rootfs did not have the directory
    // (or the target FS is the root fs).
    let rv: string[] | null = null;
    // Mount points are all defined in the root FS.
    // Ensure that we list those, too.
    if (fsInfo.fs !== this.rootFs) {
      try {
        rv = this.rootFs.readdirSync(p);
      } catch (e) {
        // Ignore.
      }
    }

    try {
      const rv2 = fsInfo.fs.readdirSync(fsInfo.path);
      if (rv === null) {
        return rv2;
      } else {
        // Filter out duplicates.
        return rv2.concat(rv.filter((val) => rv2.indexOf(val) === -1));
      }
    } catch (e) {
      if (rv === null) {
        throw this.standardizeError(e, fsInfo.path, p);
      } else {
        // The root FS had something.
        return rv;
      }
    }
  }

  public readdir(p: string, cb: BFSCallback<string[]>): void {
    const fsInfo = this._getFs(p);
    fsInfo.fs.readdir(fsInfo.path, (err, files) => {
      if (fsInfo.fs !== this.rootFs) {
        try {
          const rv = this.rootFs.readdirSync(p);
          if (files) {
            // Filter out duplicates.
            files = files.concat(rv.filter((val) => files!.indexOf(val) === -1));
          } else {
            files = rv;
          }
        } catch (e) {
          // Root FS and target FS did not have directory.
          if (err) {
            return cb(this.standardizeError(err, fsInfo.path, p));
          }
        }
      } else if (err) {
        // Root FS and target FS are the same, and did not have directory.
        return cb(this.standardizeError(err, fsInfo.path, p));
      }

      cb(null, files);
    });
  }

  public realpathSync(p: string, cache: {[path: string]: string}): string {
    const fsInfo = this._getFs(p);

    try {
      const mountedPath = fsInfo.fs.realpathSync(fsInfo.path, {});
      // resolve is there to remove any trailing slash that may be present
      return path.resolve(path.join(fsInfo.mountPoint, mountedPath));
    } catch (e) {
      throw this.standardizeError(e, fsInfo.path, p);
    }
  }

  public realpath(p: string, cache: {[path: string]: string}, cb: BFSCallback<string>): void {
    const fsInfo = this._getFs(p);

    fsInfo.fs.realpath(fsInfo.path, {}, (err, rv) => {
      if (err) {
        cb(this.standardizeError(err, fsInfo.path, p));
      } else {
        // resolve is there to remove any trailing slash that may be present
        cb(null, path.resolve(path.join(fsInfo.mountPoint, rv!)));
      }
    });
  }

  public rmdirSync(p: string): void {
    const fsInfo = this._getFs(p);
    if (this._containsMountPt(p)) {
      throw ApiError.ENOTEMPTY(p);
    } else {
      try {
        fsInfo.fs.rmdirSync(fsInfo.path);
      } catch (e) {
        throw this.standardizeError(e, fsInfo.path, p);
      }
    }
  }

  public rmdir(p: string, cb: BFSOneArgCallback): void {
    const fsInfo = this._getFs(p);
    if (this._containsMountPt(p)) {
      cb(ApiError.ENOTEMPTY(p));
    } else {
      fsInfo.fs.rmdir(fsInfo.path, (err?) => {
        cb(err ? this.standardizeError(err, fsInfo.path, p) : null);
      });
    }
  }

  /**
   * Returns true if the given path contains a mount point.
   */
  private _containsMountPt(p: string): boolean {
    const mountPoints = this.mountList, len = mountPoints.length;
    for (let i = 0; i < len; i++) {
      const pt = mountPoints[i];
      if (pt.length >= p.length && pt.slice(0, p.length) === p) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Tricky: Define all of the functions that merely forward arguments to the
 * relevant file system, or return/throw an error.
 * Take advantage of the fact that the *first* argument is always the path, and
 * the *last* is the callback function (if async).
 * @todo Can use numArgs to make proxying more efficient.
 * @hidden
 */
function defineFcn(name: string, isSync: boolean, numArgs: number): (...args: any[]) => any {
  if (isSync) {
    return function(this: MountableFileSystem, ...args: any[]) {
      const path = args[0];
      const rv = this._getFs(path);
      args[0] = rv.path;
      try {
        return (<any> rv.fs)[name].apply(rv.fs, args);
      } catch (e) {
        this.standardizeError(e, rv.path, path);
        throw e;
      }
    };
  } else {
    return function(this: MountableFileSystem, ...args: any[]) {
      const path = args[0];
      const rv = this._getFs(path);
      args[0] = rv.path;
      if (typeof args[args.length - 1] === 'function') {
        const cb = args[args.length - 1];
        args[args.length - 1] = (...args: any[]) => {
          if (args.length > 0 && args[0] instanceof ApiError) {
            this.standardizeError(args[0], rv.path, path);
          }
          cb.apply(null, args);
        };
      }
      return (<any> rv.fs)[name].apply(rv.fs, args);
    };
  }
}

/**
 * @hidden
 */
const fsCmdMap = [
   // 1 arg functions
   ['exists', 'unlink', 'readlink'],
   // 2 arg functions
   ['stat', 'mkdir', 'truncate'],
   // 3 arg functions
   ['open', 'readFile', 'chmod', 'utimes'],
   // 4 arg functions
   ['chown'],
   // 5 arg functions
   ['writeFile', 'appendFile']];

for (let i = 0; i < fsCmdMap.length; i++) {
  const cmds = fsCmdMap[i];
  for (const fnName of cmds) {
    (<any> MountableFileSystem.prototype)[fnName] = defineFcn(fnName, false, i + 1);
    (<any> MountableFileSystem.prototype)[fnName + 'Sync'] = defineFcn(fnName + 'Sync', true, i + 1);
  }
}
