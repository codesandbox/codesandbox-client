import {BaseFileSystem, FileSystem, BFSOneArgCallback, BFSCallback, FileSystemOptions} from '../core/file_system';
import {ApiError, ErrorCode} from '../core/api_error';
import {FileFlag} from '../core/file_flag';
import {buffer2ArrayBuffer, arrayBuffer2Buffer, emptyBuffer} from '../core/util';
import {File, BaseFile} from '../core/file';
import {default as Stats} from '../core/node_fs_stats';
import PreloadFile from '../generic/preload_file';
import global from '../core/global';
import fs from '../core/node_fs';

/**
 * @hidden
 */
declare const importScripts: Function;

/**
 * @hidden
 */
interface IBrowserFSMessage {
  browserfsMessage: boolean;
}

/**
 * @hidden
 */
enum SpecialArgType {
  // Callback
  CB,
  // File descriptor
  FD,
  // API error
  API_ERROR,
  // Stats object
  STATS,
  // Initial probe for file system information.
  PROBE,
  // FileFlag object.
  FILEFLAG,
  // Buffer object.
  BUFFER,
  // Generic Error object.
  ERROR
}

/**
 * @hidden
 */
interface ISpecialArgument {
  type: SpecialArgType;
}

/**
 * @hidden
 */
interface IProbeResponse extends ISpecialArgument {
  isReadOnly: boolean;
  supportsLinks: boolean;
  supportsProps: boolean;
}

/**
 * @hidden
 */
interface ICallbackArgument extends ISpecialArgument {
  // The callback ID.
  id: number;
}

/**
 * Converts callback arguments into ICallbackArgument objects, and back
 * again.
 * @hidden
 */
class CallbackArgumentConverter {
  private _callbacks: { [id: number]: Function } = {};
  private _nextId: number = 0;

  public toRemoteArg(cb: Function): ICallbackArgument {
    const id = this._nextId++;
    this._callbacks[id] = cb;
    return {
      type: SpecialArgType.CB,
      id: id
    };
  }

  public toLocalArg(id: number): Function {
    const cb = this._callbacks[id];
    delete this._callbacks[id];
    return cb;
  }
}

/**
 * @hidden
 */
interface IFileDescriptorArgument extends ISpecialArgument {
  // The file descriptor's id on the remote side.
  id: number;
  // The entire file's data, as an array buffer.
  data: ArrayBuffer | SharedArrayBuffer;
  // The file's stat object, as an array buffer.
  stat: ArrayBuffer | SharedArrayBuffer;
  // The path to the file.
  path: string;
  // The flag of the open file descriptor.
  flag: string;
}

/**
 * @hidden
 */
class FileDescriptorArgumentConverter {
  private _fileDescriptors: { [id: number]: File } = {};
  private _nextId: number = 0;

  public toRemoteArg(fd: File, p: string, flag: FileFlag, cb: BFSCallback<IFileDescriptorArgument>): void {
    const id = this._nextId++;
    let data: ArrayBuffer | SharedArrayBuffer;
    let stat: ArrayBuffer | SharedArrayBuffer;
    this._fileDescriptors[id] = fd;

    // Extract needed information asynchronously.
    fd.stat((err, stats) => {
      if (err) {
        cb(err);
      } else {
        stat = bufferToTransferrableObject(stats!.toBuffer());
        // If it's a readable flag, we need to grab contents.
        if (flag.isReadable()) {
          fd.read(Buffer.alloc(stats!.size), 0, stats!.size, 0, (err?: ApiError | null, bytesRead?: number, buff?: Buffer) => {
            if (err) {
              cb(err);
            } else {
              data = bufferToTransferrableObject(buff!);
              cb(null, {
                type: SpecialArgType.FD,
                id: id,
                data: data,
                stat: stat,
                path: p,
                flag: flag.getFlagString()
              });
            }
          });
        } else {
          // File is not readable, which means writing to it will append or
          // truncate/replace existing contents. Return an empty arraybuffer.
          cb(null, {
            type: SpecialArgType.FD,
            id: id,
            data: new ArrayBuffer(0),
            stat: stat,
            path: p,
            flag: flag.getFlagString()
          });
        }
      }
    });
  }

