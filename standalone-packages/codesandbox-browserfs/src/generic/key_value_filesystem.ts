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
 * Возвращает пустой узел каталога.
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
 * Вспомогательная функция. Проверяет, определено ли 'e'. 
 * Если это так, он запускает обратный вызов с помощью 'e' и возвращает false. В противном случае возвращает истину.
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
 * Вспомогательная функция. Проверяет, определено ли 'e'. 
 Если это так, транзакция прерывается, запускается обратный вызов с помощью 'e' и возвращается false. В противном случае возвращает истину.
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
 * 
 */
export interface SyncKeyValueStore {
  /**
   * Представляет *синхронное* хранилище ключей и значений.
   */
  name(): string;
  /**
   * Полностью очищает хранилище ключей и значений.
   */
  clear(): void;
  /**
   * Начинает новую транзакцию только для чтения.
   */
  beginTransaction(type: "readonly"): SyncKeyValueROTransaction;
  /**
   * Начинает новую транзакцию чтения-записи.
   */
  beginTransaction(type: "readwrite"): SyncKeyValueRWTransaction;
  beginTransaction(type: string): SyncKeyValueROTransaction;
}

/**
 * Транзакция только для чтения для синхронного хранилища значений ключей.
 */
export interface SyncKeyValueROTransaction {
  /**
   * Извлекает данные по заданному ключу. Выбрасывает ApiError, если возникает ошибка * или если ключ не существует.
   * @param key Ключ для поиска данных.
   * @return Данные, хранящиеся под ключом, или неопределенные, если они отсутствуют.
   */
  get(key: string): Buffer | undefined;
}

/**
 * Транзакция чтения-записи для синхронного хранилища значений ключей.
 */
export interface SyncKeyValueRWTransaction extends SyncKeyValueROTransaction {
  /**
   * Добавляет данные в хранилище по заданному ключу.
   * @param key Ключ для добавления данных.
   * @param data Данные для добавления в магазин.
   * @param overwrite Если «истина», перезаписать все существующие данные. Если «ложно», избегает сохранения данных, если ключ существует.
   * @return Истина, если хранилище удалось, в противном случае - false
   */
  put(key: string, data: Buffer, overwrite: boolean): boolean;
  /**
   * Удаляет данные по данному ключу.
   * @param key Ключ удалить из магазина.
   */
  del(key: string): void;
  /**
   * Совершает транзакцию.
   */
  commit(): void;
  /**
   * Прерывает и откатывает транзакцию.
   */
  abort(): void;
}

/**
 * Интерфейс для простых синхронных хранилищ ключей и значений, не имеющих специальной поддержки транзакций и т. Д.
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

// Адаптировано из https://chrisrng.svbtle.com/lru-cache-in-javascript
class LRUCache {
  private size = 0;
  private map: {[id: string]: LRUNode} = {};
  private head: LRUNode | null = null;
  private tail: LRUNode | null = null;
  constructor(public readonly limit: number) {}

  /**
   * Измените или добавьте новое значение в кеш
   * Мы перезаписываем запись, если она уже существует
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

  /* Получить одну запись из кеша */
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

  /* Удалить одну запись из кеша */
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

  /* Сбрасывает весь кеш - ограничение аргумента необязательно сбрасывать */
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
 * Простая транзакция RW для простых синхронных хранилищ ключей и значений.
 */
export class SimpleSyncRWTransaction implements SyncKeyValueRWTransaction {
  /**
   * Сохраняет данные в ключах, которые мы изменяем перед их изменением.
   * Allows us to roll back commits.
   */
  private originalData: { [key: string]: Buffer | undefined } = {};
  /**
   * Список ключей, измененных в этой транзакции, если таковые имеются.
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
   * Сохраняет заданную пару значений ключа в `originalData`, если она еще не существует. 
   * Позволяет нам хранить значения, которые программа запрашивает в любом случае, чтобы предотвратить ненужные запросы `get`, 
   * если программа изменяет данные позже во время транзакции.
   */
  private stashOldValue(key: string, value: Buffer | undefined) {
    // Keep only the earliest value in the transaction.
    if (!this.originalData.hasOwnProperty(key)) {
      this.originalData[key] = value;
    }
  }

