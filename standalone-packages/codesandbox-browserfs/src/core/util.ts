/**
 * Grab bag of utility functions used across the code.
 */
import {FileSystem, BFSOneArgCallback, FileSystemConstructor} from './file_system';
import {ErrorCode, ApiError} from './api_error';
import levenshtein from './levenshtein';
import * as path from 'path';

export function deprecationMessage(print: boolean, fsName: string, opts: any): void {
  if (print) {
    // tslint:disable-next-line:no-console
    console.warn(`[${fsName}] Direct file system constructor usage is deprecated for this file system, and will be removed in the next major version. Please use the '${fsName}.Create(${JSON.stringify(opts)}, callback)' method instead. See https://github.com/jvilk/BrowserFS/issues/176 for more details.`);
    // tslint:enable-next-line:no-console
  }
}

/**
 * Checks for any IE version, including IE11 which removed MSIE from the
 * userAgent string.
 * @hidden
 */
export const isIE: boolean = typeof navigator !== "undefined" && Boolean(/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || navigator.userAgent.indexOf('Trident') !== -1);

/**
 * Check if we're in a web worker.
 * @hidden
 */
export const isWebWorker: boolean = typeof window === "undefined";

/**
 * @hidden
 */
export interface Arrayish<T> {
  [idx: number]: T;
  length: number;
}

/**
 * Throws an exception. Called on code paths that should be impossible.
 * @hidden
 */
export function fail() {
  throw new Error("BFS has reached an impossible code path; please file a bug.");
}

/**
 * Synchronous recursive makedir.
 * @hidden
 */
export function mkdirpSync(p: string, mode: number, fs: FileSystem): void {
  if (!fs.existsSync(p)) {
    mkdirpSync(path.dirname(p), mode, fs);
    fs.mkdirSync(p, mode);
  }
}

/**
 * Converts a buffer into an array buffer. Attempts to do so in a
 * zero-copy manner, e.g. the array references the same memory.
 * @hidden
 */
export function buffer2ArrayBuffer(buff: Buffer): ArrayBuffer | SharedArrayBuffer {
  const u8 = buffer2Uint8array(buff),
    u8offset = u8.byteOffset,
    u8Len = u8.byteLength;
  if (u8offset === 0 && u8Len === u8.buffer.byteLength) {
    return u8.buffer;
  } else {
    return u8.buffer.slice(u8offset, u8offset + u8Len);
  }
}

/**
 * Converts a buffer into a Uint8Array. Attempts to do so in a
 * zero-copy manner, e.g. the array references the same memory.
 * @hidden
 */
export function buffer2Uint8array(buff: Buffer): Uint8Array {
  if (buff instanceof Uint8Array) {
    // BFS & Node v4.0 buffers *are* Uint8Arrays.
    return <any> buff;
  } else {
    // Uint8Arrays can be constructed from arrayish numbers.
    // At this point, we assume this isn't a BFS array.
    return new Uint8Array(buff);
  }
}

/**
 * Converts the given arrayish object into a Buffer. Attempts to
 * be zero-copy.
 * @hidden
 */
export function arrayish2Buffer(arr: Arrayish<number>): Buffer {
  if (arr instanceof Buffer) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return uint8Array2Buffer(arr);
  } else {
    return Buffer.from(<number[]> arr);
  }
}

/**
 * Converts the given Uint8Array into a Buffer. Attempts to be zero-copy.
 * @hidden
 */
export function uint8Array2Buffer(u8: Uint8Array): Buffer {
  if (u8 instanceof Buffer) {
    return u8;
  } else if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength) {
    return arrayBuffer2Buffer(u8.buffer);
  } else {
    return Buffer.from(<ArrayBuffer> u8.buffer, u8.byteOffset, u8.byteLength);
  }
}

/**
 * Converts the given array buffer into a Buffer. Attempts to be
 * zero-copy.
 * @hidden
 */
export function arrayBuffer2Buffer(ab: ArrayBuffer | SharedArrayBuffer): Buffer {
  return Buffer.from(<ArrayBuffer> ab);
}

/**
 * Copies a slice of the given buffer
 * @hidden
 */
