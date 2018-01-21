import {BFSCallback, FileSystemOptions} from '../core/file_system';
import {SyncKeyValueStore, SimpleSyncStore, SyncKeyValueFileSystem, SimpleSyncRWTransaction, SyncKeyValueRWTransaction} from '../generic/key_value_filesystem';
import {ApiError, ErrorCode} from '../core/api_error';
import global from '../core/global';

/**
 * Some versions of FF and all versions of IE do not support the full range of
 * 16-bit numbers encoded as characters, as they enforce UTF-16 restrictions.
 * @url http://stackoverflow.com/questions/11170716/are-there-any-characters-that-are-not-allowed-in-localstorage/11173673#11173673
 * @hidden
 */
let supportsBinaryString: boolean = false,
  binaryEncoding: string;
try {
  global.localStorage.setItem("__test__", String.fromCharCode(0xD800));
  supportsBinaryString = global.localStorage.getItem("__test__") === String.fromCharCode(0xD800);
} catch (e) {
  // IE throws an exception.
  supportsBinaryString = false;
}
binaryEncoding = supportsBinaryString ? 'binary_string' : 'binary_string_ie';
if (!Buffer.isEncoding(binaryEncoding)) {
  // Fallback for non BrowserFS implementations of buffer that lack a
  // binary_string format.
  binaryEncoding = "base64";
}

/**
 * A synchronous key-value store backed by localStorage.
 */
export class LocalStorageStore implements SyncKeyValueStore, SimpleSyncStore {
  public name(): string {
    return LocalStorageFileSystem.Name;
  }

  public clear(): void {
    global.localStorage.clear();
  }

  public beginTransaction(type: string): SyncKeyValueRWTransaction {
    // No need to differentiate.
    return new SimpleSyncRWTransaction(this);
  }

  public get(key: string): Buffer | undefined {
    try {
      const data = global.localStorage.getItem(key);
      if (data !== null) {
        return Buffer.from(data, binaryEncoding);
      }
    } catch (e) {
      // Do nothing.
    }
    // Key doesn't exist, or a failure occurred.
    return undefined;
  }

  public put(key: string, data: Buffer, overwrite: boolean): boolean {
    try {
      if (!overwrite && global.localStorage.getItem(key) !== null) {
        // Don't want to overwrite the key!
        return false;
      }
      global.localStorage.setItem(key, data.toString(binaryEncoding));
      return true;
    } catch (e) {
      throw new ApiError(ErrorCode.ENOSPC, "LocalStorage is full.");
    }
  }

  public del(key: string): void {
    try {
      global.localStorage.removeItem(key);
    } catch (e) {
      throw new ApiError(ErrorCode.EIO, "Unable to delete key " + key + ": " + e);
    }
  }
}

/**
 * A synchronous file system backed by localStorage. Connects our
 * LocalStorageStore to our SyncKeyValueFileSystem.
 */
export default class LocalStorageFileSystem extends SyncKeyValueFileSystem {
  public static readonly Name = "LocalStorage";

  public static readonly Options: FileSystemOptions = {};

  /**
   * Creates a LocalStorageFileSystem instance.
   */
  public static Create(options: any, cb: BFSCallback<LocalStorageFileSystem>): void {
    cb(null, new LocalStorageFileSystem());
  }
  public static isAvailable(): boolean {
    return typeof global.localStorage !== 'undefined';
  }
  /**
   * Creates a new LocalStorage file system using the contents of `localStorage`.
   */
  private constructor() { super({ store: new LocalStorageStore() }); }
}
