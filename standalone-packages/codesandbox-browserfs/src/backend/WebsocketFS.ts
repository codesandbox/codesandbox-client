/* eslint-disable max-classes-per-file */

import { ApiError, ErrorCode } from "../core/api_error";
import { FileFlag } from "../core/file_flag";
import {
  BFSCallback,
  BFSOneArgCallback,
  FileSystem,
  FileSystemOptions,
  SynchronousFileSystem
} from "../core/file_system";
import Stats from '../core/node_fs_stats';

export interface Socket {
  emit: (data: any, cb: (answer: any) => void) => void;
  dispose: () => void;
}

export interface WebsocketFSOptions {
  socket: Socket;
}

export default class WebsocketFS extends SynchronousFileSystem
  implements FileSystem {
  public static readonly Name = "WebsocketFS";
  public static readonly Options: FileSystemOptions = {
    socket: {
      type: "object",
      description: "The socket emitter",
      validator: (opt: WebsocketFSOptions, cb: BFSOneArgCallback): void => {
        if (opt) {
          cb();
        } else {
          cb(new ApiError(ErrorCode.EINVAL, `Manager is invalid`));
        }
      }
    }
  }

  public static Create(
    options: WebsocketFSOptions,
    cb: BFSCallback<WebsocketFS>
  ): void {
    cb(null, new WebsocketFS(options));
  }

  public static isAvailable(): boolean {
    return true;
  }

  private socket: Socket;

  constructor(options: WebsocketFSOptions) {
    super()
    this.socket = options.socket;
  }

  public getName(): string {
    return "WebsocketFS";
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

  public readFile(fname: string, encoding: string | null, flag: FileFlag, cb: BFSCallback<string | Buffer>): void {
    try {
      this.socket.emit({
        method: 'readFile',
        args: {
          path: fname,
          encoding,
          flag
        }
      }, ({ error, data }) => {
        if (data) {
          cb(null, Buffer.from(data));
        } else {
          cb(error)
        }
      })
    } catch (e) {
      cb(e);
    }
  }

  public stat(p: string, isLstat: boolean | null, cb: BFSCallback<Stats>): void {
    try {
      this.socket.emit({
        method: 'stat',
        args: {
          path: p,
          isLstat
        }
      }, ({ error, data }) => {
        if (data) {
          cb(null, {
            ...data,
            atime: new Date(data.atime),
            mtime: new Date(data.mtime),
            ctime: new Date(data.ctime),
            birthtime: new Date(data.birthtime)
          });
        } else {
          cb(error)
        }
      })
    } catch (e) {
      cb(e);
    }
  }
}

/*
this.statSync(p, isLstat || true)
*/