export function copyingSlice(buff: Buffer, start: number = 0, end = buff.length): Buffer {
  if (start < 0 || end < 0 || end > buff.length || start > end) {
    throw new TypeError(`Invalid slice bounds on buffer of length ${buff.length}: [${start}, ${end}]`);
  }
  if (buff.length === 0) {
    // Avoid s0 corner case in ArrayBuffer case.
    return emptyBuffer();
  } else {
    const u8 = buffer2Uint8array(buff),
      s0 = buff[0],
      newS0 = (s0 + 1) % 0xFF;

    buff[0] = newS0;
    if (u8[0] === newS0) {
      // Same memory. Revert & copy.
      u8[0] = s0;
      return uint8Array2Buffer(u8.slice(start, end));
    } else {
      // Revert.
      buff[0] = s0;
      return uint8Array2Buffer(u8.subarray(start, end));
    }
  }
}

/**
 * @hidden
 */
let emptyBuff: Buffer | null = null;
/**
 * Returns an empty buffer.
 * @hidden
 */
export function emptyBuffer(): Buffer {
  if (emptyBuff) {
    return emptyBuff;
  }
  return emptyBuff = Buffer.alloc(0);
}

/**
 * Option validator for a Buffer file system option.
 * @hidden
 */
export function bufferValidator(v: object, cb: BFSOneArgCallback): void {
  if (Buffer.isBuffer(v)) {
    cb();
  } else {
    cb(new ApiError(ErrorCode.EINVAL, `option must be a Buffer.`));
  }
}

/**
 * Checks that the given options object is valid for the file system options.
 * @hidden
 */
export function checkOptions(fsType: FileSystemConstructor, opts: any, cb: BFSOneArgCallback): void {
  const optsInfo = fsType.Options;
  const fsName = fsType.Name;

  let pendingValidators = 0;
  let callbackCalled = false;
  let loopEnded = false;
  function validatorCallback(e?: ApiError): void {
    if (!callbackCalled) {
      if (e) {
        callbackCalled = true;
        cb(e);
      }
      pendingValidators--;
      if (pendingValidators === 0 && loopEnded) {
        cb();
      }
    }
  }

  // Check for required options.
  for (const optName in optsInfo) {
    if (optsInfo.hasOwnProperty(optName)) {
      const opt = optsInfo[optName];
      const providedValue = opts[optName];

      if (providedValue === undefined || providedValue === null) {
        if (!opt.optional) {
          // Required option, not provided.
          // Any incorrect options provided? Which ones are close to the provided one?
          // (edit distance 5 === close)
          const incorrectOptions = Object.keys(opts).filter((o) => !(o in optsInfo)).map((a: string) => {
            return {str: a, distance: levenshtein(optName, a)};
          }).filter((o) => o.distance < 5).sort((a, b) => a.distance - b.distance);
          // Validators may be synchronous.
          if (callbackCalled) {
            return;
          }
          callbackCalled = true;
          return cb(new ApiError(ErrorCode.EINVAL, `[${fsName}] Required option '${optName}' not provided.${incorrectOptions.length > 0 ? ` You provided unrecognized option '${incorrectOptions[0].str}'; perhaps you meant to type '${optName}'.` : ''}\nOption description: ${opt.description}`));
        }
        // Else: Optional option, not provided. That is OK.
      } else {
        // Option provided! Check type.
        let typeMatches = false;
        if (Array.isArray(opt.type)) {
          typeMatches = opt.type.indexOf(typeof(providedValue)) !== -1;
        } else {
          typeMatches = typeof(providedValue) === opt.type;
        }
        if (!typeMatches) {
          // Validators may be synchronous.
          if (callbackCalled) {
            return;
          }
          callbackCalled = true;
          return cb(new ApiError(ErrorCode.EINVAL, `[${fsName}] Value provided for option ${optName} is not the proper type. Expected ${Array.isArray(opt.type) ? `one of {${opt.type.join(", ")}}` : opt.type}, but received ${typeof(providedValue)}\nOption description: ${opt.description}`));
        } else if (opt.validator) {
          pendingValidators++;
          opt.validator(providedValue, validatorCallback);
        }
        // Otherwise: All good!
      }
    }
  }
  loopEnded = true;
  if (pendingValidators === 0 && !callbackCalled) {
    cb();
  }
}
