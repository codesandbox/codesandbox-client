import {BaseFile, File} from '../core/file';
import {FileSystem, BFSOneArgCallback, BFSCallback, BFSThreeArgCallback} from '../core/file_system';
import Stats from '../core/node_fs_stats';
import {FileFlag} from '../core/file_flag';
import {ApiError, ErrorCode} from '../core/api_error';
import fs from '../core/node_fs';
import {emptyBuffer} from '../core/util';

/**
 * Реализация интерфейса File, который работает с файлом, полностью * находящимся в памяти. PreloadFiles поддерживаются буфером.
 *
 * Это тоже абстрактный класс, так как в нем отсутствуют реализации «синхронизация» и «закрытие». 
 * Каждая файловая система, которая хочет использовать это представление файла, должна расширить этот класс и реализовать эти два метода.
 * @todo 'close' рычаг, который отключает функциональность после закрытия.
 */
export default class PreloadFile<T extends FileSystem> extends BaseFile {
  protected _fs: T;
  private _pos: number = 0;
  private _path: string;
  private _stat: Stats;
  private _flag: FileFlag;
  private _buffer: Buffer;
  private _dirty: boolean = false;
  /**
   * Создает файл с заданным путем и, необязательно, с заданным содержимым.  
   * Обратите внимание, что, если указано содержимое, оно будет изменено файлом!
   * @param _fs Файловая система, создавшая файл.
   * @param _path Указывает разрешения и место начала указателя файла.
   * @param _mode Режим, в котором был открыт файл.
   * @param _stat Объект статистики для данного файла. PreloadFile изменит этот объект. 
   *  Обратите внимание, что этот объект должен содержать соответствующий режим, в котором был открыт файл.
   * @param contents Буфер, содержащий всё содержимое файла. PreloadFile изменит этот буфер. 
   *  Если не указано, мы предполагаем, что это новый файл.
   */
  constructor(_fs: T, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
    super();
    this._fs = _fs;
    this._path = _path;
    this._flag = _flag;
    this._stat = _stat;
    this._buffer = contents ? contents : emptyBuffer();
    // Note: Этот инвариант * не * поддерживается после того, как файл начинает изменяться.
    // Note: Фактически имеет значение только то, доступен ли файл для чтения, поскольку режимы с возможностью записи могут обрезать / добавлять в файл.
    if (this._stat.size !== this._buffer.length && this._flag.isReadable()) {
      throw new Error(`Invalid buffer: Буфер ${this._buffer.length} длинный, но объект Stats указывает, что файл ${this._stat.size} длинный.`);
    }
  }

  /**
   * НЕСТАНДАРТНЫЙ: Получите базовый буфер для этого файла. !!НЕ МУТАЙТЕ!! Запутает грязное отслеживание.
   */
  public getBuffer(): Buffer {
    return this._buffer;
  }

  /**
   * НЕСТАНДАРТНЫЙ: получить базовую статистику для этого файла. !!НЕ МУТАЙТЕ!!
   */
  public getStats(): Stats {
    return this._stat;
  }

  public getFlag(): FileFlag {
    return this._flag;
  }

  /**
   * Получите путь к этому файлу.
   * @return [String] Путь к файлу.
   */
  public getPath(): string {
    return this._path;
  }

  /**
   * Получить текущую позицию в файле.
   *
   * Мы эмулируем следующую ошибку, упомянутую в документации по Node:
   * > В Linux позиционная запись не работает, когда файл открывается в режиме добавления.
   * Ядро игнорирует аргумент позиции и всегда добавляет данные в конец файла.
   * @return [Number] Текущая позиция в файле.
   */
  public getPos(): number {
    if (this._flag.isAppendable()) {
      return this._stat.size;
    }
    return this._pos;
  }

  /**
   * Переместить текущую позицию в файле на указанное количество позиций.
   * @param [Number] delta
   */
  public advancePos(delta: number): number {
    return this._pos += delta;
  }

  /**
   * Установите положение файла.
   * @param [Number] newPos
   */
  public setPos(newPos: number): number {
    return this._pos = newPos;
  }

