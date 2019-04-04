import {BaseFileSystem, SynchronousFileSystem, BFSOneArgCallback, BFSCallback, BFSThreeArgCallback} from '../core/file_system';
import {ApiError, ErrorCode} from '../core/api_error';
import {default as Stats, FileType} from '../core/node_fs_stats';
import {File} from '../core/file';
import {FileFlag} from '../core/file_flag';
import * as path from 'path';
import Inode from '../generic/inode';
import PreloadFile from '../generic/preload_file';
import {emptyBuffer} from '../core/util';
/**
 * @hidden
 */
const ROOT_NODE_ID: string = "/";
/**
 * @hidden
 */
let emptyDirNode: Buffer | null = null;
/**
 * Returns an empty directory node.
 * @hidden
 */
function getEmptyDirNode(): Buffer {
  if (emptyDirNode) {
    return emptyDirNode;
  }
  return emptyDirNode = Buffer.from("{}");
}

/**
 * Generates a random ID.
 * @hidden
 */
function GenerateRandomID(): string {
  // From http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Helper function. Checks if 'e' is defined. If so, it triggers the callback
 * with 'e' and returns false. Otherwise, returns true.
 * @hidden
 */
function noError(e: ApiError | undefined | null, cb: (e: ApiError) => void): boolean {
  if (e) {
    cb(e);
    return false;
  }
  return true;
}

/**
 * Helper function. Checks if 'e' is defined. If so, it aborts the transaction,
 * triggers the callback with 'e', and returns false. Otherwise, returns true.
 * @hidden
 */
function noErrorTx(e: ApiError | undefined | null, tx: AsyncKeyValueRWTransaction, cb: (e: ApiError) => void): boolean {
  if (e) {
    tx.abort(() => {
      cb(e);
    });
    return false;
  }
  return true;
}

/**
 * Represents a *synchronous* key-value store.
 */
export interface SyncKeyValueStore {
  /**
   * The name of the key-value store.
   */
  name(): string;
  /**
   * Empties the key-value store completely.
   */
  clear(): void;
  /**
   * Begins a new read-only transaction.
   */
  beginTransaction(type: "readonly"): SyncKeyValueROTransaction;
  /**
   * Begins a new read-write transaction.
   */
  beginTransaction(type: "readwrite"): SyncKeyValueRWTransaction;
  beginTransaction(type: string): SyncKeyValueROTransaction;
}

/**
 * A read-only transaction for a synchronous key value store.
 */
export interface SyncKeyValueROTransaction {
  /**
   * Retrieves the data at the given key. Throws an ApiError if an error occurs
   * or if the key does not exist.
   * @param key The key to look under for data.
   * @return The data stored under the key, or undefined if not present.
   */
  get(key: string): Buffer | undefined;
}

/**
 * A read-write transaction for a synchronous key value store.
 */
export interface SyncKeyValueRWTransaction extends SyncKeyValueROTransaction {
  /**
   * Adds the data to the store under the given key.
   * @param key The key to add the data under.
   * @param data The data to add to the store.
   * @param overwrite If 'true', overwrite any existing data. If 'false',
   *   avoids storing the data if the key exists.
   * @return True if storage succeeded, false otherwise.
   */
  put(key: string, data: Buffer, overwrite: boolean): boolean;
  /**
   * Deletes the data at the given key.
   * @param key The key to delete from the store.
   */
  del(key: string): void;
  /**
   * Commits the transaction.
   */
  commit(): void;
  /**
   * Aborts and rolls back the transaction.
   */
  abort(): void;
}

/**
 * An interface for simple synchronous key-value stores that don't have special
 * support for transactions and such.
 */
export interface SimpleSyncStore {
  get(key: string): Buffer | undefined;
  put(key: string, data: Buffer, overwrite: boolean): boolean;
  del(key: string): void;
}

class LRUNode {
  public prev: LRUNode | null = null;
  public next: LRUNode | null = null;
  constructor(public key: string, public value: string) {}
}

// Adapted from https://chrisrng.svbtle.com/lru-cache-in-javascript
class LRUCache {
  private size = 0;
  private map: {[id: string]: LRUNode} = {};
  private head: LRUNode | null = null;
  private tail: LRUNode | null = null;
  constructor(public readonly limit: number) {}

  /**
   * Change or add a new value in the cache
   * We overwrite the entry if it already exists
   */
  public set(key: string, value: string): void {
    const node = new LRUNode(key, value);
    if (this.map[key]) {
      this.map[key].value = node.value;
      this.remove(node.key);
    } else {
      if (this.size >= this.limit) {
        delete this.map[this.tail!.key];
        this.size--;
        this.tail = this.tail!.prev;
        this.tail!.next = null;
      }
    }
    this.setHead(node);
  }

  /* Retrieve a single entry from the cache */
  public get(key: string): string | null {
    if (this.map[key]) {
      const value = this.map[key].value;
      const node = new LRUNode(key, value);
      this.remove(key);
      this.setHead(node);
      return value;
    } else {
      return null;
    }
  }

  /* Remove a single entry from the cache */
  public remove(key: string): void {
    const node = this.map[key];
    if (!node) {
      return;
    }
    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if (node.next !== null) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    delete this.map[key];
    this.size--;
  }

  /* Resets the entire cache - Argument limit is optional to be reset */
  public removeAll() {
    this.size = 0;
    this.map = {};
    this.head = null;
    this.tail = null;
  }

  private setHead(node: LRUNode): void {
    node.next = this.head;
    node.prev = null;
    if (this.head !== null) {
        this.head.prev = node;
    }
    this.head = node;
    if (this.tail === null) {
        this.tail = node;
    }
    this.size++;
    this.map[node.key] = node;
  }
}

/**
 * A simple RW transaction for simple synchronous key-value stores.
 */
export class SimpleSyncRWTransaction implements SyncKeyValueRWTransaction {
  /**
   * Stores data in the keys we modify prior to modifying them.
   * Allows us to roll back commits.
   */
  private originalData: { [key: string]: Buffer | undefined } = {};
  /**
   * List of keys modified in this transaction, if any.
   */
  private modifiedKeys: string[] = [];

  constructor(private store: SimpleSyncStore) { }

  public get(key: string): Buffer | undefined {
    const val = this.store.get(key);
    this.stashOldValue(key, val);
    return val;
  }

  public put(key: string, data: Buffer, overwrite: boolean): boolean {
    this.markModified(key);
    return this.store.put(key, data, overwrite);
  }

  public del(key: string): void {
    this.markModified(key);
    this.store.del(key);
  }

  public commit(): void {/* NOP */}

  public abort(): void {
    // Rollback old values.
    for (const key of this.modifiedKeys) {
      const value = this.originalData[key];
      if (!value) {
        // Key didn't exist.
        this.store.del(key);
      } else {
        // Key existed. Store old value.
        this.store.put(key, value, true);
      }
    }
  }

  /**
   * Stashes given key value pair into `originalData` if it doesn't already
   * exist. Allows us to stash values the program is requesting anyway to
   * prevent needless `get` requests if the program modifies the data later
   * on during the transaction.
   */
  private stashOldValue(key: string, value: Buffer | undefined) {
    // Keep only the earliest value in the transaction.
    if (!this.originalData.hasOwnProperty(key)) {
      this.originalData[key] = value;
    }
  }

  /**
   * Marks the given key as modified, and stashes its value if it has not been
   * stashed already.
   */
  private markModified(key: string) {
    if (this.modifiedKeys.indexOf(key) === -1) {
      this.modifiedKeys.push(key);
      if (!this.originalData.hasOwnProperty(key)) {
        this.originalData[key] = this.store.get(key);
      }
    }
  }
}

export interface SyncKeyValueFileSystemOptions {
  /**
   * The actual key-value store to read from/write to.
   */
  store: SyncKeyValueStore;
  /**
   * Should the file system support properties (mtime/atime/ctime/chmod/etc)?
   * Enabling this slightly increases the storage space per file, and adds
   * atime updates every time a file is accessed, mtime updates every time
   * a file is modified, and permission checks on every operation.
   *
   * Defaults to *false*.
   */
  // supportProps?: boolean;
  /**
   * Should the file system support links?
   */
  // supportLinks?: boolean;
}

export class SyncKeyValueFile extends PreloadFile<SyncKeyValueFileSystem> implements File {
  constructor(_fs: SyncKeyValueFileSystem, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
    super(_fs, _path, _flag, _stat, contents);
  }

  public syncSync(): void {
    if (this.isDirty()) {
      this._fs._syncSync(this.getPath(), this.getBuffer(), this.getStats());
      this.resetDirty();
    }
  }

  public closeSync(): void {
    this.syncSync();
  }
}

/**
 * A "Synchronous key-value file system". Stores data to/retrieves data from an
 * underlying key-value store.
 *
 * We use a unique ID for each node in the file system. The root node has a
 * fixed ID.
 * @todo Introduce Node ID caching.
 * @todo Check modes.
 */
export class SyncKeyValueFileSystem extends SynchronousFileSystem {
  public static isAvailable(): boolean { return true; }

  private store: SyncKeyValueStore;

  constructor(options: SyncKeyValueFileSystemOptions) {
    super();
    this.store = options.store;
    // INVARIANT: Ensure that the root exists.
    this.makeRootDirectory();
  }

  public getName(): string { return this.store.name(); }
  public isReadOnly(): boolean { return false; }
  public supportsSymlinks(): boolean { return false; }
  public supportsProps(): boolean { return false; }
  public supportsSynch(): boolean { return true; }

  /**
   * Delete all contents stored in the file system.
   */
  public empty(): void {
    this.store.clear();
    // INVARIANT: Root always exists.
    this.makeRootDirectory();
  }

  public renameSync(oldPath: string, newPath: string): void {
    const tx = this.store.beginTransaction('readwrite'),
      oldParent = path.dirname(oldPath), oldName = path.basename(oldPath),
      newParent = path.dirname(newPath), newName = path.basename(newPath),
      // Remove oldPath from parent's directory listing.
      oldDirNode = this.findINode(tx, oldParent),
      oldDirList = this.getDirListing(tx, oldParent, oldDirNode);

    if (!oldDirList[oldName]) {
      throw ApiError.ENOENT(oldPath);
    }
    const nodeId: string = oldDirList[oldName];
    delete oldDirList[oldName];

    // Invariant: Can't move a folder inside itself.
    // This funny little hack ensures that the check passes only if oldPath
    // is a subpath of newParent. We append '/' to avoid matching folders that
    // are a substring of the bottom-most folder in the path.
    if ((newParent + '/').indexOf(oldPath + '/') === 0) {
      throw new ApiError(ErrorCode.EBUSY, oldParent);
    }

    // Add newPath to parent's directory listing.
    let newDirNode: Inode, newDirList: typeof oldDirList;
    if (newParent === oldParent) {
      // Prevent us from re-grabbing the same directory listing, which still
      // contains oldName.
      newDirNode = oldDirNode;
      newDirList = oldDirList;
    } else {
      newDirNode = this.findINode(tx, newParent);
      newDirList = this.getDirListing(tx, newParent, newDirNode);
    }

    if (newDirList[newName]) {
      // If it's a file, delete it.
      const newNameNode = this.getINode(tx, newPath, newDirList[newName]);
      if (newNameNode.isFile()) {
        try {
          tx.del(newNameNode.id);
          tx.del(newDirList[newName]);
        } catch (e) {
          tx.abort();
          throw e;
        }
      } else {
        // If it's a directory, throw a permissions error.
        throw ApiError.EPERM(newPath);
      }
    }
    newDirList[newName] = nodeId;

    // Commit the two changed directory listings.
    try {
      tx.put(oldDirNode.id, Buffer.from(JSON.stringify(oldDirList)), true);
      tx.put(newDirNode.id, Buffer.from(JSON.stringify(newDirList)), true);
    } catch (e) {
      tx.abort();
      throw e;
    }

    tx.commit();
  }

  public statSync(p: string, isLstat: boolean): Stats {
    // Get the inode to the item, convert it into a Stats object.
    return this.findINode(this.store.beginTransaction('readonly'), p).toStats();
  }

  public createFileSync(p: string, flag: FileFlag, mode: number): File {
    const tx = this.store.beginTransaction('readwrite'),
      data = emptyBuffer(),
      newFile = this.commitNewFile(tx, p, FileType.FILE, mode, data);
    // Open the file.
    return new SyncKeyValueFile(this, p, flag, newFile.toStats(), data);
  }

  public openFileSync(p: string, flag: FileFlag): File {
    const tx = this.store.beginTransaction('readonly'),
      node = this.findINode(tx, p),
      data = tx.get(node.id);
    if (data === undefined) {
      throw ApiError.ENOENT(p);
    }
    return new SyncKeyValueFile(this, p, flag, node.toStats(), data);
  }

  public unlinkSync(p: string): void {
    this.removeEntry(p, false);
  }

  public rmdirSync(p: string): void {
    // Check first if directory is empty.
    if (this.readdirSync(p).length > 0) {
      throw ApiError.ENOTEMPTY(p);
    } else {
      this.removeEntry(p, true);
    }
  }

  public mkdirSync(p: string, mode: number): void {
    const tx = this.store.beginTransaction('readwrite'),
      data = Buffer.from('{}');
    this.commitNewFile(tx, p, FileType.DIRECTORY, mode, data);
  }

  public readdirSync(p: string): string[] {
    const tx = this.store.beginTransaction('readonly');
    return Object.keys(this.getDirListing(tx, p, this.findINode(tx, p)));
  }

  public _syncSync(p: string, data: Buffer, stats: Stats): void {
    // @todo Ensure mtime updates properly, and use that to determine if a data
    //       update is required.
    const tx = this.store.beginTransaction('readwrite'),
      // We use the _findInode helper because we actually need the INode id.
      fileInodeId = this._findINode(tx, path.dirname(p), path.basename(p)),
      fileInode = this.getINode(tx, p, fileInodeId),
      inodeChanged = fileInode.update(stats);

    try {
      // Sync data.
      tx.put(fileInode.id, data, true);
      // Sync metadata.
      if (inodeChanged) {
        tx.put(fileInodeId, fileInode.toBuffer(), true);
      }
    } catch (e) {
      tx.abort();
      throw e;
    }
    tx.commit();
  }

  /**
   * Checks if the root directory exists. Creates it if it doesn't.
   */
  private makeRootDirectory() {
    const tx = this.store.beginTransaction('readwrite');
    if (tx.get(ROOT_NODE_ID) === undefined) {
      // Create new inode.
      const currTime = (new Date()).getTime(),
        // Mode 0666
        dirInode = new Inode(GenerateRandomID(), 4096, 511 | FileType.DIRECTORY, currTime, currTime, currTime);
      // If the root doesn't exist, the first random ID shouldn't exist,
      // either.
      tx.put(dirInode.id, getEmptyDirNode(), false);
      tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false);
      tx.commit();
    }
  }

  /**
   * Helper function for findINode.
   * @param parent The parent directory of the file we are attempting to find.
   * @param filename The filename of the inode we are attempting to find, minus
   *   the parent.
   * @return string The ID of the file's inode in the file system.
   */
  private _findINode(tx: SyncKeyValueROTransaction, parent: string, filename: string): string {
    const readDirectory = (inode: Inode): string => {
      // Get the root's directory listing.
      const dirList = this.getDirListing(tx, parent, inode);
      // Get the file's ID.
      if (dirList[filename]) {
        return dirList[filename];
      } else {
        throw ApiError.ENOENT(path.resolve(parent, filename));
      }
    };
    if (parent === '/') {
      if (filename === '') {
        // BASE CASE #1: Return the root's ID.
        return ROOT_NODE_ID;
      } else {
        // BASE CASE #2: Find the item in the root ndoe.
        return readDirectory(this.getINode(tx, parent, ROOT_NODE_ID));
      }
    } else {
      return readDirectory(this.getINode(tx, parent + path.sep + filename,
        this._findINode(tx, path.dirname(parent), path.basename(parent))));
    }
  }

  /**
   * Finds the Inode of the given path.
   * @param p The path to look up.
   * @return The Inode of the path p.
   * @todo memoize/cache
   */
  private findINode(tx: SyncKeyValueROTransaction, p: string): Inode {
    return this.getINode(tx, p, this._findINode(tx, path.dirname(p), path.basename(p)));
  }

  /**
   * Given the ID of a node, retrieves the corresponding Inode.
   * @param tx The transaction to use.
   * @param p The corresponding path to the file (used for error messages).
   * @param id The ID to look up.
   */
  private getINode(tx: SyncKeyValueROTransaction, p: string, id: string): Inode {
    const inode = tx.get(id);
    if (inode === undefined) {
      throw ApiError.ENOENT(p);
    }
    return Inode.fromBuffer(inode);
  }

  /**
   * Given the Inode of a directory, retrieves the corresponding directory
   * listing.
   */
  private getDirListing(tx: SyncKeyValueROTransaction, p: string, inode: Inode): { [fileName: string]: string } {
    if (!inode.isDirectory()) {
      throw ApiError.ENOTDIR(p);
    }
    const data = tx.get(inode.id);
    if (data === undefined) {
      throw ApiError.ENOENT(p);
    }
    return JSON.parse(data.toString());
  }

  /**
   * Creates a new node under a random ID. Retries 5 times before giving up in
   * the exceedingly unlikely chance that we try to reuse a random GUID.
   * @return The GUID that the data was stored under.
   */
  private addNewNode(tx: SyncKeyValueRWTransaction, data: Buffer): string {
    const retries = 0;
    let currId: string;
    while (retries < 5) {
      try {
        currId = GenerateRandomID();
        tx.put(currId, data, false);
        return currId;
      } catch (e) {
        // Ignore and reroll.
      }
    }
    throw new ApiError(ErrorCode.EIO, 'Unable to commit data to key-value store.');
  }

  /**
   * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
   * the given mode.
   * Note: This will commit the transaction.
   * @param p The path to the new file.
   * @param type The type of the new file.
   * @param mode The mode to create the new file with.
   * @param data The data to store at the file's data node.
   * @return The Inode for the new file.
   */
  private commitNewFile(tx: SyncKeyValueRWTransaction, p: string, type: FileType, mode: number, data: Buffer): Inode {
    const parentDir = path.dirname(p),
      fname = path.basename(p),
      parentNode = this.findINode(tx, parentDir),
      dirListing = this.getDirListing(tx, parentDir, parentNode),
      currTime = (new Date()).getTime();

    // Invariant: The root always exists.
    // If we don't check this prior to taking steps below, we will create a
    // file with name '' in root should p == '/'.
    if (p === '/') {
      throw ApiError.EEXIST(p);
    }

    // Check if file already exists.
    if (dirListing[fname]) {
      throw ApiError.EEXIST(p);
    }

    let fileNode: Inode;
    try {
      // Commit data.
      const dataId = this.addNewNode(tx, data);
      fileNode = new Inode(dataId, data.length, mode | type, currTime, currTime, currTime);
      // Commit file node.
      const fileNodeId = this.addNewNode(tx, fileNode.toBuffer());
      // Update and commit parent directory listing.
      dirListing[fname] = fileNodeId;
      tx.put(parentNode.id, Buffer.from(JSON.stringify(dirListing)), true);
    } catch (e) {
      tx.abort();
      throw e;
    }
    tx.commit();
    return fileNode;
  }

  /**
   * Remove all traces of the given path from the file system.
   * @param p The path to remove from the file system.
   * @param isDir Does the path belong to a directory, or a file?
   * @todo Update mtime.
   */
  private removeEntry(p: string, isDir: boolean): void {
    const tx = this.store.beginTransaction('readwrite'),
      parent: string = path.dirname(p),
      parentNode = this.findINode(tx, parent),
      parentListing = this.getDirListing(tx, parent, parentNode),
      fileName: string = path.basename(p);

    if (!parentListing[fileName]) {
      throw ApiError.ENOENT(p);
    }

    // Remove from directory listing of parent.
    const fileNodeId = parentListing[fileName];
    delete parentListing[fileName];

    // Get file inode.
    const fileNode = this.getINode(tx, p, fileNodeId);
    if (!isDir && fileNode.isDirectory()) {
      throw ApiError.EISDIR(p);
    } else if (isDir && !fileNode.isDirectory()) {
      throw ApiError.ENOTDIR(p);
    }

    try {
      // Delete data.
      tx.del(fileNode.id);
      // Delete node.
      tx.del(fileNodeId);
      // Update directory listing.
      tx.put(parentNode.id, Buffer.from(JSON.stringify(parentListing)), true);
    } catch (e) {
      tx.abort();
      throw e;
    }
    // Success.
    tx.commit();
  }
}