  public applyFdAPIRequest(request: IAPIRequest, cb: BFSOneArgCallback): void {
    const fdArg = <IFileDescriptorArgument> request.args[0];
    this._applyFdChanges(fdArg, (err, fd?) => {
      if (err) {
        cb(err);
      } else {
        // Apply method on now-changed file descriptor.
        (<any> fd)[request.method]((e?: ApiError) => {
          if (request.method === 'close') {
            delete this._fileDescriptors[fdArg.id];
          }
          cb(e);
        });
      }
    });
  }

  private _applyFdChanges(remoteFd: IFileDescriptorArgument, cb: BFSCallback<File>): void {
    const fd = this._fileDescriptors[remoteFd.id],
      data = transferrableObjectToBuffer(remoteFd.data),
      remoteStats = Stats.fromBuffer(transferrableObjectToBuffer(remoteFd.stat));

    // Write data if the file is writable.
    const flag = FileFlag.getFileFlag(remoteFd.flag);
    if (flag.isWriteable()) {
      // Appendable: Write to end of file.
      // Writeable: Replace entire contents of file.
      fd.write(data, 0, data.length, flag.isAppendable() ? fd.getPos()! : 0, (e?: ApiError | null) => {
        function applyStatChanges() {
          // Check if mode changed.
          fd.stat((e, stats?) => {
            if (e) {
              cb(e);
            } else {
              if (stats!.mode !== remoteStats.mode) {
                fd.chmod(remoteStats.mode, (e: any) => {
                  cb(e, fd);
                });
              } else {
                cb(e, fd);
              }
            }
          });
        }
        if (e) {
          cb(e);
        } else {
          // If writeable & not appendable, we need to ensure file contents are
          // identical to those from the remote FD. Thus, we truncate to the
          // length of the remote file.
          if (!flag.isAppendable()) {
            fd.truncate(data.length, () => {
              applyStatChanges();
            });
          } else {
            applyStatChanges();
          }
        }
      });
    } else {
      cb(null, fd);
    }
  }
}

/**
 * @hidden
 */
interface IAPIErrorArgument extends ISpecialArgument {
  // The error object, as an array buffer.
  errorData: ArrayBuffer | SharedArrayBuffer;
}

/**
 * @hidden
 */
function apiErrorLocal2Remote(e: ApiError): IAPIErrorArgument {
  return {
    type: SpecialArgType.API_ERROR,
    errorData: bufferToTransferrableObject(e.writeToBuffer())
  };
}

/**
 * @hidden
 */
function apiErrorRemote2Local(e: IAPIErrorArgument): ApiError {
  return ApiError.fromBuffer(transferrableObjectToBuffer(e.errorData));
}

/**
 * @hidden
 */
interface IErrorArgument extends ISpecialArgument {
  // The name of the error (e.g. 'TypeError').
  name: string;
  // The message associated with the error.
  message: string;
  // The stack associated with the error.
  stack: string;
}

/**
 * @hidden
 */
function errorLocal2Remote(e: Error): IErrorArgument {
  return {
    type: SpecialArgType.ERROR,
    name: e.name,
    message: e.message,
    stack: e.stack!
  };
}

/**
 * @hidden
 */
function errorRemote2Local(e: IErrorArgument): Error {
  let cnstr: {
    new (msg: string): Error;
  } = global[e.name];
  if (typeof(cnstr) !== 'function') {
    cnstr = Error;
  }
  const err = new cnstr(e.message);
  err.stack = e.stack;
  return err;
}

/**
 * @hidden
 */
interface IStatsArgument extends ISpecialArgument {
  // The stats object as an array buffer.
  statsData: ArrayBuffer | SharedArrayBuffer;
}

/**
 * @hidden
 */
function statsLocal2Remote(stats: Stats): IStatsArgument {
  return {
    type: SpecialArgType.STATS,
    statsData: bufferToTransferrableObject(stats.toBuffer())
  };
}

/**
 * @hidden
 */
function statsRemote2Local(stats: IStatsArgument): Stats {
  return Stats.fromBuffer(transferrableObjectToBuffer(stats.statsData));
}

/**
 * @hidden
 */
interface IFileFlagArgument extends ISpecialArgument {
  flagStr: string;
}

/**
 * @hidden
 */
function fileFlagLocal2Remote(flag: FileFlag): IFileFlagArgument {
  return {
    type: SpecialArgType.FILEFLAG,
    flagStr: flag.getFlagString()
  };
}

/**
 * @hidden
 */
