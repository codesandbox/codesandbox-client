import {BFSOneArgCallback, BFSCallback, FileSystemOptions} from '../core/file_system';
import {AsyncKeyValueROTransaction, AsyncKeyValueRWTransaction, AsyncKeyValueStore, AsyncKeyValueFileSystem} from '../generic/key_value_filesystem';
import {ApiError, ErrorCode} from '../core/api_error';
import global from '../core/global';
import {arrayBuffer2Buffer, buffer2ArrayBuffer} from '../core/util';
/**
 * Get the indexedDB constructor for the current browser.
 * @hidden
 */
const indexedDB: IDBFactory = global.indexedDB ||
                          (<any> global).mozIndexedDB ||
                          (<any> global).webkitIndexedDB ||
                          global.msIndexedDB;

/**
 * Converts a DOMException or a DOMError from an IndexedDB event into a
 * standardized BrowserFS API error.
 * @hidden
 */
function convertError(e: {name: string}, message: string = e.toString()): ApiError {
  switch (e.name) {
    case "NotFoundError":
      return new ApiError(ErrorCode.ENOENT, message);
    case "QuotaExceededError":
      return new ApiError(ErrorCode.ENOSPC, message);
    default:
      // The rest do not seem to map cleanly to standard error codes.
      return new ApiError(ErrorCode.EIO, message);
  }
}

/**
 * Produces a new onerror handler for IDB. Our errors are always fatal, so we
 * handle them generically: Call the user-supplied callback with a translated
 * version of the error, and let the error bubble up.
 * @hidden
 */
function onErrorHandler(cb: (e: ApiError) => void, code: ErrorCode = ErrorCode.EIO, message: string | null = null): (e?: any) => void {
  return function(e?: any): void {
    // Prevent the error from canceling the transaction.
    e.preventDefault();
    cb(new ApiError(code, message !== null ? message : undefined));
  };
}

/**
 * @hidden
 */
export class IndexedDBROTransaction implements AsyncKeyValueROTransaction {
  constructor(public tx: IDBTransaction, public store: IDBObjectStore) { }

  public get(key: string, cb: BFSCallback<Buffer>): void {
    try {
      const r: IDBRequest = this.store.get(key);
      r.onerror = onErrorHandler(cb);
      r.onsuccess = (event) => {
        // IDB returns the value 'undefined' when you try to get keys that
        // don't exist. The caller expects this behavior.
        const result: any = (<any> event.target).result;
        if (result === undefined) {
          cb(null, result);
        } else {
          // IDB data is stored as an ArrayBuffer
          cb(null, arrayBuffer2Buffer(result));
        }
      };
    } catch (e) {
      cb(convertError(e));
    }
  }
}

/**
 * @hidden
 */
export class IndexedDBRWTransaction extends IndexedDBROTransaction implements AsyncKeyValueRWTransaction, AsyncKeyValueROTransaction {
  constructor(tx: IDBTransaction, store: IDBObjectStore) {
    super(tx, store);
  }

  public put(key: string, data: Buffer, overwrite: boolean, cb: BFSCallback<boolean>): void {
    try {
      const arraybuffer = buffer2ArrayBuffer(data);
      let r: IDBRequest;
      // Note: 'add' will never overwrite an existing key.
      r = overwrite ? this.store.put(arraybuffer, key) : this.store.add(arraybuffer, key);
      // XXX: NEED TO RETURN FALSE WHEN ADD HAS A KEY CONFLICT. NO ERROR.
      r.onerror = onErrorHandler(cb);
      r.onsuccess = (event) => {
        cb(null, true);
      };
    } catch (e) {
      cb(convertError(e));
    }
  }

  public del(key: string, cb: BFSOneArgCallback): void {
    try {
      // NOTE: IE8 has a bug with identifiers named 'delete' unless used as a string
      // like this.
      // http://stackoverflow.com/a/26479152
      const r: IDBRequest = this.store['delete'](key);
      r.onerror = onErrorHandler(cb);
      r.onsuccess = (event) => {
        cb();
      };
    } catch (e) {
      cb(convertError(e));
    }
  }

  public commit(cb: BFSOneArgCallback): void {
    // Return to the event loop to commit the transaction.
    setTimeout(cb, 0);
  }