/**
 * Represents an *asynchronous* key-value store.
 */
export interface AsyncKeyValueStore {
  /**
   * The name of the key-value store.
   */
  name(): string;
  /**
   * Empties the key-value store completely.
   */
  clear(cb: BFSOneArgCallback): void;
  /**
   * Begins a read-write transaction.
   */
  beginTransaction(type: 'readwrite'): AsyncKeyValueRWTransaction;
  /**
   * Begins a read-only transaction.
   */
  beginTransaction(type: 'readonly'): AsyncKeyValueROTransaction;
  beginTransaction(type: string): AsyncKeyValueROTransaction;
}

/**
 * Represents an asynchronous read-only transaction.
 */
export interface AsyncKeyValueROTransaction {
  /**
   * Retrieves the data at the given key.
   * @param key The key to look under for data.
   */
  get(key: string, cb: BFSCallback<Buffer>): void;
}

/**
 * Represents an asynchronous read-write transaction.
 */
export interface AsyncKeyValueRWTransaction extends AsyncKeyValueROTransaction {
  /**
   * Adds the data to the store under the given key. Overwrites any existing
   * data.
   * @param key The key to add the data under.
   * @param data The data to add to the store.
   * @param overwrite If 'true', overwrite any existing data. If 'false',
   *   avoids writing the data if the key exists.
   * @param cb Triggered with an error and whether or not the value was
   *   committed.
   */
  put(key: string, data: Buffer, overwrite: boolean, cb: BFSCallback<boolean>): void;
  /**
   * Deletes the data at the given key.
   * @param key The key to delete from the store.
   */
  del(key: string, cb: BFSOneArgCallback): void;
  /**
   * Commits the transaction.
   */
  commit(cb: BFSOneArgCallback): void;
  /**
   * Aborts and rolls back the transaction.
   */
  abort(cb: BFSOneArgCallback): void;
}

