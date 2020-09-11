/**
 * Возьмите набор служебных функций, используемых в коде.
 */
import {FileSystem, BFSOneArgCallback, FileSystemConstructor} from './file_system';
import {ErrorCode, ApiError} from './api_error';
import levenshtein from './levenshtein';
import * as path from 'path';

export function deprecationMessage(print: boolean, fsName: string, opts: any): void {
  if (print) {
    // tslint:disable-next-line:no-console
    console.warn(`[${fsName}] Использование прямого конструктора файловой системы для этой файловой системы не рекомендуется и будет удалено в следующей основной версии. Пожалуйста, вместо него используйте '${fsName}.Create(${JSON.stringify(opts)}, callback)' метод. См. https://github.com/jvilk/BrowserFS/issues/176 для подробностей.`);
    // tslint:enable-next-line:no-console
  }
}

/**
 * Проверяет наличие любой версии IE, включая IE11, который удалил MSIE из строки userAgent.
 * @hidden
 */
export const isIE: boolean = typeof navigator !== "undefined" && Boolean(/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || navigator.userAgent.indexOf('Trident') !== -1);

/**
 * Проверьте, не являемся ли мы веб-работником.
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
 * Выдает исключение. Вызывается на путях кода, что должно быть невозможно.
 * @hidden
 */
export function fail() {
  throw new Error("BFS достиг невозможного пути кода; пожалуйста, сообщите об ошибке.");
}

/**
 * Синхронный рекурсивный македир.
 * @hidden
 */
export function mkdirpSync(p: string, mode: number, fs: FileSystem): void {
  if (!fs.existsSync(p)) {
    mkdirpSync(path.dirname(p), mode, fs);
    fs.mkdirSync(p, mode);
  }
}

/**
 * Преобразует буфер в буфер массива. Попытки сделать это способом с нулевым копированием, например массив ссылается на ту же самую память.
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
 * Преобразует буфер в Uint8Array. Попытки сделать это способом с нулевым копированием, например массив ссылается на ту же самую память.
 * @hidden
 */
export function buffer2Uint8array(buff: Buffer): Uint8Array {
  if (buff instanceof Uint8Array) {
    // BFS & Node v4.0 buffers *are* Uint8Arrays.
    return <any> buff;
  } else {
    // Uint8Arrays могут быть построены из массивов чисел.
    // На данный момент мы предполагаем, что это не массив BFS.
    return new Uint8Array(buff);
  }
}

/**
 * Преобразует заданный объект массива в буфер. Попытки быть нулевой копией.
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
 * Преобразует заданный Uint8Array в буфер. Попытки быть нулевой копией.
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
 * Преобразует указанный буфер массива в буфер. Попытки быть нулевой копией.
 * @hidden
 */
export function arrayBuffer2Buffer(ab: ArrayBuffer | SharedArrayBuffer): Buffer {
  return Buffer.from(<ArrayBuffer> ab);
}

/**
 * Копирует часть указанного буфера
 * @hidden
 */
export function copyingSlice(buff: Buffer, start: number = 0, end = buff.length): Buffer {
  if (start < 0 || end < 0 || end > buff.length || start > end) {
    throw new TypeError(`Invalid slice bounds on buffer of length ${buff.length}: [${start}, ${end}]`);
  }
  if (buff.length === 0) {
    // Избегайте углового регистра s0 в случае ArrayBuffer.
    return emptyBuffer();
  } else {
    const u8 = buffer2Uint8array(buff),
      s0 = buff[0],
      newS0 = (s0 + 1) % 0xFF;

    buff[0] = newS0;
    if (u8[0] === newS0) {
      // То же воспоминание. Вернуть и скопировать.
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
 * Валидатор параметров для параметра файловой системы буфера.
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
 * Проверяет допустимость заданного объекта параметров для параметров файловой системы.
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

  // Проверьте наличие необходимых опций.
  for (const optName in optsInfo) {
    if (optsInfo.hasOwnProperty(optName)) {
      const opt = optsInfo[optName];
      const providedValue = opts[optName];

      if (providedValue === undefined || providedValue === null) {
        if (!opt.optional) {
          // Обязательный вариант, не предусмотрен.
          // Предоставлены какие-либо неправильные варианты? Какие из них близки к предоставленной?
          // (edit distance 5 === close)
          const incorrectOptions = Object.keys(opts).filter((o) => !(o in optsInfo)).map((a: string) => {
            return {str: a, distance: levenshtein(optName, a)};
          }).filter((o) => o.distance < 5).sort((a, b) => a.distance - b.distance);
          // Валидаторы могут быть синхронными.
          if (callbackCalled) {
            return;
          }
          callbackCalled = true;
          return cb(new ApiError(ErrorCode.EINVAL, `[${fsName}] Required option '${optName}' not provided.${incorrectOptions.length > 0 ? ` Вы предоставили неопознанный вариант '${incorrectOptions[0].str}'; возможно вы хотели напечатать '${optName}'.` : ''}\nОписание варианта: ${opt.description}`));
        }
        // Иначе: дополнительный вариант не предусмотрен. Всё в порядке.
      } else {
        // Вариант предусмотрен! Тип проверки.
        let typeMatches = false;
        if (Array.isArray(opt.type)) {
          typeMatches = opt.type.indexOf(typeof(providedValue)) !== -1;
        } else {
          typeMatches = typeof(providedValue) === opt.type;
        }
        if (!typeMatches) {
          // Валидаторы могут быть синхронными.
          if (callbackCalled) {
            return;
          }
          callbackCalled = true;
          return cb(new ApiError(ErrorCode.EINVAL, `[${fsName}] Значение, указанное для опции ${optName}, не является правильным типом. Expected ${Array.isArray(opt.type) ? `one of {${opt.type.join(", ")}}` : opt.type}, but received ${typeof(providedValue)}\nOption description: ${opt.description}`));
        } else if (opt.validator) {
          pendingValidators++;
          opt.validator(providedValue, validatorCallback);
        }
        // В противном случае: всё хорошо!
      }
    }
  }
  loopEnded = true;
  if (pendingValidators === 0 && !callbackCalled) {
    cb();
  }
}
