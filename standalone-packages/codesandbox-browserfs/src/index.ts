/**
 * BrowserFS's main entry point.
 * It installs all of the needed polyfills, and requires() the main module.
 */

// IE substr does not support negative indices
if ('ab'.substr(-1) !== 'b') {
  String.prototype.substr = function(substr: (start: number, length?: number) => string) {
    return function(this: string, start: number, length?: number): string {
      // did we get a negative start, calculate how much it is from the
      // beginning of the string
      if (start < 0) {
        start = this.length + start;
      }
      // call the original function
      return substr.call(this, start, length);
    };
  }(String.prototype.substr);
}

// Polyfill for Uint8Array.prototype.slice.
// Safari and some other browsers do not define it.
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
