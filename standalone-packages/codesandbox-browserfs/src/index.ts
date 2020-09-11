/**
 * Основная точка входа в BrowserFS.
 * Он устанавливает все необходимые полифилы и требует () основного модуля.
 */

// IE substr не поддерживает отрицательные индексы
if ('ab'.substr(-1) !== 'b') {
  String.prototype.substr = function(substr: (start: number, length?: number) => string) {
    return function(this: string, start: number, length?: number): string {
      // получили ли мы отрицательное начало, посчитаем сколько он от начала строки
      if (start < 0) {
        start = this.length + start;
      }
      // вызвать исходную функцию
      return substr.call(this, start, length);
    };
  }(String.prototype.substr);
}

// Полифилл для Uint8Array.prototype.slice.
// Safari и некоторые другие браузеры не определяют его.
if (typeof(ArrayBuffer) !== 'undefined' && typeof(Uint8Array) !== 'undefined') {
  if (!Uint8Array.prototype['slice']) {
    Uint8Array.prototype.slice = function(this: Uint8Array, start: number = 0, end: number = this.length): Uint8Array {
      const self: Uint8Array = this;
      if (start < 0) {
        start = this.length + start;
        if (start < 0) {
          start = 0;
        }
      }
      if (end < 0) {
        end = this.length + end;
        if (end < 0) {
          end = 0;
        }
      }
      if (end < start) {
        end = start;
      }
      return new Uint8Array(self.buffer, self.byteOffset + start, end - start);
    };
  }
}

export * from './core/browserfs';