  /**
   * Отмечает данный ключ как измененный и сохраняет его значение, если оно ещё не было сохранено.
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
   * Фактическое хранилище значений ключей для чтения/записи.
   */
  store: SyncKeyValueStore;
  /**
   * Должна ли файловая система поддерживать свойства (mtime/atime/ctime/chmod/etc)?
   * Включение этого немного увеличивает пространство для хранения для каждого файла и добавляет временные обновления при каждом доступе к файлу, 
   * mtime обновляется каждый раз при изменении файла и проверки прав доступа при каждой операции.
   *
   * По умолчанию *false*.
   */
  // supportProps?: логический;
  /**
   * Должна ли файловая система поддерживать ссылки?
   */
  // supportLinks?: логический;
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
 * "Синхронная файловая система" ключ-значение ". Хранит данные в / извлекает данные из базового хранилища ключей и значений.
 *
 * Мы используем уникальный идентификатор для каждого узла в файловой системе. Корневой узел имеет фиксированный идентификатор.
 * @todo Введение кэширования идентификаторов Node.
 * @todo Проверить режимы.
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
   * Удалите все содержимое, хранящееся в файловой системе.
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

    // Неизменяемый: нельзя переместить папку внутри себя.
    // Этот забавный небольшой прием гарантирует, что проверка пройдет, только если oldPath является подпутьем newParent. 
    // Мы добавляем '/', чтобы избежать совпадения папок, которые являются подстрокой самой нижней папки в пути.
    if ((newParent + '/').indexOf(oldPath + '/') === 0) {
      throw new ApiError(ErrorCode.EBUSY, oldParent);
    }

