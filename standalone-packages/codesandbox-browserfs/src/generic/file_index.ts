import * as path from 'path';
import {default as Stats, FileType} from '../core/node_fs_stats';
import { UNPKGMeta, UNPKGMetaDirectory } from '../backend/UNPKGRequest';
import { JSDelivrMeta } from '../backend/JSDelivrRequest';

/**
 * Простой класс для хранения индекса файловой системы. Предполагает, что все переданные ему пути являются *абсолютными* путями.
 * Может использоваться как частичный или полный индекс, хотя при использовании для первой цели необходимо соблюдать осторожность, особенно когда речь идет о каталогах.
 */
export class FileIndex<T> {
  /**
   * Статический метод построения индексов из листинга JSON.
   * @param listing Список каталогов, созданный tools/HRIndexer.coffee
   * @return Новый объект FileIndex.
   */
  public static fromListing<T>(listing: any): FileIndex<T> {
    const idx = new FileIndex<T>();
    // Добавьте корневой DirNode.
    const rootInode = new DirInode<T>();
    idx._index['/'] = rootInode;
    const queue = [['', listing, rootInode]];
    while (queue.length > 0) {
      let inode: Inode;
      const next = queue.pop();
      const pwd = next![0];
      const tree = next![1];
      const parent = next![2];
      for (const node in tree) {
        if (tree.hasOwnProperty(node)) {
          const children = tree[node];
          const name = `${pwd}/${node}`;
          if (children) {
            idx._index[name] = inode = new DirInode<T>();
            queue.push([name, children, inode]);
          } else {
            // Этот индексный дескриптор не имеет правильной информации о размере, отмеченной -1.
            inode = new FileInode<Stats>(new Stats(FileType.FILE, -1, 0x16D));
          }
          if (parent) {
            parent._ls[node] = inode;
          }
        }
      }
    }
    return idx;
  }

  public static fromUnpkg<T>(listing: UNPKGMeta): FileIndex<T> {
    const idx = new FileIndex<T>();

    function handleDir(dirPath: string, entry: UNPKGMetaDirectory) {
      const dirInode: DirInode<T> = new DirInode<T>();
      entry.files.forEach((child) => {
        let inode: Inode;
        if (child.type === 'file') {
          inode = new FileInode<Stats>(new Stats(FileType.FILE, child.size));

          // @ts-ignore
          dirInode._ls[path.basename(child.path)] = inode;
        } else {
          idx._index[child.path] = inode = handleDir(child.path, child);
        }
      });

      return dirInode;
    }

    idx._index['/'] = handleDir('/', listing);

    return idx;
  }

  public static fromJSDelivr<T>(listing: JSDelivrMeta): FileIndex<T> {
    const idx = new FileIndex<T>();

    listing.files.forEach((file) => {
      const inode = new FileInode<Stats>(new Stats(FileType.FILE, file.size));
      idx.addPathFast(file.name, inode);
    });

    return idx;
  }

  // Сопоставляет пути каталогов с индексными дескрипторами каталогов, которые содержат файлы.
  private _index: {[path: string]: DirInode<T> };

  /**
   * Создает новый FileIndex.
   */
  constructor() {
    // _index - это одноуровневый ключ, хранилище значений, которое сопоставляет пути *каталога* с 
    // DirInodes. Информация о файлах содержится только в самих DirInodes.
    this._index = {};
    // Создайте корневой каталог.
    this.addPath('/', new DirInode());
  }

  /**
   * Запускает данную функцию для всех файлов в индексе.
   */
  public fileIterator<T>(cb: (file: T | null, path?: string) => void): void {
    for (const path in this._index) {
      if (this._index.hasOwnProperty(path)) {
        const dir = this._index[path];
        const files = dir.getListing();
        for (const file of files) {
          const item = dir.getItem(file);
          if (isFileInode<T>(item)) {
            cb(item.getData(), path + '/' + file);
          }
        }
      }
    }
  }