export class AsyncKeyValueFile extends PreloadFile<AsyncKeyValueFileSystem> implements File {
  constructor(_fs: AsyncKeyValueFileSystem, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
    super(_fs, _path, _flag, _stat, contents);
  }

  public sync(cb: BFSOneArgCallback): void {
    if (this.isDirty()) {
      this._fs._sync(this.getPath(), this.getBuffer(), this.getStats(), (e?: ApiError) => {
        if (!e) {
          this.resetDirty();
        }
        cb(e);
      });
    } else {
      cb();
    }
  }

  public close(cb: BFSOneArgCallback): void {
    this.sync(cb);
  }
}

/**
 * An "Asynchronous key-value file system". Stores data to/retrieves data from
 * an underlying asynchronous key-value store.
 */
export class AsyncKeyValueFileSystem extends BaseFileSystem {
  public static isAvailable(): boolean { return true; }

  protected store: AsyncKeyValueStore;
  private _cache: LRUCache | null = null;

  constructor(cacheSize: number) {
    super();
    if (cacheSize > 0) {
      this._cache = new LRUCache(cacheSize);
    }
  }

  /**
   * Initializes the file system. Typically called by subclasses' async
   * constructors.
   */
  public init(store: AsyncKeyValueStore, cb: BFSOneArgCallback) {
    this.store = store;
    // INVARIANT: Ensure that the root exists.
    this.makeRootDirectory(cb);
  }
  public getName(): string { return this.store.name(); }
  public isReadOnly(): boolean { return false; }
  public supportsSymlinks(): boolean { return false; }
  public supportsProps(): boolean { return false; }
  public supportsSynch(): boolean { return false; }

