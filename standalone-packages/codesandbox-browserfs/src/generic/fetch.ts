/**
 * Содержит служебные методы, использующие `выборку`.
 */

import {ApiError, ErrorCode} from '../core/api_error';
import {BFSCallback} from '../core/file_system';

export const fetchIsAvailable = (typeof(fetch) !== "undefined" && fetch !== null);

/**
 * Асинхронно загружайте файл как буфер или объект JSON.
 * Обратите внимание, что третья сигнатура функции с неспециализированным типом недопустима, 
 * но TypeScript требует этого, когда вы специализируете строковые аргументы для констант.
 * @hidden
 */
export function fetchFileAsync(p: string, type: 'buffer', cb: BFSCallback<Buffer>): void;
export function fetchFileAsync(p: string, type: 'json', cb: BFSCallback<any>): void;
export function fetchFileAsync(p: string, type: string, cb: BFSCallback<any>): void;
export function fetchFileAsync(p: string, type: string, cb: BFSCallback<any>): void {
  let request;
  try {
    request = fetch(p);
  } catch (e) {
    // XXX: fetch выдаст TypeError, если URL-адрес содержит учетные данные
    return cb(new ApiError(ErrorCode.EINVAL, e.message));
  }
  request
  .then((res) => {
    if (!res.ok) {
      return cb(new ApiError(ErrorCode.EIO, `fetch error: response returned code ${res.status}`));
    } else {
      switch (type) {
        case 'buffer':
          res.arrayBuffer()
            .then((buf) => cb(null, Buffer.from(buf)))
            .catch((err) => cb(new ApiError(ErrorCode.EIO, err.message)));
          break;
        case 'json':
          res.json()
            .then((json) => cb(null, json))
            .catch((err) => cb(new ApiError(ErrorCode.EIO, err.message)));
          break;
        default:
          cb(new ApiError(ErrorCode.EINVAL, "Invalid download type: " + type));
      }
    }
  })
  .catch((err) => cb(new ApiError(ErrorCode.EIO, err.message)));
}

/**
 * Асинхронно извлекает размер данного файла в байтах.
 * @hidden
 */
export function fetchFileSizeAsync(p: string, cb: BFSCallback<number>): void {
  fetch(p, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) {
        return cb(new ApiError(ErrorCode.EIO, `fetch HEAD error: response returned code ${res.status}`));
      } else {
        return cb(null, parseInt(res.headers.get('Content-Length') || '-1', 10));
      }
    })
    .catch((err) => cb(new ApiError(ErrorCode.EIO, err.message)));
}
