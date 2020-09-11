/**
 * Содержит служебные методы для выполнения различных задач с помощью XmlHttpRequest в браузерах.
 */

import {isIE, emptyBuffer} from '../core/util';
import {ApiError, ErrorCode} from '../core/api_error';
import {BFSCallback} from '../core/file_system';

export const xhrIsAvailable = (typeof(XMLHttpRequest) !== "undefined" && XMLHttpRequest !== null);

/**
 * @hidden
 */
function asyncDownloadFileModern(p: string, type: 'buffer', cb: BFSCallback<Buffer>): void;
function asyncDownloadFileModern(p: string, type: 'json', cb: BFSCallback<any>): void;
function asyncDownloadFileModern(p: string, type: string, cb: BFSCallback<any>): void;
function asyncDownloadFileModern(p: string, type: string, cb: BFSCallback<any>): void {
  const req = new XMLHttpRequest();
  req.open('GET', p, true);
  let jsonSupported = true;
  switch (type) {
    case 'buffer':
      req.responseType = 'arraybuffer';
      break;
    case 'json':
     // Некоторые браузеры не поддерживают тип ответа JSON.
     // Они либо сбрасывают responseType, либо вызывают исключение.
     // @see https://github.com/Modernizr/Modernizr/blob/master/src/testXhrType.js
      try {
        req.responseType = 'json';
        jsonSupported = req.responseType === 'json';
      } catch (e) {
        jsonSupported = false;
      }
      break;
    default:
      return cb(new ApiError(ErrorCode.EINVAL, "Invalid download type: " + type));
  }
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        switch (type) {
          case 'buffer':
            // XXX: Браузеры на основе WebKit возвращают *null*, когда XHR обрабатывает пустой файл.
            return cb(null, req.response ? Buffer.from(req.response) : emptyBuffer());
          case 'json':
            if (jsonSupported) {
              return cb(null, req.response);
            } else {
              return cb(null, JSON.parse(req.responseText));
            }
        }
      } else {
        return cb(new ApiError(ErrorCode.EIO, `XHR error: ответ вернул код ${req.status}`));
      }
    }
  };
  req.send();
}

/**
 * @hidden
 */
function syncDownloadFileModern(p: string, type: 'buffer'): Buffer;
function syncDownloadFileModern(p: string, type: 'json'): any;
function syncDownloadFileModern(p: string, type: string): any;
function syncDownloadFileModern(p: string, type: string): any {
  const req = new XMLHttpRequest();
  req.open('GET', p, false);

  // На большинстве платформ мы не можем установить responseType для синхронных загрузок.
  // @todo Проверьте это; IE10 позволяет это, как и более старые версии Chrome/FF.
  let data: any = null;
  let err: any = null;
  // Классический способ загрузки двоичных данных в виде строки.
  req.overrideMimeType('text/plain; charset=x-user-defined');
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        switch (type) {
          case 'buffer':
            // Преобразуйте текст в буфер.
            const text = req.responseText;
            data = Buffer.alloc(text.length);
            // Выбросьте верхние биты каждого символа.
            for (let i = 0; i < text.length; i++) {
              // Это автоматически отбросит для нас верхний бит каждого символа.
              data[i] = text.charCodeAt(i);
            }
            return;
          case 'json':
            data = JSON.parse(req.responseText);
            return;
        }
      } else {
        err = new ApiError(ErrorCode.EIO, `XHR error: ответ вернул код ${req.status}`);
        return;
      }
    }
  };
  req.send();
  if (err) {
    throw err;
  }
  return data;
}

/**
 * IE10 позволяет нам выполнять синхронную загрузку двоичных файлов.
 * @todo Функция обнаруживает это, как и старые версии FF/Chrome!
 * @hidden
 */
function syncDownloadFileIE10(p: string, type: 'buffer'): Buffer;
function syncDownloadFileIE10(p: string, type: 'json'): any;
function syncDownloadFileIE10(p: string, type: string): any;
function syncDownloadFileIE10(p: string, type: string): any {
  const req = new XMLHttpRequest();
  req.open('GET', p, false);
  switch (type) {
    case 'buffer':
      req.responseType = 'arraybuffer';
      break;
    case 'json':
      // IE10 не поддерживает тип JSON.
      break;
    default:
      throw new ApiError(ErrorCode.EINVAL, "Неверный тип загрузки: " + type);
  }
  let data: any;
  let err: any;
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        switch (type) {
          case 'buffer':
            data = Buffer.from(req.response);
            break;
          case 'json':
            data = JSON.parse(req.response);
            break;
        }
      } else {
        err = new ApiError(ErrorCode.EIO, `XHR error: ответ вернул код ${req.status}`);
      }
    }
  };
  req.send();
  if (err) {
    throw err;
  }
  return data;
}

/**
 * @hidden
 */
function getFileSize(async: boolean, p: string, cb: BFSCallback<number>): void {
  const req = new XMLHttpRequest();
  req.open('HEAD', p, async);
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        try {
          return cb(null, parseInt(req.getResponseHeader('Content-Length') || '-1', 10));
        } catch (e) {
          // В случае, если заголовок отсутствует или возникла ошибка ...
          return cb(new ApiError(ErrorCode.EIO, "XHR HEAD error: Не удалось прочитать длину содержимого."));
        }
      } else {
        return cb(new ApiError(ErrorCode.EIO, `XHR HEAD error: ответ вернул код ${req.status}`));
      }
    }
  };
  req.send();
}

/**
 * Асинхронно загружайте файл как буфер или объект JSON.
 * Обратите внимание, что третья сигнатура функции с неспециализированным типом недопустима, 
 * но TypeScript требует этого, когда вы специализируете строковые аргументы для констант.
 * @hidden
 */
export let asyncDownloadFile: {
  (p: string, type: 'buffer', cb: BFSCallback<Buffer>): void;
  (p: string, type: 'json', cb: BFSCallback<any>): void;
  (p: string, type: string, cb: BFSCallback<any>): void;
} = asyncDownloadFileModern;

/**
 * Синхронно загрузите файл как буфер или объект JSON.
 * Обратите внимание, что третья сигнатура функции с неспециализированным типом недопустима, 
 * но TypeScript требует этого, когда вы специализируете строковые аргументы для констант.
 * @hidden
 */
export let syncDownloadFile: {
  (p: string, type: 'buffer'): Buffer;
  (p: string, type: 'json'): any;
  (p: string, type: string): any;
} = (isIE && typeof Blob !== 'undefined') ? syncDownloadFileIE10 : syncDownloadFileModern;

/**
 * Синхронно извлекает размер данного файла в байтах.
 * @hidden
 */
export function getFileSizeSync(p: string): number {
  let rv: number = -1;
  getFileSize(false, p, function(err: ApiError, size?: number) {
    if (err) {
      throw err;
    }
    rv = size!;
  });
  return rv;
}

/**
 * Асинхронно извлекает размер данного файла в байтах.
 * @hidden
 */
export function getFileSizeAsync(p: string, cb: (err: ApiError, size?: number) => void): void {
  getFileSize(true, p, cb);
}