  /**
   * Delete all contents stored in the file system.
   */
  public empty(cb: BFSOneArgCallback): void {
    if (this._cache) {
      this._cache.removeAll();
    }
    this.store.clear((e?) => {
      if (noError(e, cb)) {
        // INVARIANT: Root always exists.
        this.makeRootDirectory(cb);
      }
    });
  }

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    // TODO: Make rename compatible with the cache.
    if (this._cache) {
      // Clear and disable cache during renaming process.
      const c = this._cache;
      this._cache = null;
      c.removeAll();
      const oldCb = cb;
      cb = (e?: ApiError | null) => {
        // Restore empty cache.
        this._cache = c;
        oldCb(e);
      };
    }

    const tx = this.store.beginTransaction('readwrite');
    const oldParent = path.dirname(oldPath), oldName = path.basename(oldPath);
    const newParent = path.dirname(newPath), newName = path.basename(newPath);
    const inodes: { [path: string]: Inode } = {};
    const lists: {
      [path: string]: { [file: string]: string }
    } = {};
    let errorOccurred: boolean = false;

    // Invariant: Can't move a folder inside itself.
    // This funny little hack ensures that the check passes only if oldPath
    // is a subpath of newParent. We append '/' to avoid matching folders that
    // are a substring of the bottom-most folder in the path.
    if ((newParent + '/').indexOf(oldPath + '/') === 0) {
      return cb(new ApiError(ErrorCode.EBUSY, oldParent));
    }