  /**
   * **Core**: Асинхронная синхронизация. Должен быть реализован подклассами этого класса.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public sync(cb: BFSOneArgCallback): void {
    try {
      this.syncSync();
      cb();
    } catch (e) {
      cb(e);
    }
  }

  /**
   * **Core**: Синхронная синхронизация.
   */
  public syncSync(): void {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  /**
   * **Core**: Асинхронное закрытие. Должен быть реализован подклассами этого класса.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public close(cb: BFSOneArgCallback): void {
    try {
      this.closeSync();
      cb();
    } catch (e) {
      cb(e);
    }
  }

  /**
   * **Core**: Синхронное закрытие.
   */
  public closeSync(): void {
    throw new ApiError(ErrorCode.ENOTSUP);
  }

  /**
   * Асинхронный `stat`.
   * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] cb
   */
  public stat(cb: BFSCallback<Stats>): void {
    try {
      cb(null, Stats.clone(this._stat));
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Синхронный `stat`.
   */
  public statSync(): Stats {
    return Stats.clone(this._stat);
  }

  /**
   * Асинхронное усечение.
   * @param [Number] len
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public truncate(len: number, cb: BFSOneArgCallback): void {
    try {
      this.truncateSync(len);
      if (this._flag.isSynchronous() && !fs.getRootFS()!.supportsSynch()) {
        this.sync(cb);
      }
      cb();
    } catch (e) {
      return cb(e);
    }
  }

  /**
   * Синхронное усечение.
   * @param [Number] len
   */
  public truncateSync(len: number): void {
    this._dirty = true;
    if (!this._flag.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, 'Файл не открыт в режиме с возможностью записи.');
    }
    this._stat.mtimeMs = Date.now();
    if (len > this._buffer.length) {
      const buf = Buffer.alloc(len - this._buffer.length, 0);
      // Write will set @_stat.size for us.
      this.writeSync(buf, 0, buf.length, this._buffer.length);
      if (this._flag.isSynchronous() && fs.getRootFS()!.supportsSynch()) {
        this.syncSync();
      }
      return;
    }
    this._stat.size = len;
    // Truncate buffer to 'len'.
    const newBuff = Buffer.alloc(len);
    this._buffer.copy(newBuff, 0, 0, len);
    this._buffer = newBuff;
    if (this._flag.isSynchronous() && fs.getRootFS()!.supportsSynch()) {
      this.syncSync();
    }
  }

  /**
   * Записать буфер в файл.
   * Обратите внимание, что небезопасно использовать fs.write несколько раз для одного и того же файла, не дожидаясь обратного вызова.
   * @param [BrowserFS.node.Buffer] buffer Буфер, содержащий данные для записи в файл.
   * @param [Number] offset Смещение в буфере, из которого начинается чтение данных.
   * @param [Number] length Количество байтов для записи в файл.
   * @param [Number] position Смещение от начала файла, куда должны быть записаны эти данные. 
   *  Если позиция равна нулю, данные будут записаны в текущей позиции.
   * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)]
   *   cb Число указывает количество байтов, записанных в файл.
   */
  public write(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void {
    try {
      cb(null, this.writeSync(buffer, offset, length, position), buffer);
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Записать буфер в файл.
   * Обратите внимание, что небезопасно использовать fs.writeSync несколько раз в одном файле без ожидания обратного вызова.
   * @param [BrowserFS.node.Buffer] buffer Буфер, содержащий данные для записи * в файл.
   * @param [Number] offset Смещение в буфере для начала чтения данных.
   * @param [Number] length Количество байтов для записи в файл.
   * @param [Number] position Смещение от начала файла, куда должны быть записаны эти данные. 
   *  Если позиция равна нулю, данные будут записаны в * текущей позиции.
   * @return [Number]
   */
  public writeSync(buffer: Buffer, offset: number, length: number, position: number): number {
    this._dirty = true;
    if (position === undefined || position === null) {
      position = this.getPos();
    }
    if (!this._flag.isWriteable()) {
      throw new ApiError(ErrorCode.EPERM, 'Файл не открыт в режиме с возможностью записи.');
    }
    const endFp = position + length;
    if (endFp > this._stat.size) {
      this._stat.size = endFp;
      if (endFp > this._buffer.length) {
        // Extend the buffer!
        const newBuff = Buffer.alloc(endFp);
        this._buffer.copy(newBuff);
        this._buffer = newBuff;
      }
    }
    const len = buffer.copy(this._buffer, position, offset, offset + length);
    this._stat.mtimeMs = Date.now();
    if (this._flag.isSynchronous()) {
      this.syncSync();
      return len;
    }
    this.setPos(position + len);
    return len;
  }

  /**
   * Прочитать данные из файла.
   * @param [BrowserFS.node.Buffer] buffer Буфер, в который будут записываться данные.
   * @param [Number] offset Смещение в буфере, где начнется запись.
   * @param [Number] length Целое число, определяющее количество байтов для чтения.
   * @param [Number] position Целое число, указывающее, с чего начать чтение в файле. 
   *  Если позиция равна нулю, данные будут считаны из текущего файла * позиция.
   * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)] cb Число - это количество прочитанных байтов.
   */
  public read(buffer: Buffer, offset: number, length: number, position: number, cb: BFSThreeArgCallback<number, Buffer>): void {
    try {
      cb(null, this.readSync(buffer, offset, length, position), buffer);
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Прочитать данные из файла.
   * @param [BrowserFS.node.Buffer] buffer Буфер, в который будут записываться данные.
   * @param [Number] offset Смещение в буфере, где начнется запись.
   * @param [Number] length Целое число, определяющее количество байтов для чтения.
   * @param [Number] position Целое число, указывающее, с чего начать чтение в файле. 
   *  Если позиция равна нулю, данные будут считаны из текущего файла * позиция.
   * @return [Number]
   */
  public readSync(buffer: Buffer, offset: number, length: number, position: number): number {
    if (!this._flag.isReadable()) {
      throw new ApiError(ErrorCode.EPERM, 'Файл не открыт в читаемом режиме.');
    }
    if (position === undefined || position === null) {
      position = this.getPos();
    }
    const endRead = position + length;
    if (endRead > this._stat.size) {
      length = this._stat.size - position;
    }
    const rv = this._buffer.copy(buffer, offset, position, position + length);
    this._stat.atimeMs = Date.now();
    this._pos = position + length;
    return rv;
  }

  /**
   * Асинхронный `fchmod`.
   * @param [Number|String] mode
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public chmod(mode: number, cb: BFSOneArgCallback): void {
    try {
      this.chmodSync(mode);
      cb();
    } catch (e) {
      cb(e);
    }
  }

  /**
   * Асинхронный `fchmod`.
   * @param [Number] mode
   */
  public chmodSync(mode: number): void {
    if (!this._fs.supportsProps()) {
      throw new ApiError(ErrorCode.ENOTSUP);
    }
    this._dirty = true;
    this._stat.chmod(mode);
    this.syncSync();
  }

  protected isDirty(): boolean {
    return this._dirty;
  }

  /**
   * Сбрасывает грязный бит. Должен вызываться только после успешного завершения синхронизации.
   */
  protected resetDirty() {
    this._dirty = false;
  }
}

/**
 * Файловый класс для файловых систем InMemory и XHR.
 * Не синхронизируется ни с чем, поэтому отлично работает с файлами только в памяти.
 */
export class NoSyncFile<T extends FileSystem> extends PreloadFile<T> implements File {
  constructor(_fs: T, _path: string, _flag: FileFlag, _stat: Stats, contents?: Buffer) {
    super(_fs, _path, _flag, _stat, contents);
  }
  /**
   * Асинхронный sync. Ничего не делает, просто вызывает cb.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public sync(cb: BFSOneArgCallback): void {
    cb();
  }
  /**
   * Синхронный sync. Ничего не делает.
   */
  public syncSync(): void {
    // NOP.
  }
  /**
   * Асинхронный close. Ничего не делает, просто вызывает cb.
   * @param [Function(BrowserFS.ApiError)] cb
   */
  public close(cb: BFSOneArgCallback): void {
    cb();
  }
  /**
   * Синхронный close. Ничего не делает.
   */
  public closeSync(): void {
    // NOP.
  }
}