    // Добавьте newPath в список родительских каталогов.
    let newDirNode: Inode, newDirList: typeof oldDirList;
    if (newParent === oldParent) {
      // Не позволяйте нам повторно получить тот же список каталогов, который все еще содержит oldName.
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
        // Если это каталог, выдает ошибку разрешений.
        throw ApiError.EPERM(newPath);
      }
    }
    newDirList[newName] = nodeId;

    // Зафиксируйте два измененных списка каталогов.
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
    // Получите индексный дескриптор элемента, преобразуйте его в объект статистики.
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
    // @todo Убедитесь, что mtime обновляется правильно, и используйте это, чтобы определить, требуется ли обновление данных.
    const tx = this.store.beginTransaction('readwrite'),
      // Мы используем помощник _findInode, потому что нам действительно нужен идентификатор INode.
      fileInodeId = this._findINode(tx, path.dirname(p), path.basename(p)),
      fileInode = this.getINode(tx, p, fileInodeId),
      inodeChanged = fileInode.update(stats);

    try {
      // Синхронизировать данные.
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
   * Проверяет, существует ли корневой каталог. Создает его, если нет.
   */
  private makeRootDirectory() {
    const tx = this.store.beginTransaction('readwrite');
    if (tx.get(ROOT_NODE_ID) === undefined) {
      // Создайте новый индексный дескриптор.
      const currTime = (new Date()).getTime(),
        // Mode 0666
        dirInode = new Inode(GenerateRandomID(), 4096, 511 | FileType.DIRECTORY, currTime, currTime, currTime);
      // Если корень не существует, тоже не должно быть первого случайного идентификатора.
      tx.put(dirInode.id, getEmptyDirNode(), false);
      tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false);
      tx.commit();
    }
  }

  /**
   * Вспомогательная функция для findINode.
   * @param parent Родительский каталог файла, который мы пытаемся найти.
   * @param filename Имя файла inode, который мы пытаемся найти, минус родительский.
   * @return string Идентификатор индексного дескриптора файла в файловой системе.
   */
  private _findINode(tx: SyncKeyValueROTransaction, parent: string, filename: string): string {
    const readDirectory = (inode: Inode): string => {
      // Получите список корневого каталога.
      const dirList = this.getDirListing(tx, parent, inode);
      // Получите идентификатор файла.
      if (dirList[filename]) {
        return dirList[filename];
      } else {
        throw ApiError.ENOENT(path.resolve(parent, filename));
      }
    };
    if (parent === '/') {
      if (filename === '') {
        // БАЗОВЫЙ СЛУЧАЙ №1: вернуть идентификатор корня.
        return ROOT_NODE_ID;
      } else {
        // БАЗОВЫЙ СЛУЧАЙ №2: Найдите элемент в корневом каталоге ndoe.
        return readDirectory(this.getINode(tx, parent, ROOT_NODE_ID));
      }
    } else {
      return readDirectory(this.getINode(tx, parent + path.sep + filename,
        this._findINode(tx, path.dirname(parent), path.basename(parent))));
    }
  }

  /**
   * Находит индекс заданного пути.
   * @param p Путь для поиска.
   * @return Inode пути p.
   * @todo memoize/cache
   */
  private findINode(tx: SyncKeyValueROTransaction, p: string): Inode {
    return this.getINode(tx, p, this._findINode(tx, path.dirname(p), path.basename(p)));
  }

  /**
   * По идентификатору узла получает соответствующий индексный дескриптор.
   * @param tx Используемая транзакция.
   * @param p Соответствующий путь к файлу (используется для сообщений об ошибках).
   * @param id ID для поиска.
   */
  private getINode(tx: SyncKeyValueROTransaction, p: string, id: string): Inode {
    const inode = tx.get(id);
    if (inode === undefined) {
      throw ApiError.ENOENT(p);
    }
    return Inode.fromBuffer(inode);
  }

  /**
   * Учитывая индексный дескриптор каталога, получает список соответствующего каталога.
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
   * Создает новый узел со случайным идентификатором. 
   * Попытки повторяются 5 раз, прежде чем отказаться от чрезвычайно маловероятной возможности повторного использования случайного GUID.
   * @return GUID, под которым хранились данные.
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
        // Игнорировать и перебрасывать.
      }
    }
    throw new ApiError(ErrorCode.EIO, 'Невозможно передать данные в хранилище "ключ-значение".');
  }

  /**
   * Фиксирует новый файл (ну, ФАЙЛ или КАТАЛОГ) в файловую систему с заданным режимом.
   * Note: Это зафиксирует транзакцию.
   * @param p Путь к новому файлу.
   * @param type Тип нового файла.
   * @param mode Режим для создания нового файла.
   * @param data Данные для хранения в узле данных файла.
   * @return Inode для нового файла.
   */
  private commitNewFile(tx: SyncKeyValueRWTransaction, p: string, type: FileType, mode: number, data: Buffer): Inode {
    const parentDir = path.dirname(p),
      fname = path.basename(p),
      parentNode = this.findINode(tx, parentDir),
      dirListing = this.getDirListing(tx, parentDir, parentNode),
      currTime = (new Date()).getTime();

    // Инвариант: корень существует всегда.
    // Если мы не проверим это перед выполнением шагов ниже, мы создадим файл с именем '' в корне, должно p == '/'.
    if (p === '/') {
      throw ApiError.EEXIST(p);
    }

    // Проверьте, существует ли уже файл.
    if (dirListing[fname]) {
      throw ApiError.EEXIST(p);
    }

    let fileNode: Inode;
    try {
      // Зафиксируйте данные.
      const dataId = this.addNewNode(tx, data);
      fileNode = new Inode(dataId, data.length, mode | type, currTime, currTime, currTime);
      // Зафиксировать node файла.
      const fileNodeId = this.addNewNode(tx, fileNode.toBuffer());
      // Обновите и зафиксируйте список родительских каталогов.
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
   * Удалите все следы указанного пути из файловой системы.
   * @param p Путь для удаления из файловой системы.
   * @param isDir Путь принадлежит каталогу или файлу?
   * @todo Обновите mtime.
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

    // Удалить из каталога родительский листинг.
    const fileNodeId = parentListing[fileName];
    delete parentListing[fileName];

    // Получить индекс файла.
    const fileNode = this.getINode(tx, p, fileNodeId);
    if (!isDir && fileNode.isDirectory()) {
      throw ApiError.EISDIR(p);
    } else if (isDir && !fileNode.isDirectory()) {
      throw ApiError.ENOTDIR(p);
    }

    try {
      // Удалить данные.
      tx.del(fileNode.id);
      // Удалить узел.
      tx.del(fileNodeId);
      // Обновить список каталогов.
      tx.put(parentNode.id, Buffer.from(JSON.stringify(parentListing)), true);
    } catch (e) {
      tx.abort();
      throw e;
    }
    // Успех.
    tx.commit();
  }
}