    /**
     * Responsible for Phase 2 of the rename operation: Modifying and
     * committing the directory listings. Called once we have successfully
     * retrieved both the old and new parent's inodes and listings.
     */
    const theOleSwitcharoo = (): void => {
      // Sanity check: Ensure both paths are present, and no error has occurred.
      if (errorOccurred || !lists.hasOwnProperty(oldParent) || !lists.hasOwnProperty(newParent)) {
        return;
      }
      const oldParentList = lists[oldParent], oldParentINode = inodes[oldParent],
        newParentList = lists[newParent], newParentINode = inodes[newParent];

      // Delete file from old parent.
      if (!oldParentList[oldName]) {
        cb(ApiError.ENOENT(oldPath));
      } else {
        const fileId = oldParentList[oldName];
        delete oldParentList[oldName];

        // Finishes off the renaming process by adding the file to the new
        // parent.
        const completeRename = () => {
          newParentList[newName] = fileId;
          // Commit old parent's list.
          tx.put(oldParentINode.id, Buffer.from(JSON.stringify(oldParentList)), true, (e: ApiError) => {
            if (noErrorTx(e, tx, cb)) {
              if (oldParent === newParent) {
                // DONE!
                tx.commit(cb);
              } else {
                // Commit new parent's list.
                tx.put(newParentINode.id, Buffer.from(JSON.stringify(newParentList)), true, (e: ApiError) => {
                  if (noErrorTx(e, tx, cb)) {
                    tx.commit(cb);
                  }
                });
              }
            }
          });
        };

        if (newParentList[newName]) {
          // 'newPath' already exists. Check if it's a file or a directory, and
          // act accordingly.
          this.getINode(tx, newPath, newParentList[newName], (e: ApiError, inode?: Inode) => {
            if (noErrorTx(e, tx, cb)) {
              if (inode!.isFile()) {
                // Delete the file and continue.
                tx.del(inode!.id, (e?: ApiError) => {
                  if (noErrorTx(e, tx, cb)) {
                    tx.del(newParentList[newName], (e?: ApiError) => {
                      if (noErrorTx(e, tx, cb)) {
                        completeRename();
                      }
                    });
                  }
                });
              } else {
                // Can't overwrite a directory using rename.
                tx.abort((e?) => {
                  cb(ApiError.EPERM(newPath));
                });
              }
            }
          });
        } else {
          completeRename();
        }
      }
    };