  /**
   * Добавляет заданный абсолютный путь к индексу, если он еще не находится в индексе.
   * Создает все необходимые родительские каталоги.
   * @param path Путь для добавления в индекс.
   * @param inode Inode для добавляемого пути.
   * @return 'True' если он был добавлен или уже существует, 'false', если при его добавлении возникла проблема 
   * (например, элемент в пути - это файл, элемент существует, но отличается).
   * @todo Если добавление завершается неудачно и неявно создаются каталоги, мы не очищаем новые пустые каталоги.
   */
  public addPath(path: string, inode: Inode): boolean {
    if (!inode) {
      throw new Error('Inode must be specified');
    }
    if (path[0] !== '/') {
      throw new Error('Path must be absolute, got: ' + path);
    }

    // Проверьте, существует ли он уже.
    if (this._index.hasOwnProperty(path)) {
      return this._index[path] === inode;
    }

    const splitPath = this._split_path(path);
    const dirpath = splitPath[0];
    const itemname = splitPath[1];
    // Попробуйте сначала добавить в его родительский каталог.
    let parent = this._index[dirpath];
    if (parent === undefined && path !== '/') {
      // Создать родителя.
      parent = new DirInode<T>();
      if (!this.addPath(dirpath, parent)) {
        return false;
      }
    }
    // Добавляю себя к моему родителю.
    if (path !== '/') {
      if (!parent.addItem(itemname, inode)) {
        return false;
      }
    }
    // Если я каталог, добавляюсь в индекс.
    if (isDirInode<T>(inode)) {
      this._index[path] = inode;
    }
    return true;
  }

  /**
   * Добавляет заданный абсолютный путь к индексу, если он еще не находится в индексе.
   * Путь добавляется без специальной обработки (без соединения соседних разделителей и т. Д.).
   * Создает все необходимые родительские каталоги.
   * @param path Путь для добавления в индекс.
   * @param inode Inode для добавляемого пути.
   * @return 'True' если он был добавлен или уже существует, 'false', если при его добавлении возникла проблема 
   * (например, элемент в пути - это файл, элемент существует, но отличается).
   * @todo Если добавление завершается неудачно и неявно создаются каталоги, мы не очищаем новые пустые каталоги.
   */
  public addPathFast(path: string, inode: Inode): boolean {
    const itemNameMark = path.lastIndexOf('/');
    const parentPath = itemNameMark === 0 ? "/" : path.substring(0, itemNameMark);
    const itemName = path.substring(itemNameMark + 1);

    // Попробуйте сначала добавить в его родительский каталог.
    let parent = this._index[parentPath];
    if (parent === undefined) {
      // Создать родителя.
      parent = new DirInode<T>();
      this.addPathFast(parentPath, parent);
    }

    if (!parent.addItem(itemName, inode)) {
      return false;
    }

    // Если вы добавляете каталог, добавьте его также в индекс.
    if (inode.isDir()) {
      this._index[path] = <DirInode<T>> inode;
    }
    return true;
  }

  /**
   * Удаляет указанный путь. Может быть файлом или каталогом.
   * @return Удалённый элемент, или null, если его не было.
   */
  public removePath(path: string): Inode | null {
    const splitPath = this._split_path(path);
    const dirpath = splitPath[0];
    const itemname = splitPath[1];

    // Сначала попробуйте удалить его из родительского каталога.
    const parent = this._index[dirpath];
    if (parent === undefined) {
      return null;
    }
    // Отстраниться от родителей.
    const inode = parent.remItem(itemname);
    if (inode === null) {
      return null;
    }
    // Если я каталог, удаляю себя из индекса и моих детей.
    if (isDirInode(inode)) {
      const children = inode.getListing();
      for (const child of children) {
        this.removePath(path + '/' + child);
      }

      // Удалите каталог из индекса, если это не корень.
      if (path !== '/') {
        delete this._index[path];
      }
    }
    return inode;
  }

  /**
   * Получает список каталогов по заданному пути.
   * @return Массив файлов по заданному пути или `null`, если он не существует.
   */
  public ls(path: string): string[] | null {
    const item = this._index[path];
    if (item === undefined) {
      return null;
    }
    return item.getListing();
  }

