import * as path from "path";
import {
  SynchronousFileSystem,
  FileSystem,
  BFSOneArgCallback,
  BFSCallback,
  FileSystemOptions
} from "../core/file_system";
import { File } from "../core/file";
import { FileFlag } from "../core/file_flag";
import { default as Stats, FileType } from "../core/node_fs_stats";
import PreloadFile from "../generic/preload_file";
import { ErrorCode, ApiError } from "../core/api_error";

export interface IModule {
  path?: string;
  code: string | undefined;
}

export interface IManager {
  getTranspiledModules: () => {
    [path: string]: {
      module: IModule;
    };
  };

  addModule(module: IModule): void;
  removeModule(module: IModule): void;
  moveModule(module: IModule, newPath: string): void;
  updateModule(module: IModule): void;
}

class CodeSandboxFile extends PreloadFile<CodeSandboxFS> implements File {
  constructor(
    _fs: CodeSandboxFS,
    _path: string,
    _flag: FileFlag,
    _stat: Stats,
    contents?: Buffer
  ) {
    super(_fs, _path, _flag, _stat, contents);
  }

  public sync(cb: BFSOneArgCallback): void {
    if (this.isDirty()) {
      const buffer = this.getBuffer();

      this._fs._sync(
        this.getPath(),
        buffer,
        (e: ApiError | undefined | null, stat?: Stats) => {
          if (!e) {
            this.resetDirty();
          }
          cb(e);
        }
      );
    } else {
      cb();
    }
  }

  public close(cb: BFSOneArgCallback): void {
    this.sync(cb);
  }

  public syncSync(): void {
    if (this.isDirty()) {
      this._fs._syncSync(this.getPath(), this.getBuffer());
      this.resetDirty();
    }
  }

  public closeSync(): void {
    this.syncSync();
  }
}

export interface ICodeSandboxFileSystemOptions {
  manager: IManager;
}

export default class CodeSandboxFS extends SynchronousFileSystem
  implements FileSystem {
  public static readonly Name = "CodeSandboxFS";
  public static readonly Options: FileSystemOptions = {
    manager: {
      type: "object",
      description: "The CodeSandbox Manager",
      validator: (opt: IManager, cb: BFSOneArgCallback): void => {
        if (opt) {
          cb();
        } else {
          cb(new ApiError(ErrorCode.EINVAL, `Manager is invalid`));
        }
      }
    }
  };

  /**
   * Creates an InMemoryFileSystem instance.
   */
  public static Create(
    options: ICodeSandboxFileSystemOptions,
    cb: BFSCallback<CodeSandboxFS>
  ): void {
    cb(null, new CodeSandboxFS(options.manager));
  }

  public static isAvailable(): boolean {
    return true;
  }

  private manager: IManager;

  constructor(manager: IManager) {
    super();

    this.manager = manager;
  }

  public getName(): string {
    return "CodeSandboxFS";
  }

  public isReadOnly(): boolean {
    return false;
  }

  public supportsProps(): boolean {
    return false;
  }

  public supportsSynch(): boolean {
    return true;
  }

  public empty(mainCb: BFSOneArgCallback): void {
    const tModules = this.manager.getTranspiledModules();
    Object.keys(tModules).forEach((pa: string) => {
      this.manager.removeModule(tModules[pa].module);
    });
    mainCb();
  }

  public renameSync(oldPath: string, newPath: string) {
    const tModules = this.manager.getTranspiledModules();
    const modulesWithPath = Object.keys(tModules).filter(
      (p: string) => p.startsWith(oldPath) + "/" || p === oldPath
    );

    if (modulesWithPath.length === 0) {
      throw ApiError.FileError(ErrorCode.ENOENT, oldPath);
    }

    modulesWithPath
      .map((p: string) => ({ path: p, moduleInfo: tModules[p] }))
      .forEach(({ path, moduleInfo }) => {
        const { module } = moduleInfo;
        this.manager.moveModule(module, path.replace(oldPath, newPath));
      });
  }

  public statSync(p: string, isLstate: boolean): Stats {
    const tModules = this.manager.getTranspiledModules();
    const moduleInfo = tModules[p];

    if (!moduleInfo) {
      const modulesStartingWithPath = Object.keys(tModules).filter(
        (pa: string) => pa.startsWith(p.endsWith("/") ? p : p + "/") || pa === p
      );

      if (modulesStartingWithPath.length > 0) {
        return new Stats(FileType.DIRECTORY, 0);
      } else {
        throw ApiError.FileError(ErrorCode.ENOENT, p);
      }
    }

    const stats = new Stats(
      FileType.FILE,
      Buffer.byteLength(moduleInfo.module.code || '', 'utf8')
    );

    return stats;
  }

  public createFileSync(p: string, flag: FileFlag, mode: number): File {
    if (p === "/") {
      throw ApiError.EEXIST(p);
    }

    if (this.manager.getTranspiledModules()[p]) {
      throw ApiError.EEXIST(p);
    }

    const module = {
      path: p,
      code: ""
    };
    this.manager.addModule(module);

    const buffer = Buffer.from(module.code || "");
    const stats = new Stats(FileType.FILE, buffer.length);

    return new CodeSandboxFile(this, p, flag, stats, buffer);
  }

  public openFileSync(p: string, flag: FileFlag, mode: number): File {
    const moduleInfo = this.manager.getTranspiledModules()[p];

    if (!moduleInfo) {
      throw ApiError.ENOENT(p);
    }

    const { code = "" } = moduleInfo.module;
    const buffer = Buffer.from(code || "");
    const stats = new Stats(FileType.FILE, buffer.length);

    return new CodeSandboxFile(this, p, flag, stats, buffer);
  }

  public rmdirSync(p: string) {
    const tModules = this.manager.getTranspiledModules();
    Object.keys(tModules)
      .filter((pa: string) => pa.startsWith(p + "/") || p === pa)
      .forEach((pa: string) => {
        const { module } = tModules[pa];

        this.manager.removeModule(module);
      });
  }

  public mkdirSync(p: string) {
    // CodeSandbox Manager doesn't have the concept of directories, like git.
    // For now we will do nothing, as we pretend that every directory already exists.
  }

  public readdirSync(path: string): string[] {
    const paths = Object.keys(this.manager.getTranspiledModules());

    const p = path.endsWith("/") ? path : path + "/";

    const pathsInDir = paths.filter((secondP: string) => secondP.startsWith(p));

    if (pathsInDir.length === 0) {
      return [];
    }

    const directChildren: Set<string> = new Set();
    const currentPathLength = p.split("/").length;

    pathsInDir
      .filter((np: string) => np.split("/").length >= currentPathLength)
      .forEach((np: string) => {
        const parts = np.split("/");

        parts.length = currentPathLength;
        directChildren.add(parts.join("/"));
      });

    const pathArray = Array.from(directChildren).map(pa => pa.replace(p, ""));

    return pathArray;
  }

  public _sync(p: string, data: Buffer, cb: BFSCallback<Stats>): void {
    const parent = path.dirname(p);
    this.stat(
      parent,
      false,
      (error: ApiError | undefined | null, stat?: Stats): void => {
        if (error) {
          cb(ApiError.FileError(ErrorCode.ENOENT, parent));
        } else {
          const module = this.manager.getTranspiledModules()[p].module;
          this.manager.updateModule(module);

          cb(null);
        }
      }
    );
  }

  public _syncSync(p: string, data: Buffer): void {
    const parent = path.dirname(p);
    this.statSync(parent, false);

    const module = this.manager.getTranspiledModules()[p].module;
    this.manager.updateModule(module);
  }
}