    /**
     * Grabs a path's inode and directory listing, and shoves it into the
     * inodes and lists hashes.
     */
    const processInodeAndListings = (p: string): void => {
      this.findINodeAndDirListing(tx, p, (e?: ApiError | null, node?: Inode, dirList?: {[name: string]: string}): void => {
        if (e) {
          if (!errorOccurred) {
            errorOccurred = true;
            tx.abort(() => {
              cb(e);
            });
          }
          // If error has occurred already, just stop here.
        } else {
          inodes[p] = node!;
          lists[p] = dirList!;
          theOleSwitcharoo();
        }
      });
    };

    processInodeAndListings(oldParent);
    if (oldParent !== newParent) {
      processInodeAndListings(newParent);
    }
  }

  public stat(p: string, isLstat: boolean, cb: BFSCallback<Stats>): void {
    const tx = this.store.beginTransaction('readonly');
    this.findINode(tx, p, (e: ApiError, inode?: Inode): void => {
      if (noError(e, cb)) {
        cb(null, inode!.toStats());
      }
    });
  }

  public createFile(p: string, flag: FileFlag, mode: number, cb: BFSCallback<File>): void {
    const tx = this.store.beginTransaction('readwrite'),
      data = emptyBuffer();

    this.commitNewFile(tx, p, FileType.FILE, mode, data, (e: ApiError, newFile?: Inode): void => {
      if (noError(e, cb)) {
        cb(null, new AsyncKeyValueFile(this, p, flag, newFile!.toStats(), data));
      }
    });
  }

  public openFile(p: string, flag: FileFlag, cb: BFSCallback<File>): void {
    const tx = this.store.beginTransaction('readonly');
    // Step 1: Grab the file's inode.
    this.findINode(tx, p, (e: ApiError, inode?: Inode) => {
      if (noError(e, cb)) {
        // Step 2: Grab the file's data.
        tx.get(inode!.id, (e: ApiError, data?: Buffer): void => {
          if (noError(e, cb)) {
            if (data === undefined) {
              cb(ApiError.ENOENT(p));
            } else {
              cb(null, new AsyncKeyValueFile(this, p, flag, inode!.toStats(), data));
            }
          }
        });
      }
    });
  }

  public unlink(p: string, cb: BFSOneArgCallback): void {
    this.removeEntry(p, false, cb);
  }

  public rmdir(p: string, cb: BFSOneArgCallback): void {
    // Check first if directory is empty.
    this.readdir(p, (err, files?) => {
      if (err) {
        cb(err);
      } else if (files!.length > 0) {
        cb(ApiError.ENOTEMPTY(p));
      } else {
        this.removeEntry(p, true, cb);
      }
    });
  }

  public mkdir(p: string, mode: number, cb: BFSOneArgCallback): void {
    const tx = this.store.beginTransaction('readwrite'),
      data = Buffer.from('{}');
    this.commitNewFile(tx, p, FileType.DIRECTORY, mode, data, cb);
  }

  public readdir(p: string, cb: BFSCallback<string[]>): void {
    const tx = this.store.beginTransaction('readonly');
    this.findINode(tx, p, (e: ApiError, inode?: Inode) => {
      if (noError(e, cb)) {
        this.getDirListing(tx, p, inode!, (e: ApiError, dirListing?: {[name: string]: string}) => {
          if (noError(e, cb)) {
            cb(null, Object.keys(dirListing!));
          }
        });
      }
    });
  }

  public _sync(p: string, data: Buffer, stats: Stats, cb: BFSOneArgCallback): void {
    // @todo Ensure mtime updates properly, and use that to determine if a data
    //       update is required.
    const tx = this.store.beginTransaction('readwrite');
    // Step 1: Get the file node's ID.
    this._findINode(tx, path.dirname(p), path.basename(p), (e: ApiError, fileInodeId?: string): void => {
      if (noErrorTx(e, tx, cb)) {
        // Step 2: Get the file inode.
        this.getINode(tx, p, fileInodeId!, (e: ApiError, fileInode?: Inode): void => {
          if (noErrorTx(e, tx, cb)) {
            const inodeChanged: boolean = fileInode!.update(stats);
            // Step 3: Sync the data.
            tx.put(fileInode!.id, data, true, (e: ApiError): void => {
              if (noErrorTx(e, tx, cb)) {
                // Step 4: Sync the metadata (if it changed)!
                if (inodeChanged) {
                  tx.put(fileInodeId!, fileInode!.toBuffer(), true, (e: ApiError): void => {
                    if (noErrorTx(e, tx, cb)) {
                      tx.commit(cb);
                    }
                  });
                } else {
                  // No need to sync metadata; return.
                  tx.commit(cb);
                }
              }
            });
          }
        });
      }
    });
  }

  /**
   * Checks if the root directory exists. Creates it if it doesn't.
   */
  private makeRootDirectory(cb: BFSOneArgCallback) {
    const tx = this.store.beginTransaction('readwrite');
    tx.get(ROOT_NODE_ID, (e: ApiError, data?: Buffer) => {
      if (e || data === undefined) {
        // Create new inode.
        const currTime = (new Date()).getTime(),
          // Mode 0666
          dirInode = new Inode(GenerateRandomID(), 4096, 511 | FileType.DIRECTORY, currTime, currTime, currTime);
        // If the root doesn't exist, the first random ID shouldn't exist,
        // either.
        tx.put(dirInode.id, getEmptyDirNode(), false, (e?: ApiError) => {
          if (noErrorTx(e, tx, cb)) {
            tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false, (e?: ApiError) => {
              if (e) {
                tx.abort(() => { cb(e); });
              } else {
                tx.commit(cb);
              }
            });
          }
        });
      } else {
        // We're good.
        tx.commit(cb);
      }
    });
  }

  /**
   * Helper function for findINode.
   * @param parent The parent directory of the file we are attempting to find.
   * @param filename The filename of the inode we are attempting to find, minus
   *   the parent.
   * @param cb Passed an error or the ID of the file's inode in the file system.
   */
  private _findINode(tx: AsyncKeyValueROTransaction, parent: string, filename: string, cb: BFSCallback<string>): void {
    if (this._cache) {
      const id = this._cache.get(path.join(parent, filename));
      if (id) {
        return cb(null, id);
      }
    }
    const handleDirectoryListings = (e?: ApiError | null, inode?: Inode, dirList?: {[name: string]: string}): void => {
      if (e) {
        cb(e);
      } else if (dirList![filename]) {
        const id = dirList![filename];
        if (this._cache) {
          this._cache.set(path.join(parent, filename), id);
        }
        cb(null, id);
      } else {
        cb(ApiError.ENOENT(path.resolve(parent, filename)));
      }
    };

    if (parent === '/') {
      if (filename === '') {
        // BASE CASE #1: Return the root's ID.
        if (this._cache) {
          this._cache.set(path.join(parent, filename), ROOT_NODE_ID);
        }
        cb(null, ROOT_NODE_ID);
      } else {
        // BASE CASE #2: Find the item in the root node.
        this.getINode(tx, parent, ROOT_NODE_ID, (e: ApiError, inode?: Inode): void => {
          if (noError(e, cb)) {
            this.getDirListing(tx, parent, inode!, (e: ApiError, dirList?: {[name: string]: string}): void => {
              // handle_directory_listings will handle e for us.
              handleDirectoryListings(e, inode, dirList);
            });
          }
        });
      }
    } else {
      // Get the parent directory's INode, and find the file in its directory
      // listing.
      this.findINodeAndDirListing(tx, parent, handleDirectoryListings);
    }
  }

  /**
   * Finds the Inode of the given path.
   * @param p The path to look up.
   * @param cb Passed an error or the Inode of the path p.
   * @todo memoize/cache
   */
  private findINode(tx: AsyncKeyValueROTransaction, p: string, cb: BFSCallback<Inode>): void {
    this._findINode(tx, path.dirname(p), path.basename(p), (e: ApiError, id?: string): void => {
      if (noError(e, cb)) {
        this.getINode(tx, p, id!, cb);
      }
    });
  }

  /**
   * Given the ID of a node, retrieves the corresponding Inode.
   * @param tx The transaction to use.
   * @param p The corresponding path to the file (used for error messages).
   * @param id The ID to look up.
   * @param cb Passed an error or the inode under the given id.
   */
  private getINode(tx: AsyncKeyValueROTransaction, p: string, id: string, cb: BFSCallback<Inode>): void {
    tx.get(id, (e: ApiError, data?: Buffer): void => {
      if (noError(e, cb)) {
        if (data === undefined) {
          cb(ApiError.ENOENT(p));
        } else {
          cb(null, Inode.fromBuffer(data));
        }
      }
    });
  }

  /**
   * Given the Inode of a directory, retrieves the corresponding directory
   * listing.
   */
  private getDirListing(tx: AsyncKeyValueROTransaction, p: string, inode: Inode, cb: BFSCallback<{ [fileName: string]: string }>): void {
    if (!inode.isDirectory()) {
      cb(ApiError.ENOTDIR(p));
    } else {
      tx.get(inode.id, (e: ApiError, data?: Buffer): void => {
        if (noError(e, cb)) {
          try {
            cb(null, JSON.parse(data!.toString()));
          } catch (e) {
            // Occurs when data is undefined, or corresponds to something other
            // than a directory listing. The latter should never occur unless
            // the file system is corrupted.
            cb(ApiError.ENOENT(p));
          }
        }
      });
    }
  }

  /**
   * Given a path to a directory, retrieves the corresponding INode and
   * directory listing.
   */
  private findINodeAndDirListing(tx: AsyncKeyValueROTransaction, p: string, cb: BFSThreeArgCallback<Inode, { [fileName: string]: string }>): void {
    this.findINode(tx, p, (e: ApiError, inode?: Inode): void => {
      if (noError(e, cb)) {
        this.getDirListing(tx, p, inode!, (e, listing?) => {
          if (noError(e, cb)) {
            cb(null, inode!, listing!);
          }
        });
      }
    });
  }

  /**
   * Adds a new node under a random ID. Retries 5 times before giving up in
   * the exceedingly unlikely chance that we try to reuse a random GUID.
   * @param cb Passed an error or the GUID that the data was stored under.
   */
  private addNewNode(tx: AsyncKeyValueRWTransaction, data: Buffer, cb: BFSCallback<string>): void {
    let retries = 0, currId: string;
    const reroll = () => {
      if (++retries === 5) {
        // Max retries hit. Return with an error.
        cb(new ApiError(ErrorCode.EIO, 'Unable to commit data to key-value store.'));
      } else {
        // Try again.
        currId = GenerateRandomID();
        tx.put(currId, data, false, (e: ApiError, committed?: boolean) => {
          if (e || !committed) {
            reroll();
          } else {
            // Successfully stored under 'currId'.
            cb(null, currId);
          }
        });
      }
    };
    reroll();
  }

  /**
   * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
   * the given mode.
   * Note: This will commit the transaction.
   * @param p The path to the new file.
   * @param type The type of the new file.
   * @param mode The mode to create the new file with.
   * @param data The data to store at the file's data node.
   * @param cb Passed an error or the Inode for the new file.
   */
  private commitNewFile(tx: AsyncKeyValueRWTransaction, p: string, type: FileType, mode: number, data: Buffer, cb: BFSCallback<Inode>): void {
    const parentDir = path.dirname(p),
      fname = path.basename(p),
      currTime = (new Date()).getTime();

    // Invariant: The root always exists.
    // If we don't check this prior to taking steps below, we will create a
    // file with name '' in root should p == '/'.
    if (p === '/') {
      return cb(ApiError.EEXIST(p));
    }

    // Let's build a pyramid of code!

    // Step 1: Get the parent directory's inode and directory listing
    this.findINodeAndDirListing(tx, parentDir, (e?: ApiError | null, parentNode?: Inode, dirListing?: {[name: string]: string}): void => {
      if (noErrorTx(e, tx, cb)) {
        if (dirListing![fname]) {
          // File already exists.
          tx.abort(() => {
            cb(ApiError.EEXIST(p));
          });
        } else {
          // Step 2: Commit data to store.
          this.addNewNode(tx, data, (e: ApiError, dataId?: string): void => {
            if (noErrorTx(e, tx, cb)) {
              // Step 3: Commit the file's inode to the store.
              const fileInode = new Inode(dataId!, data.length, mode | type, currTime, currTime, currTime);
              this.addNewNode(tx, fileInode.toBuffer(), (e: ApiError, fileInodeId?: string): void => {
                if (noErrorTx(e, tx, cb)) {
                  // Step 4: Update parent directory's listing.
                  dirListing![fname] = fileInodeId!;
                  tx.put(parentNode!.id, Buffer.from(JSON.stringify(dirListing)), true, (e: ApiError): void => {
                    if (noErrorTx(e, tx, cb)) {
                      // Step 5: Commit and return the new inode.
                      tx.commit((e?: ApiError): void => {
                        if (noErrorTx(e, tx, cb)) {
                          cb(null, fileInode);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }

  /**
   * Remove all traces of the given path from the file system.
   * @param p The path to remove from the file system.
   * @param isDir Does the path belong to a directory, or a file?
   * @todo Update mtime.
   */
  private removeEntry(p: string, isDir: boolean, cb: BFSOneArgCallback): void {
    // Eagerly delete from cache (harmless even if removal fails)
    if (this._cache) {
      this._cache.remove(p);
    }
    const tx = this.store.beginTransaction('readwrite'),
      parent: string = path.dirname(p), fileName: string = path.basename(p);
    // Step 1: Get parent directory's node and directory listing.
    this.findINodeAndDirListing(tx, parent, (e?: ApiError | null, parentNode?: Inode, parentListing?: {[name: string]: string}): void => {
      if (noErrorTx(e, tx, cb)) {
        if (!parentListing![fileName]) {
          tx.abort(() => {
            cb(ApiError.ENOENT(p));
          });
        } else {
          // Remove from directory listing of parent.
          const fileNodeId = parentListing![fileName];
          delete parentListing![fileName];
          // Step 2: Get file inode.
          this.getINode(tx, p, fileNodeId, (e: ApiError, fileNode?: Inode): void => {
            if (noErrorTx(e, tx, cb)) {
              if (!isDir && fileNode!.isDirectory()) {
                tx.abort(() => {
                  cb(ApiError.EISDIR(p));
                });
              } else if (isDir && !fileNode!.isDirectory()) {
                tx.abort(() => {
                  cb(ApiError.ENOTDIR(p));
                });
              } else {
                // Step 3: Delete data.
                tx.del(fileNode!.id, (e?: ApiError): void => {
                  if (noErrorTx(e, tx, cb)) {
                    // Step 4: Delete node.
                    tx.del(fileNodeId, (e?: ApiError): void => {
                      if (noErrorTx(e, tx, cb)) {
                        // Step 5: Update directory listing.
                        tx.put(parentNode!.id, Buffer.from(JSON.stringify(parentListing)), true, (e: ApiError): void => {
                          if (noErrorTx(e, tx, cb)) {
                            tx.commit(cb);
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  }
}