/**
 * Представляет *асинхронное* хранилище ключей и значений.
 */
export interface AsyncKeyValueStore {
  /**
   * Имя хранилища ключей и значений.
   */
  name(): string;
  /**
   * Полностью очищает хранилище ключей и значений.
   */
  clear(cb: BFSOneArgCallback): void;
  /**
   * Начинает транзакцию чтения-записи.
   */
  beginTransaction(type: 'readwrite'): AsyncKeyValueRWTransaction;
  /**
   * Начинает транзакцию только для чтения.
   */
  beginTransaction(type: 'readonly'): AsyncKeyValueROTransaction;
  beginTransaction(type: string): AsyncKeyValueROTransaction;
}

/**
 * Представляет асинхронную транзакцию только для чтения.
 */
export interface AsyncKeyValueROTransaction {
  /**
   * Извлекает данные по заданному ключу.
   * @param key Ключ для поиска данных.
   */
  get(key: string, cb: BFSCallback<Buffer>): void;
}

/**
 * Представляет асинхронную транзакцию чтения-записи.
 */
export interface AsyncKeyValueRWTransaction extends AsyncKeyValueROTransaction {
  /**
   * Добавляет данные в хранилище по заданному ключу. Заменяет любые существующие данные.
   * @param key Ключ для добавления данных.
   * @param data Данные для добавления в магазин.
   * @param overwrite Если «истина», перезаписать все существующие данные. Если «false», избегает записи данных, если ключ существует.
   * @param cb Вызывается ошибкой, независимо от того, зафиксировано ли значение.
   */
  put(key: string, data: Buffer, overwrite: boolean, cb: BFSCallback<boolean>): void;
  /**
   * Удаляет данные по данному ключу.
   * @param key Ключ удалить из магазина.
   */
  del(key: string, cb: BFSOneArgCallback): void;
  /**
   * Совершает транзакцию.
   */
  commit(cb: BFSOneArgCallback): void;
  /**
   * Прерывает и откатывает транзакцию.
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
 * "Асинхронная" файловая система "ключ-значение". Сохраняет данные в / извлекает данные из базового асинхронного хранилища ключей и значений.
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
   * Инициализирует файловую систему. Обычно вызывается конструкторами async подклассов.
   */
  public init(store: AsyncKeyValueStore, cb: BFSOneArgCallback) {
    this.store = store;
    // ИНВАРИАНТ: Убедитесь, что корень существует.
    this.makeRootDirectory(cb);
  }
  public getName(): string { return this.store.name(); }
  public isReadOnly(): boolean { return false; }
  public supportsSymlinks(): boolean { return false; }
  public supportsProps(): boolean { return false; }
  public supportsSynch(): boolean { return false; }

  /**
   * Удалите все содержимое, хранящееся в файловой системе.
   */
  public empty(cb: BFSOneArgCallback): void {
    if (this._cache) {
      this._cache.removeAll();
    }
    this.store.clear((e?) => {
      if (noError(e, cb)) {
        // ИНВАРИАНТ: Корень существует всегда.
        this.makeRootDirectory(cb);
      }
    });
  }