function fileFlagRemote2Local(remoteFlag: IFileFlagArgument): FileFlag {
  return FileFlag.getFileFlag(remoteFlag.flagStr);
}

/**
 * @hidden
 */
interface IBufferArgument extends ISpecialArgument {
  data: ArrayBuffer | SharedArrayBuffer;
}

/**
 * @hidden
 */
function bufferToTransferrableObject(buff: Buffer): ArrayBuffer | SharedArrayBuffer {
  return buffer2ArrayBuffer(buff);
}

/**
 * @hidden
 */
function transferrableObjectToBuffer(buff: ArrayBuffer | SharedArrayBuffer): Buffer {
  return arrayBuffer2Buffer(buff);
}

/**
 * @hidden
 */
function bufferLocal2Remote(buff: Buffer): IBufferArgument {
  return {
    type: SpecialArgType.BUFFER,
    data: bufferToTransferrableObject(buff)
  };
}

/**
 * @hidden
 */
function bufferRemote2Local(buffArg: IBufferArgument): Buffer {
  return transferrableObjectToBuffer(buffArg.data);
}

/**
 * @hidden
 */
interface IAPIRequest extends IBrowserFSMessage {
  method: string;
  args: Array<number | string | ISpecialArgument>;
}

/**
 * @hidden
 */
function isAPIRequest(data: any): data is IAPIRequest {
  return data && typeof data === 'object' && data.hasOwnProperty('browserfsMessage') && data['browserfsMessage'];
}

/**
 * @hidden
 */
interface IAPIResponse extends IBrowserFSMessage {
  cbId: number;
  args: Array<number | string | ISpecialArgument>;
}

/**
 * @hidden
 */
function isAPIResponse(data: any): data is IAPIResponse {
  return data && typeof data === 'object' && data.hasOwnProperty('browserfsMessage') && data['browserfsMessage'];
}

/**
 * Represents a remote file in a different worker/thread.
 */
class WorkerFile extends PreloadFile<WorkerFS> {
  private _remoteFdId: number;

  constructor(_fs: WorkerFS, _path: string, _flag: FileFlag, _stat: Stats, remoteFdId: number, contents?: Buffer) {
    super(_fs, _path, _flag, _stat, contents);
    this._remoteFdId = remoteFdId;
  }

  public getRemoteFdId() {
    return this._remoteFdId;
  }

  /**
   * @hidden
   */
  public toRemoteArg(): IFileDescriptorArgument {
    return {
      type: SpecialArgType.FD,
      id: this._remoteFdId,
      data: bufferToTransferrableObject(this.getBuffer()),
      stat: bufferToTransferrableObject(this.getStats().toBuffer()),
      path: this.getPath(),
      flag: this.getFlag().getFlagString()
    };
  }

  public sync(cb: BFSOneArgCallback): void {
    this._syncClose('sync', cb);
  }

  public close(cb: BFSOneArgCallback): void {
    this._syncClose('close', cb);
  }

  private _syncClose(type: string, cb: BFSOneArgCallback): void {
    if (this.isDirty()) {
      (<WorkerFS> this._fs).syncClose(type, this, (e?: ApiError) => {
        if (!e) {
          this.resetDirty();
        }
        cb(e);
      });
    } else {
      cb();
    }
  }
}

export interface WorkerFSOptions {
  // The target worker that you want to connect to, or the current worker if in a worker context.
  worker: Worker;
}

/**
 * WorkerFS lets you access a BrowserFS instance that is running in a different
 * JavaScript context (e.g. access BrowserFS in one of your WebWorkers, or
 * access BrowserFS running on the main page from a WebWorker).
 *
 * For example, to have a WebWorker access files in the main browser thread,
 * do the following:
 *
 * MAIN BROWSER THREAD:
 *
 * ```javascript
 *   // Listen for remote file system requests.
 *   BrowserFS.FileSystem.WorkerFS.attachRemoteListener(webWorkerObject);
 * ```
 *
 * WEBWORKER THREAD:
 *
 * ```javascript
 *   // Set the remote file system as the root file system.
 *   BrowserFS.configure({ fs: "WorkerFS", options: { worker: self }}, function(e) {
 *     // Ready!
 *   });
 * ```
 *
 * Note that synchronous operations are not permitted on the WorkerFS, regardless
 * of the configuration option of the remote FS.
 */
export default class WorkerFS extends BaseFileSystem implements FileSystem {
  public static readonly Name = "WorkerFS";

