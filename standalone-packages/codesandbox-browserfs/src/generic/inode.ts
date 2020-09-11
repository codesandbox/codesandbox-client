import {default as Stats, FileType} from '../core/node_fs_stats';

/**
 * Общее определение inode, которое можно легко сериализовать.
 */
export default class Inode {
  /**
   * Преобразует буфер в индексный дескриптор.
   */
  public static fromBuffer(buffer: Buffer): Inode {
    if (buffer === undefined) {
      throw new Error("NO");
    }
    return new Inode(buffer.toString('ascii', 30),
      buffer.readUInt32LE(0),
      buffer.readUInt16LE(4),
      buffer.readDoubleLE(6),
      buffer.readDoubleLE(14),
      buffer.readDoubleLE(22)
    );
  }

  constructor(public id: string,
              public size: number,
              public mode: number,
              public atime: number,
              public mtime: number,
              public ctime: number) { }

  /**
   * Удобная функция, которая преобразует Inode в объект Node Stats.
   */
  public toStats(): Stats {
    return new Stats(
      (this.mode & 0xF000) === FileType.DIRECTORY ? FileType.DIRECTORY : FileType.FILE,
      this.size, this.mode, this.atime, this.mtime, this.ctime);
  }

  /**
   * Получите размер этого Inode в байтах.
   */
  public getSize(): number {
    // ПРЕДПОЛОЖЕНИЕ: идентификатор - ASCII (1 байт на символ).
    return 30 + this.id.length;
  }

  /**
   * Записывает индексный дескриптор в начало буфера.
   */
  public toBuffer(buff: Buffer = Buffer.alloc(this.getSize())): Buffer {
    buff.writeUInt32LE(this.size, 0);
    buff.writeUInt16LE(this.mode, 4);
    buff.writeDoubleLE(this.atime, 6);
    buff.writeDoubleLE(this.mtime, 14);
    buff.writeDoubleLE(this.ctime, 22);
    buff.write(this.id, 30, this.id.length, 'ascii');
    return buff;
  }

  /**
   * Обновляет индексный дескриптор, используя информацию из объекта статистики. Используется файловыми системами во время синхронизации, например:
   * - Программа открывает файл и получает объект File.
   * - Программа изменяет файл. Файловый объект отвечает за поддержание изменений метаданных локально - обычно в объекте Stats.
   * - Программа закрывает файл. Изменения метаданных файлового объекта синхронизируются с файловой системой.
   * @return Верно, если произошли какие-либо изменения.
   */
  public update(stats: Stats): boolean {
    let hasChanged = false;
    if (this.size !== stats.size) {
      this.size = stats.size;
      hasChanged = true;
    }

    if (this.mode !== stats.mode) {
      this.mode = stats.mode;
      hasChanged = true;
    }

    const atimeMs = stats.atime.getTime();
    if (this.atime !== atimeMs) {
      this.atime = atimeMs;
      hasChanged = true;
    }

    const mtimeMs = stats.mtime.getTime();
    if (this.mtime !== mtimeMs) {
      this.mtime = mtimeMs;
      hasChanged = true;
    }

    const ctimeMs = stats.ctime.getTime();
    if (this.ctime !== ctimeMs) {
      this.ctime = ctimeMs;
      hasChanged = true;
    }

    return hasChanged;
  }

  // XXX: Скопировано из статистики. Следует примирить эти два во что-то более компактное.

  /**
   * @return [Boolean] Истинно, если это файл.
   */
  public isFile(): boolean {
    return (this.mode & 0xF000) === FileType.FILE;
  }

  /**
   * @return [Boolean] Истинно, если этот элемент является каталогом.
   */
  public isDirectory(): boolean {
    return (this.mode & 0xF000) === FileType.DIRECTORY;
  }
}