  public rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void {
    // TODO: Сделайте переименование совместимым с кешем.
    if (this._cache) {
      // Очистите и отключите кеш во время процесса переименования.
      const c = this._cache;
      this._cache = null;
      c.removeAll();
      const oldCb = cb;
      cb = (e?: ApiError | null) => {
        // Восстановить пустой кеш.
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

    // Инвариант: нельзя переместить папку внутри себя.
    // Этот забавный небольшой прием гарантирует, что проверка пройдет, только если oldPath является подпутьем newParent. 
    // Мы добавляем '/', чтобы избежать совпадения папок, которые являются подстрокой самой нижней папки в пути.
    if ((newParent + '/').indexOf(oldPath + '/') === 0) {
      return cb(new ApiError(ErrorCode.EBUSY, oldParent));
    }

    /**
     * Ответственный за Фазу 2 операции переименования: изменение и фиксацию списков каталогов. 
     * Вызывается после того, как мы успешно извлекли индексные дескрипторы и списки как старого, так и нового родителя.
     */
    const theOleSwitcharoo = (): void => {
      // Проверка работоспособности: убедитесь, что присутствуют оба пути и нет ошибок.
      if (errorOccurred || !lists.hasOwnProperty(oldParent) || !lists.hasOwnProperty(newParent)) {
        return;
      }
      const oldParentList = lists[oldParent], oldParentINode = inodes[oldParent],
        newParentList = lists[newParent], newParentINode = inodes[newParent];

      // Удалить файл из старого родителя.
      if (!oldParentList[oldName]) {
        cb(ApiError.ENOENT(oldPath));
      } else {
        const fileId = oldParentList[oldName];
        delete oldParentList[oldName];

        // Завершает процесс переименования, добавляя файл к новому родительскому объекту.
        const completeRename = () => {
          newParentList[newName] = fileId;
          // Зафиксируйте список старых родителей.
          tx.put(oldParentINode.id, Buffer.from(JSON.stringify(oldParentList)), true, (e: ApiError) => {
            if (noErrorTx(e, tx, cb)) {
              if (oldParent === newParent) {
                // СДЕЛАНО!
                tx.commit(cb);
              } else {
                // Зафиксируйте новый родительский список.
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
          // 'newPath' уже существует. Проверьте, является ли это файлом или каталогом, и действуйте соответственно.
          this.getINode(tx, newPath, newParentList[newName], (e: ApiError, inode?: Inode) => {
            if (noErrorTx(e, tx, cb)) {
              if (inode!.isFile()) {
                // Удалите файл и продолжайте.
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
                // Невозможно перезаписать каталог с помощью переименования.
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
     * Захватывает индексный дескриптор пути и список каталогов, помещает его в индексные дескрипторы и перечисляет хэши.
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
          // Если ошибка уже произошла, просто остановитесь здесь.
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
    // @todo Убедитесь, что mtime обновляется правильно, и используйте это, чтобы определить, требуется ли обновление данных.
    const tx = this.store.beginTransaction('readwrite');
    // Шаг 1: Получите идентификатор файлового узла.
    this._findINode(tx, path.dirname(p), path.basename(p), (e: ApiError, fileInodeId?: string): void => {
      if (noErrorTx(e, tx, cb)) {
        // Шаг 2: Получите индексный дескриптор файла.
        this.getINode(tx, p, fileInodeId!, (e: ApiError, fileInode?: Inode): void => {
          if (noErrorTx(e, tx, cb)) {
            const inodeChanged: boolean = fileInode!.update(stats);
            // Шаг 3. Синхронизируйте данные.
            tx.put(fileInode!.id, data, true, (e: ApiError): void => {
              if (noErrorTx(e, tx, cb)) {
                // Шаг 4. Синхронизируйте метаданные (если они изменились)!
                if (inodeChanged) {
                  tx.put(fileInodeId!, fileInode!.toBuffer(), true, (e: ApiError): void => {
                    if (noErrorTx(e, tx, cb)) {
                      tx.commit(cb);
                    }
                  });
                } else {
                  // Нет необходимости синхронизировать метаданные; возвращение.
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
   * Проверяет, существует ли корневой каталог. Создает его, если нет.
   */
  private makeRootDirectory(cb: BFSOneArgCallback) {
    const tx = this.store.beginTransaction('readwrite');
    tx.get(ROOT_NODE_ID, (e: ApiError, data?: Buffer) => {
      if (e || data === undefined) {
        // Создайте новый индексный дескриптор.
        const currTime = (new Date()).getTime(),
          // Mode 0666
          dirInode = new Inode(GenerateRandomID(), 4096, 511 | FileType.DIRECTORY, currTime, currTime, currTime);
        // Если корень не существует, тоже не должно быть первого случайного идентификатора.
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
        // Были хороши.
        tx.commit(cb);
      }
    });
  }

  /**
   * Вспомогательная функция для findINode.
   * @param parent Родительский каталог файла, который мы пытаемся найти.
   * @param filename Имя файла inode, который мы пытаемся найти, минус * родительский.
   * @param cb Передана ошибка или идентификатор индексного дескриптора файла в файловой системе.
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
        // БАЗОВЫЙ СЛУЧАЙ №1: вернуть идентификатор корня.
        if (this._cache) {
          this._cache.set(path.join(parent, filename), ROOT_NODE_ID);
        }
        cb(null, ROOT_NODE_ID);
      } else {
        // БАЗОВЫЙ СЛУЧАЙ № 2: Найдите элемент в корневом узле.
        this.getINode(tx, parent, ROOT_NODE_ID, (e: ApiError, inode?: Inode): void => {
          if (noError(e, cb)) {
            this.getDirListing(tx, parent, inode!, (e: ApiError, dirList?: {[name: string]: string}): void => {
              // handle_directory_listings обработает e за нас.
              handleDirectoryListings(e, inode, dirList);
            });
          }
        });
      }
    } else {
      // Получите INode родительского каталога и найдите файл в его листинге.
      this.findINodeAndDirListing(tx, parent, handleDirectoryListings);
    }
  }

  /**
   * Находит индекс заданного пути.
   * @param p Путь для поиска.
   * @param cb Пройдена ошибка или Inode пути p.
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
   * По идентификатору узла получает соответствующий индексный дескриптор.
   * @param tx Используемая транзакция.
   * @param p Соответствующий путь к файлу (используется для сообщений об ошибках).
   * @param id ID для поиска.
   * @param cb Передана ошибка или индексный дескриптор под данным идентификатором.
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
   * Учитывая индексный дескриптор каталога, получает список соответствующего каталога.
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
            // Происходит, когда данные не определены или соответствуют чему-то другому, кроме списка каталогов. 
            // Последнее не должно происходить, если файловая система не повреждена.
            cb(ApiError.ENOENT(p));
          }
        }
      });
    }
  }

  /**
   * Получив путь к каталогу, извлекает соответствующий список каталогов INode.
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
   * Добавляет новый узел со случайным идентификатором. 
   * Попытки повторяются 5 раз, прежде чем отказаться от чрезвычайно маловероятной возможности повторного использования случайного GUID.
   * @param cb Передана ошибка или идентификатор GUID, под которым хранились данные.
   */
  private addNewNode(tx: AsyncKeyValueRWTransaction, data: Buffer, cb: BFSCallback<string>): void {
    let retries = 0, currId: string;
    const reroll = () => {
      if (++retries === 5) {
        // Максимальное количество попыток удара. Возврат с ошибкой.
        cb(new ApiError(ErrorCode.EIO, 'Unable to commit data to key-value store.'));
      } else {
        // Попробуй еще раз.
        currId = GenerateRandomID();
        tx.put(currId, data, false, (e: ApiError, committed?: boolean) => {
          if (e || !committed) {
            reroll();
          } else {
            // Успешно сохранено в currId.
            cb(null, currId);
          }
        });
      }
    };
    reroll();
  }

  /**
   * Фиксирует новый файл (ну, ФАЙЛ или КАТАЛОГ) в файловую систему с заданным режимом.
   * Note: Это зафиксирует транзакцию.
   * @param p Путь к новому файлу.
   * @param type Тип нового файла.
   * @param mode Режим для создания нового файла.
   * @param data Данные для хранения в узле данных файла.
   * @param cb Передана ошибка или индексный дескриптор нового файла.
   */
  private commitNewFile(tx: AsyncKeyValueRWTransaction, p: string, type: FileType, mode: number, data: Buffer, cb: BFSCallback<Inode>): void {
    const parentDir = path.dirname(p),
      fname = path.basename(p),
      currTime = (new Date()).getTime();

    // Инвариант: корень существует всегда.
    // Если мы не проверим это перед выполнением шагов ниже, мы создадим файл с именем '' в корне, должно p == '/'.
    if (p === '/') {
      return cb(ApiError.EEXIST(p));
    }

    // Построим пирамиду кода!

    // Шаг 1. Получите индексный дескриптор родительского каталога и список каталогов
    this.findINodeAndDirListing(tx, parentDir, (e?: ApiError | null, parentNode?: Inode, dirListing?: {[name: string]: string}): void => {
      if (noErrorTx(e, tx, cb)) {
        if (dirListing![fname]) {
          // Файл уже существует.
          tx.abort(() => {
            cb(ApiError.EEXIST(p));
          });
        } else {
          // Шаг 2: Зафиксируйте данные для хранения.
          this.addNewNode(tx, data, (e: ApiError, dataId?: string): void => {
            if (noErrorTx(e, tx, cb)) {
              // Шаг 3. Зафиксируйте индексный дескриптор файла в магазине.
              const fileInode = new Inode(dataId!, data.length, mode | type, currTime, currTime, currTime);
              this.addNewNode(tx, fileInode.toBuffer(), (e: ApiError, fileInodeId?: string): void => {
                if (noErrorTx(e, tx, cb)) {
                  // Шаг 4: Обновите список родительского каталога.
                  dirListing![fname] = fileInodeId!;
                  tx.put(parentNode!.id, Buffer.from(JSON.stringify(dirListing)), true, (e: ApiError): void => {
                    if (noErrorTx(e, tx, cb)) {
                      // Шаг 5: Зафиксируйте и верните новый индексный дескриптор.
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
   * Удалите все следы указанного пути из файловой системы.
   * @param p Путь для удаления из файловой системы.
   * @param isDir Путь принадлежит каталогу или файлу?
   * @todo Обновите mtime.
   */
  private removeEntry(p: string, isDir: boolean, cb: BFSOneArgCallback): void {
    // Быстро удалить из кеша (безвредно, даже если удаление не удалось)
    if (this._cache) {
      this._cache.remove(p);
    }
    const tx = this.store.beginTransaction('readwrite'),
      parent: string = path.dirname(p), fileName: string = path.basename(p);
    // Шаг 1: Получите узел родительского каталога и список каталогов.
    this.findINodeAndDirListing(tx, parent, (e?: ApiError | null, parentNode?: Inode, parentListing?: {[name: string]: string}): void => {
      if (noErrorTx(e, tx, cb)) {
        if (!parentListing![fileName]) {
          tx.abort(() => {
            cb(ApiError.ENOENT(p));
          });
        } else {
          // Удалить из каталога родительский листинг.
          const fileNodeId = parentListing![fileName];
          delete parentListing![fileName];
          // Шаг 2: Получите индексный дескриптор файла.
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
                // Шаг 3: Удалите данные.
                tx.del(fileNode!.id, (e?: ApiError): void => {
                  if (noErrorTx(e, tx, cb)) {
                    // Шаг 4: Удалить узел.
                    tx.del(fileNodeId, (e?: ApiError): void => {
                      if (noErrorTx(e, tx, cb)) {
                        // Шаг 5: Обновите список каталогов.
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