  public static readonly Options: FileSystemOptions = {
    worker: {
      type: "object",
      description: "The target worker that you want to connect to, or the current worker if in a worker context.",
      validator: function(v: object, cb: BFSOneArgCallback): void {
        // Check for a `postMessage` function.
        if ((<any> v)['postMessage']) {
          cb();
        } else {
          cb(new ApiError(ErrorCode.EINVAL, `option must be a Web Worker instance.`));
        }
      }
    }
  };

  public static Create(opts: WorkerFSOptions, cb: BFSCallback<WorkerFS>): void {
    const fs = new WorkerFS(opts.worker);
    fs._initialize(() => {
      cb(null, fs);
    });
  }
  public static isAvailable(): boolean {
    return typeof(importScripts) !== 'undefined' || typeof(Worker) !== 'undefined';
  }

  /**
   * Attaches a listener to the remote worker for file system requests.
   */
  public static attachRemoteListener(worker: Worker) {
    const fdConverter = new FileDescriptorArgumentConverter();

    function argLocal2Remote(arg: any, requestArgs: any[], cb: BFSCallback<any>): void {
      switch (typeof arg) {
        case 'object':
          if (arg instanceof Stats) {
            cb(null, statsLocal2Remote(arg));
          } else if (arg instanceof ApiError) {
            cb(null, apiErrorLocal2Remote(arg));
          } else if (arg instanceof BaseFile) {
            // Pass in p and flags from original request.
            cb(null, fdConverter.toRemoteArg(<File> arg, requestArgs[0], requestArgs[1], cb));
          } else if (arg instanceof FileFlag) {
            cb(null, fileFlagLocal2Remote(arg));
          } else if (arg instanceof Buffer) {
            cb(null, bufferLocal2Remote(arg));
          } else if (arg instanceof Error) {
            cb(null, errorLocal2Remote(arg));
          } else {
            cb(null, arg);
          }
          break;
        default:
          cb(null, arg);
          break;
      }
    }

    function argRemote2Local(arg: any, fixedRequestArgs: any[]): any {
      if (!arg) {
        return arg;
      }
      switch (typeof arg) {
        case 'object':
          if (typeof arg['type'] === 'number') {
            const specialArg = <ISpecialArgument> arg;
            switch (specialArg.type) {
              case SpecialArgType.CB:
                const cbId = (<ICallbackArgument> arg).id;
                return function() {
                  let i: number;
                  const fixedArgs = new Array(arguments.length);
                  let message: IAPIResponse,
                    countdown = arguments.length;

                  function abortAndSendError(err: ApiError) {
                    if (countdown > 0) {
                      countdown = -1;
                      message = {
                        browserfsMessage: true,
                        cbId: cbId,
                        args: [apiErrorLocal2Remote(err)]
                      };
                      worker.postMessage(message);
                    }
                  }

                  for (i = 0; i < arguments.length; i++) {
                    // Capture i and argument.
                    ((i: number, arg: any) => {
                      argLocal2Remote(arg, fixedRequestArgs, (err, fixedArg?) => {
                        fixedArgs[i] = fixedArg;
                        if (err) {
                          abortAndSendError(err);
                        } else if (--countdown === 0) {
                          message = {
                            browserfsMessage: true,
                            cbId: cbId,
                            args: fixedArgs
                          };
                          worker.postMessage(message);
                        }
                      });
                    })(i, arguments[i]);
                  }

                  if (arguments.length === 0) {
                    message = {
                      browserfsMessage: true,
                      cbId: cbId,
                      args: fixedArgs
                    };
                    worker.postMessage(message);
                  }

                };
              case SpecialArgType.API_ERROR:
                return apiErrorRemote2Local(<IAPIErrorArgument> specialArg);
              case SpecialArgType.STATS:
                return statsRemote2Local(<IStatsArgument> specialArg);
              case SpecialArgType.FILEFLAG:
                return fileFlagRemote2Local(<IFileFlagArgument> specialArg);
              case SpecialArgType.BUFFER:
                return bufferRemote2Local(<IBufferArgument> specialArg);
              case SpecialArgType.ERROR:
                return errorRemote2Local(<IErrorArgument> specialArg);
              default:
                // No idea what this is.
                return arg;
            }
          } else {
            return arg;
          }
        default:
          return arg;
      }
    }

    worker.addEventListener('message', (e: MessageEvent) => {
      const request: object = e.data;
      if (isAPIRequest(request)) {
        const args = request.args,
          fixedArgs = new Array<any>(args.length);

        switch (request.method) {
          case 'close':
          case 'sync':
            (() => {
              // File descriptor-relative methods.
              const remoteCb = <ICallbackArgument> args[1];
              fdConverter.applyFdAPIRequest(request, (err?: ApiError) => {
                // Send response.
                const response: IAPIResponse = {
                  browserfsMessage: true,
                  cbId: remoteCb.id,
                  args: err ? [apiErrorLocal2Remote(err)] : []
                };
                worker.postMessage(response);
              });
            })();
            break;
          case 'probe':
            (() => {
              const rootFs = <FileSystem> fs.getRootFS(),
                remoteCb = <ICallbackArgument> args[1],
                probeResponse: IProbeResponse = {
                  type: SpecialArgType.PROBE,
                  isReadOnly: rootFs.isReadOnly(),
                  supportsLinks: rootFs.supportsLinks(),
                  supportsProps: rootFs.supportsProps()
                },
                response: IAPIResponse = {
                  browserfsMessage: true,
                  cbId: remoteCb.id,
                  args: [probeResponse]
                };

              worker.postMessage(response);
            })();
            break;
          default:
            // File system methods.
            for (let i = 0; i < args.length; i++) {
              fixedArgs[i] = argRemote2Local(args[i], fixedArgs);
            }
            const rootFS = fs.getRootFS();
            (<Function> (<any> rootFS)[request.method]).apply(rootFS, fixedArgs);
            break;
        }
      }
    });
  }

