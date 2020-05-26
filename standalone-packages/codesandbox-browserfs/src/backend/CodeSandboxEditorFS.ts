import { ApiError, ErrorCode } from '../core/api_error';
import { File } from '../core/file';
import { FileFlag } from '../core/file_flag';
/* eslint-disable */
import {
  BFSCallback,
  BFSOneArgCallback,
  FileSystem,
  FileSystemOptions,
  SynchronousFileSystem,
} from '../core/file_system';
import { FileType, default as Stats } from '../core/node_fs_stats';
import PreloadFile from '../generic/preload_file';

function blobToBuffer(blob: Blob, cb: (err: any | undefined | null, result?: Buffer) => void) {
  if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
    throw new Error('first argument must be a Blob');
  }
  if (typeof cb !== 'function') {
    throw new Error('second argument must be a function');
  }

  const reader = new FileReader();

  function onLoadEnd(e: any) {
    reader.removeEventListener('loadend', onLoadEnd, false);
    if (e.error) {
      cb(e.error);
    } else {
      // @ts-ignore
      cb(null, Buffer.from(reader.result));
    }
  }

  reader.addEventListener('loadend', onLoadEnd, false);
  reader.readAsArrayBuffer(blob);
}

export interface IModule {
  path: string;
  updatedAt: string;
  insertedAt: string;
}

export type IFile = IModule & {
  code: string | undefined;
  savedCode: string | null;
  isBinary: boolean;
  type: 'file';
}

export type IDirectory = IModule & {
  type: 'directory';
}

export interface IManager {
  getSandboxFs: () => {
    [path: string]: IFile | IDirectory;
  };
  getJwt: () => string;
}


function getCode(savedCode: string | null | undefined, code: string | undefined) {
  if (savedCode === null) {
    return code || '';
  }

  return savedCode || '';
}

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
  api: IManager;
}

export default class CodeSandboxEditorFS extends SynchronousFileSystem
  implements FileSystem {
  public static readonly Name = 'CodeSandboxEditorFS';
  public static readonly Options: FileSystemOptions = {
    api: {
      type: 'object',
      description: 'The CodeSandbox Editor',
      validator: (opt: IManager, cb: BFSOneArgCallback): void => {
        if (opt) {
          cb();
        } else {
          cb(new ApiError(ErrorCode.EINVAL, 'Manager is invalid'));
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
    cb(null, new CodeSandboxEditorFS(options.api));
  }

  public static isAvailable(): boolean {
    return true;
  }

  private api: IManager;

  constructor(api: IManager) {
    super();

    this.api = api;
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
    throw new Error('Empty not supported');
  }

  public renameSync(oldPath: string, newPath: string) {
    throw new Error('Rename not supported');
  }

  public statSync(p: string, isLstate: boolean): Stats {
    const modules = this.api.getSandboxFs();
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

    if (moduleInfo.type === 'directory') {
      return new Stats(
        FileType.DIRECTORY,
        4096,
        undefined,
        +new Date(),
        +new Date(moduleInfo.updatedAt),
        +new Date(moduleInfo.insertedAt)
      );
    } else {
      return new Stats(
        FileType.FILE,
        getCode(moduleInfo.savedCode, moduleInfo.code).length,
        undefined,
        +new Date(),
        +new Date(moduleInfo.updatedAt),
        +new Date(moduleInfo.insertedAt)
      );
    }
  }

  public createFileSync(p: string, flag: FileFlag, mode: number): File {
    throw new Error('Create file not supported');
  }

  public open(p: string, flag: FileFlag, mode: number, cb: BFSCallback<File>): void {
    const moduleInfo = this.api.getSandboxFs()[p];

    if (!moduleInfo) {
      cb(ApiError.ENOENT(p));
      return;
    }

    if (moduleInfo.type === 'directory') {
      const stats = new Stats(FileType.DIRECTORY, 4096, undefined, +new Date(), +new Date(moduleInfo.updatedAt), +new Date(moduleInfo.insertedAt));
      cb(null, new CodeSandboxFile(this, p, flag, stats));
    } else {
      const { isBinary, savedCode, code } = moduleInfo;

      if (isBinary) {
        const url = getCode(savedCode, code);
        const jwt = this.api.getJwt && this.api.getJwt();
        const sendAuth = jwt && new URL(url).origin === document.location.origin;
        const headers: {} | {
          Authorization: string
        } = sendAuth ? { 
          Authorization: `Bearer ${this.api.getJwt && this.api.getJwt()}` 
        } : {};

        fetch(url, { headers }).then(x => x.blob()).then(blob => {
          const stats = new Stats(FileType.FILE, blob.size, undefined, +new Date(), +new Date(moduleInfo.updatedAt), +new Date(moduleInfo.insertedAt));

          blobToBuffer(blob, (err, r) => {
            if (err) {
              cb(err);
              return;
            }

            cb(undefined, new CodeSandboxFile(this, p, flag, stats, r));
          });
        });
        return;
      }

      const buffer = Buffer.from(getCode(savedCode, code));
      const stats = new Stats(FileType.FILE, buffer.length, undefined, +new Date(), +new Date(moduleInfo.updatedAt), +new Date(moduleInfo.insertedAt));

      cb(null, new CodeSandboxFile(this, p, flag, stats, buffer));
    }
  }

  public openFileSync(p: string, flag: FileFlag, mode: number): File {
    const moduleInfo = this.api.getSandboxFs()[p];

    if (!moduleInfo) {
      throw ApiError.ENOENT(p);
    }

    if (moduleInfo.type === 'directory') {
      const stats = new Stats(FileType.DIRECTORY, 4096, undefined, +new Date(), +new Date(moduleInfo.updatedAt), +new Date(moduleInfo.insertedAt));

      return new CodeSandboxFile(this, p, flag, stats);
    } else {
      const { savedCode, code } = moduleInfo;
      const buffer = Buffer.from(getCode(savedCode, code));
      const stats = new Stats(FileType.FILE, buffer.length, undefined, +new Date(), +new Date(moduleInfo.updatedAt), +new Date(moduleInfo.insertedAt));

      return new CodeSandboxFile(this, p, flag, stats, buffer);
    }
  }

  public writeFileSync() {
    // Stubbed
  }

  public rmdirSync(p: string) {
    // Stubbed
  }

  public mkdirSync(p: string) {
    // Stubbed
  }

  public unlinkSync(p: string) {
    // Stubbed
  }

  public readdirSync(path: string): string[] {
    const paths = Object.keys(this.api.getSandboxFs());

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
    // Stubbed

    cb(null, undefined);
  }

  public _syncSync(p: string, data: Buffer): void {
    // Stubbed
  }
}
