import {
  SynchronousFileSystem,
  FileSystem,
  BFSOneArgCallback,
  BFSCallback,
  FileSystemOptions,
} from '../core/file_system';
import { File } from '../core/file';
import { FileFlag } from '../core/file_flag';
import { default as Stats, FileType } from '../core/node_fs_stats';
import PreloadFile from '../generic/preload_file';
import { ErrorCode, ApiError } from '../core/api_error';

export interface IModule {
  path: string;
  code: string | undefined;
  updatedAt: string;
  insertedAt: string;
}

export interface IManager {
  getState: () => {
    editor: {
      modulesByPath: {
        [path: string]: IModule;
      }
    }
  };
}

const warn = console.warn;

class CodeSandboxFile extends PreloadFile<CodeSandboxEditorFS> implements File {
  constructor(
    _fs: CodeSandboxEditorFS,
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

export default class CodeSandboxEditorFS extends SynchronousFileSystem
  implements FileSystem {
  public static readonly Name = 'CodeSandboxEditorFS';
  public static readonly Options: FileSystemOptions = {
    manager: {
      type: 'object',
      description: 'The CodeSandbox Editor',
      validator: (opt: IManager, cb: BFSOneArgCallback): void => {
        if (opt) {
          cb();
        } else {
          cb(new ApiError(ErrorCode.EINVAL, `Manager is invalid`));
        }
      },
    },
  };

  /**
   * Creates an InMemoryFileSystem instance.
   */
  public static Create(
    options: ICodeSandboxFileSystemOptions,
    cb: BFSCallback<CodeSandboxEditorFS>
  ): void {
    cb(null, new CodeSandboxEditorFS(options.manager));
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
    return 'CodeSandboxEditorFS';
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
    throw new Error("Empty not supported");
  }

  public renameSync(oldPath: string, newPath: string) {
    throw new Error("Rename not supported");
  }

  public statSync(p: string, isLstate: boolean): Stats {
    const modules = this.manager.getState().editor.modulesByPath;
    const moduleInfo = modules[p];

    if (!moduleInfo) {
      const modulesStartingWithPath = Object.keys(modules).filter(
        (pa: string) => pa.startsWith(p.endsWith('/') ? p : p + '/') || pa === p
      );

      if (modulesStartingWithPath.length > 0) {
        return new Stats(FileType.DIRECTORY, 0);
      } else {
        throw ApiError.FileError(ErrorCode.ENOENT, p);
      }
    }

    const stats = new Stats(
      FileType.FILE,
      (moduleInfo.code || '').length,
      undefined,
      new Date(),
      new Date(moduleInfo.updatedAt),
      new Date(moduleInfo.insertedAt)
    );

    return stats;
  }

  public createFileSync(p: string, flag: FileFlag, mode: number): File {
    throw new Error("Create file not supported");
  }

  public openFileSync(p: string, flag: FileFlag, mode: number): File {
    const moduleInfo = this.manager.getState().editor.modulesByPath[p];

    if (!moduleInfo) {
      throw ApiError.ENOENT(p);
    }

    const { code = '' } = moduleInfo;
    const buffer = Buffer.from(code || '');
    const stats = new Stats(FileType.FILE, buffer.length, undefined, new Date(), new Date(moduleInfo.updatedAt), new Date(moduleInfo.insertedAt));

    return new CodeSandboxFile(this, p, flag, stats, buffer);
  }

  public writeFileSync() {
    // Stubbed
  }

  public rmdirSync(p: string) {
    warn('rmDirSync not supported');
  }

  public mkdirSync(p: string) {
    warn('rmDirSync not supported');
  }

  public readdirSync(path: string): string[] {
    const paths = Object.keys(this.manager.getState().editor.modulesByPath);

    const p = path.endsWith('/') ? path : path + '/';

    const pathsInDir = paths.filter((secondP: string) => secondP.startsWith(p));

    if (pathsInDir.length === 0) {
      return [];
    }

    const directChildren: Set<string> = new Set();
    const currentPathLength = p.split('/').length;

    pathsInDir
      .filter((np: string) => np.split('/').length >= currentPathLength)
      .forEach((np: string) => {
        const parts = np.split('/');

        parts.length = currentPathLength;
        directChildren.add(parts.join('/'));
      });

    const pathArray = Array.from(directChildren).map(pa => pa.replace(p, ''));

    return pathArray;
  }

  public _sync(p: string, data: Buffer, cb: BFSCallback<Stats>): void {
    warn('Sync not supported');
  }

  public _syncSync(p: string, data: Buffer): void {
    warn('Sync not supported');
  }
}