  public abort(cb: BFSOneArgCallback): void {
    let _e: ApiError | null = null;
    try {
      this.tx.abort();
    } catch (e) {
      _e = convertError(e);
    } finally {
      cb(_e);
    }
  }
}

export class IndexedDBStore implements AsyncKeyValueStore {
  public static Create(storeName: string, cb: BFSCallback<IndexedDBStore>): void {
    const openReq: IDBOpenDBRequest = indexedDB.open(storeName, 1);

    openReq.onupgradeneeded = (event) => {
      const db: IDBDatabase = (<any> event.target).result;
      // Huh. This should never happen; we're at version 1. Why does another
      // database exist?
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }
      db.createObjectStore(storeName);
    };

    openReq.onsuccess = (event) => {
      cb(null, new IndexedDBStore((<any> event.target).result, storeName));
    };

    openReq.onerror = onErrorHandler(cb, ErrorCode.EACCES);
  }

  constructor(private db: IDBDatabase, private storeName: string) {

  }

  public name(): string {
    return IndexedDBFileSystem.Name + " - " + this.storeName;
  }

  public clear(cb: BFSOneArgCallback): void {
    try {
      const tx = this.db.transaction(this.storeName, 'readwrite'),
        objectStore = tx.objectStore(this.storeName),
        r: IDBRequest = objectStore.clear();
      r.onsuccess = (event) => {
        // Use setTimeout to commit transaction.
        setTimeout(cb, 0);
      };
      r.onerror = onErrorHandler(cb);
    } catch (e) {
      cb(convertError(e));
    }
  }

  public beginTransaction(type: 'readonly'): AsyncKeyValueROTransaction;
  public beginTransaction(type: 'readwrite'): AsyncKeyValueRWTransaction;
  public beginTransaction(type: 'readonly' | 'readwrite' = 'readonly'): AsyncKeyValueROTransaction {
    const tx = this.db.transaction(this.storeName, type),
      objectStore = tx.objectStore(this.storeName);
    if (type === 'readwrite') {
      return new IndexedDBRWTransaction(tx, objectStore);
    } else if (type === 'readonly') {
      return new IndexedDBROTransaction(tx, objectStore);
    } else {
      throw new ApiError(ErrorCode.EINVAL, 'Invalid transaction type.');
    }
  }
}

/**
 * Configuration options for the IndexedDB file system.
 */
export interface IndexedDBFileSystemOptions {
  // The name of this file system. You can have multiple IndexedDB file systems operating
  // at once, but each must have a different name.
  storeName?: string;
  // The size of the inode cache. Defaults to 100. A size of 0 or below disables caching.
  cacheSize?: number;
}

/**
 * A file system that uses the IndexedDB key value file system.
 */
export default class IndexedDBFileSystem extends AsyncKeyValueFileSystem {
  public static readonly Name = "IndexedDB";

  public static readonly Options: FileSystemOptions = {
    storeName: {
      type: "string",
      optional: true,
      description: "The name of this file system. You can have multiple IndexedDB file systems operating at once, but each must have a different name."
    },
    cacheSize: {
      type: "number",
      optional: true,
      description: "The size of the inode cache. Defaults to 100. A size of 0 or below disables caching."
    }
  };

  /**
   * Constructs an IndexedDB file system with the given options.
   */
  public static Create(opts: IndexedDBFileSystemOptions, cb: BFSCallback<IndexedDBFileSystem>): void {
    IndexedDBStore.Create(opts.storeName ? opts.storeName : 'browserfs', (e, store?) => {
      if (store) {
        const idbfs = new IndexedDBFileSystem(typeof(opts.cacheSize) === 'number' ? opts.cacheSize : 100);
        idbfs.init(store, (e) => {
          if (e) {
            cb(e);
          } else {
            cb(null, idbfs);
          }
        });
      } else {
        cb(e);
      }
    });
  }
  public static isAvailable(): boolean {
    // In Safari's private browsing mode, indexedDB.open returns NULL.
    // In Firefox, it throws an exception.
    // In Chrome, it "just works", and clears the database when you leave the page.
    // Untested: Opera, IE.
    try {
      return typeof indexedDB !== 'undefined' && null !== indexedDB.open("__browserfs_test__");
    } catch (e) {
      return false;
    }
  }
  private constructor(cacheSize: number) {
    super(cacheSize);
  }
}