  private _worker: Worker;
  private _callbackConverter = new CallbackArgumentConverter();

  private _isInitialized: boolean = false;
  private _isReadOnly: boolean = false;
  private _supportLinks: boolean = false;
  private _supportProps: boolean = false;

  /**
   * Constructs a new WorkerFS instance that connects with BrowserFS running on
   * the specified worker.
   */
  private constructor(worker: Worker) {
    super();
    this._worker = worker;
    this._worker.addEventListener('message', (e: MessageEvent) => {
      const resp: object = e.data;
      if (isAPIResponse(resp)) {
        let i: number;
        const args = resp.args;
        const fixedArgs = new Array(args.length);
        // Dispatch event to correct id.
        for (i = 0; i < fixedArgs.length; i++) {
          fixedArgs[i] = this._argRemote2Local(args[i]);
        }
        this._callbackConverter.toLocalArg(resp.cbId).apply(null, fixedArgs);
      }
    });
  }

  public getName(): string {
    return WorkerFS.Name;
  }

  public isReadOnly(): boolean { return this._isReadOnly; }
  public supportsSynch(): boolean { return false; }
  public supportsLinks(): boolean { return this._supportLinks; }
  public supportsProps(): boolean { return this._supportProps; }

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    this._rpc('rename', arguments);
  }
  public stat(p: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    this._rpc('stat', arguments);
  }
  public open(p: string, flag: FileFlag, mode: number, cb: BFSCallback<File>): void {
    this._rpc('open', arguments);
  }
  public unlink(p: string, cb: Function): void {
    this._rpc('unlink', arguments);
  }
  public rmdir(p: string, cb: Function): void {
    this._rpc('rmdir', arguments);
  }
  public mkdir(p: string, mode: number, cb: Function): void {
    this._rpc('mkdir', arguments);
  }
  public readdir(p: string, cb: BFSCallback<string[]>): void {
    this._rpc('readdir', arguments);
  }
  public exists(p: string, cb: (exists: boolean) => void): void {
    this._rpc('exists', arguments);
  }
  public realpath(p: string, cache: { [path: string]: string }, cb: BFSCallback<string>): void {
    this._rpc('realpath', arguments);
  }
  public truncate(p: string, len: number, cb: Function): void {
    this._rpc('truncate', arguments);
  }
  public readFile(fname: string, encoding: string, flag: FileFlag, cb: BFSCallback<any>): void {
    this._rpc('readFile', arguments);
  }
  public writeFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cb: BFSOneArgCallback): void {
    this._rpc('writeFile', arguments);
  }
  public appendFile(fname: string, data: any, encoding: string, flag: FileFlag, mode: number, cb: BFSOneArgCallback): void {
    this._rpc('appendFile', arguments);
  }
  public chmod(p: string, isLchmod: boolean, mode: number, cb: Function): void {
    this._rpc('chmod', arguments);
  }
  public chown(p: string, isLchown: boolean, uid: number, gid: number, cb: Function): void {
    this._rpc('chown', arguments);
  }
  public utimes(p: string, atime: Date, mtime: Date, cb: Function): void {
    this._rpc('utimes', arguments);
  }
  public link(srcpath: string, dstpath: string, cb: Function): void {
    this._rpc('link', arguments);
  }
  public symlink(srcpath: string, dstpath: string, type: string, cb: Function): void {
    this._rpc('symlink', arguments);
  }
  public readlink(p: string, cb: Function): void {
    this._rpc('readlink', arguments);
  }

  public syncClose(method: string, fd: File, cb: BFSOneArgCallback): void {
    this._worker.postMessage({
      browserfsMessage: true,
      method: method,
      args: [(<WorkerFile> fd).toRemoteArg(), this._callbackConverter.toRemoteArg(cb)]
    });
  }

  /**
   * Called once both local and remote sides are set up.
   */
  private _initialize(cb: () => void): void {
    if (!this._isInitialized) {
      const message: IAPIRequest = {
        browserfsMessage: true,
        method: 'probe',
        args: [this._argLocal2Remote(emptyBuffer()), this._callbackConverter.toRemoteArg((probeResponse: IProbeResponse) => {
          this._isInitialized = true;
          this._isReadOnly = probeResponse.isReadOnly;
          this._supportLinks = probeResponse.supportsLinks;
          this._supportProps = probeResponse.supportsProps;
          cb();
        })]
      };
      this._worker.postMessage(message);
    } else {
      cb();
    }
  }

  private _argRemote2Local(arg: any): any {
    if (!arg) {
      return arg;
    }
    switch (typeof arg) {
      case 'object':
        if (typeof arg['type'] === 'number') {
          const specialArg = <ISpecialArgument> arg;
          switch (specialArg.type) {
            case SpecialArgType.API_ERROR:
              return apiErrorRemote2Local(<IAPIErrorArgument> specialArg);
            case SpecialArgType.FD:
              const fdArg = <IFileDescriptorArgument> specialArg;
              return new WorkerFile(this, fdArg.path, FileFlag.getFileFlag(fdArg.flag), Stats.fromBuffer(transferrableObjectToBuffer(fdArg.stat)), fdArg.id, transferrableObjectToBuffer(fdArg.data));
            case SpecialArgType.STATS:
              return statsRemote2Local(<IStatsArgument> specialArg);
            case SpecialArgType.FILEFLAG:
              return fileFlagRemote2Local(<IFileFlagArgument> specialArg);
            case SpecialArgType.BUFFER:
              return bufferRemote2Local(<IBufferArgument> specialArg);
            case SpecialArgType.ERROR:
              return errorRemote2Local(<IErrorArgument> specialArg);
            default:
              return arg;
          }
        } else {
          return arg;
        }
      default:
        return arg;
    }
  }

  private _rpc(methodName: string, args: IArguments) {
    const fixedArgs = new Array(args.length);
    for (let i = 0; i < args.length; i++) {
      fixedArgs[i] = this._argLocal2Remote(args[i]);
    }
    const message: IAPIRequest = {
      browserfsMessage: true,
      method: methodName,
      args: fixedArgs
    };
    this._worker.postMessage(message);
  }

  /**
   * Converts a local argument into a remote argument. Public so WorkerFile objects can call it.
   */
  private _argLocal2Remote(arg: any): any {
    if (!arg) {
      return arg;
    }
    switch (typeof arg) {
      case "object":
        if (arg instanceof Stats) {
          return statsLocal2Remote(arg);
        } else if (arg instanceof ApiError) {
          return apiErrorLocal2Remote(arg);
        } else if (arg instanceof WorkerFile) {
          return (<WorkerFile> arg).toRemoteArg();
        } else if (arg instanceof FileFlag) {
          return fileFlagLocal2Remote(arg);
        } else if (arg instanceof Buffer) {
          return bufferLocal2Remote(arg);
        } else if (arg instanceof Error) {
          return errorLocal2Remote(arg);
        } else {
          return "Unknown argument";
        }
      case "function":
        return this._callbackConverter.toRemoteArg(arg);
      default:
        return arg;
    }
  }
}
