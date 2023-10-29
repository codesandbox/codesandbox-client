/**
 * Standard libc error codes. Add more to this enum and ErrorStrings as they are
 * needed.
 * @url http://www.gnu.org/software/libc/manual/html_node/Error-Codes.html
 */
export enum ErrorCode {
  EPERM     = 1,
  ENOENT    = 2,
  EIO       = 5,
  EBADF     = 9,
  EACCES    = 13,
  EBUSY     = 16,
  EEXIST    = 17,
  ENOTDIR   = 20,
  EISDIR    = 21,
  EINVAL    = 22,
  EFBIG     = 27,
  ENOSPC    = 28,
  EROFS     = 30,
  ENOTEMPTY = 39,
  ENOTSUP   = 95,
}
/* tslint:disable:variable-name */
/**
 * Strings associated with each error code.
 * @hidden
 */
export const ErrorStrings: {[code: string]: string; [code: number]: string; } = {};
ErrorStrings[ErrorCode.EPERM] = 'Operation not permitted.';
ErrorStrings[ErrorCode.ENOENT] = 'No such file or directory.';
ErrorStrings[ErrorCode.EIO] = 'Input/output error.';
ErrorStrings[ErrorCode.EBADF] = 'Bad file descriptor.';
ErrorStrings[ErrorCode.EACCES] = 'Permission denied.';
ErrorStrings[ErrorCode.EBUSY] = 'Resource busy or locked.';
ErrorStrings[ErrorCode.EEXIST] = 'File exists.';
ErrorStrings[ErrorCode.ENOTDIR] = 'File is not a directory.';
ErrorStrings[ErrorCode.EISDIR] = 'File is a directory.';
ErrorStrings[ErrorCode.EINVAL] = 'Invalid argument.';
ErrorStrings[ErrorCode.EFBIG] = 'File is too big.';
ErrorStrings[ErrorCode.ENOSPC] = 'No space left on disk.';
ErrorStrings[ErrorCode.EROFS] = 'Cannot modify a read-only file system.';
ErrorStrings[ErrorCode.ENOTEMPTY] = 'Directory is not empty.';
ErrorStrings[ErrorCode.ENOTSUP] = 'Operation is not supported.';
/* tslint:enable:variable-name */

/**
 * Represents a BrowserFS error. Passed back to applications after a failed
 * call to the BrowserFS API.
 */
export class ApiError extends Error implements NodeJS.ErrnoException {
  public static fromJSON(json: any): ApiError {
    const err = new ApiError(0 as ErrorCode);
    err.errno = json.errno;
    err.code = json.code;
    err.path = json.path;
    err.stack = json.stack;
    err.message = json.message;
    return err;
  }

  /**
   * Creates an ApiError object from a buffer.
   */
  public static fromBuffer(buffer: Buffer, i: number = 0): ApiError {
    return ApiError.fromJSON(JSON.parse(buffer.toString('utf8', i + 4, i + 4 + buffer.readUInt32LE(i))));
  }

  public static FileError(code: ErrorCode, p: string): ApiError {
    return new ApiError(code, ErrorStrings[code], p);
  }
  public static ENOENT(path: string): ApiError {
    return this.FileError(ErrorCode.ENOENT, path);
  }

  public static EEXIST(path: string): ApiError {
    return this.FileError(ErrorCode.EEXIST, path);
  }

  public static EISDIR(path: string): ApiError {
    return this.FileError(ErrorCode.EISDIR, path);
  }

  public static ENOTDIR(path: string): ApiError {
    return this.FileError(ErrorCode.ENOTDIR, path);
  }

  public static EPERM(path: string): ApiError {
    return this.FileError(ErrorCode.EPERM, path);
  }

  public static ENOTEMPTY(path: string): ApiError {
    return this.FileError(ErrorCode.ENOTEMPTY, path);
  }

  public errno: ErrorCode;
  public code: string;
  public path: string | undefined;
  // Unsupported.
  public syscall: string = "";
  public stack: string | undefined;

  /**
   * Represents a BrowserFS error. Passed back to applications after a failed
   * call to the BrowserFS API.
   *
   * Error codes mirror those returned by regular Unix file operations, which is
   * what Node returns.
   * @constructor ApiError
   * @param type The type of the error.
   * @param [message] A descriptive error message.
   */
  constructor(type: ErrorCode, message: string = ErrorStrings[type], path?: string) {
    super(message);
    this.errno = type;
    this.code = ErrorCode[type];
    this.path = path;
    this.stack = new Error().stack;
    this.message = `Error: ${this.code}: ${message}${this.path ? `, '${this.path}'` : ''}`;
  }

  /**
   * @return A friendly error message.
   */
  public toString(): string {
    return this.message;
  }

  public toJSON(): any {
    return {
      errno: this.errno,
      code: this.code,
      path: this.path,
      stack: this.stack,
      message: this.message
    };
  }

  /**
   * Writes the API error into a buffer.
   */
  public writeToBuffer(buffer: Buffer = Buffer.alloc(this.bufferSize()), i: number = 0): Buffer {
    const bytesWritten = buffer.write(JSON.stringify(this.toJSON()), i + 4);
    buffer.writeUInt32LE(bytesWritten, i);
    return buffer;
  }

  /**
   * The size of the API error in buffer-form in bytes.
   */
  public bufferSize(): number {
    // 4 bytes for string length.
    return 4 + Buffer.byteLength(JSON.stringify(this.toJSON()));
  }
}