  /**
   * Возвращает индексный дескриптор указанного элемента.
   * @return Возвращает `null`, если элемент не существует.
   */
  public getInode(path: string): Inode | null {
    const splitPath = this._split_path(path);
    const dirpath = splitPath[0];
    const itemname = splitPath[1];
    // Получить из родительского каталога.
    const parent = this._index[dirpath];
    if (parent === undefined) {
      return null;
    }
    // Корневой случай
    if (dirpath === path) {
      return parent;
    }
    return parent.getItem(itemname);
  }

  /**
   * Разделить на пару (путь к каталогу, имя элемента)
   */
  private _split_path(p: string): string[] {
    const dirpath = path.dirname(p);
    const itemname = p.substr(dirpath.length + (dirpath === "/" ? 0 : 1));
    return [dirpath, itemname];
  }
}

/**
 * Общий интерфейс для inodes файлов / каталогов.
 * Обратите внимание, что объекты статистики - это то, что мы используем для индексных дескрипторов файлов.
 */
export interface Inode {
  // Это индексный дескриптор файла?
  isFile(): boolean;
  // Это индексный дескриптор каталога?
  isDir(): boolean;
}

/**
 * Inode для файла. Хранит произвольные (зависящие от файловой системы) полезные данные.
 */
export class FileInode<T> implements Inode {
  constructor(private data: T) { }
  public isFile(): boolean { return true; }
  public isDir(): boolean { return false; }
  public getData(): T { return this.data; }
  public setData(data: T): void { this.data = data; }
}

/**
 * Inode для каталога. В настоящее время содержит только список каталогов.
 */
export class DirInode<T> implements Inode {
  private _ls: {[path: string]: Inode} = {};
  /**
   * Создает индексный дескриптор для каталога.
   */
  constructor(private data: T | null = null) {}
  public isFile(): boolean {
    return false;
  }

  public isDir(): boolean {
    return true;
  }

  public getData(): T | null { return this.data; }

  /**
   * Вернуть объект статистики для этого inode.
   * @todo Возможно, в какой-то момент следует удалить это. FileIndex не отвечает за это.
   */
  public getStats(): Stats {
    return new Stats(FileType.DIRECTORY, 4096, 0x16D);
  }

  /**
   * Возвращает список каталогов для этого каталога. Пути в каталоге относительно пути к каталогу.
   * @return Список каталогов для этого каталога.
   */
  public getListing(): string[] {
    return Object.keys(this._ls);
  }

  /**
   * Возвращает индексный дескриптор указанного элемента или null, если он не существует.
   * @param p Имя элемента в этом каталоге.
   */
  public getItem(p: string): Inode | null {
    const item = this._ls[p];

    return item && this._ls.hasOwnProperty(p) ? item : null;
  }

  /**
   * Добавьте данный элемент в список каталогов. Обратите внимание, что данный inode не копируется и будет изменен DirInode, если это DirInode.
   * @param p Имя элемента для добавления в список каталога.
   * @param inode Inode для элемента, добавляемого в индексный дескриптор каталога.
   * @return Истина, если она была добавлена, ложь, если она уже существует.
   */
  public addItem(p: string, inode: Inode): boolean {
    if (p in this._ls) {
      return false;
    }
    this._ls[p] = inode;
    return true;
  }

  /**
   * Удаляет данный элемент из списка каталогов.
   * @param p Имя элемента, который нужно удалить из списка каталогов.
   * @return Возвращает элемент удален или `null`, если элемент не существует.
   */
  public remItem(p: string): Inode | null {
    const item = this._ls[p];
    if (item === undefined) {
      return null;
    }
    delete this._ls[p];
    return item;
  }
}

/**
 * @hidden
 */
export function isFileInode<T>(inode: Inode | null): inode is FileInode<T> {
  return !!inode && inode.isFile();
}

/**
 * @hidden
 */
export function isDirInode<T>(inode: Inode | null): inode is DirInode<T> {
  return !!inode && inode.isDir();
}
