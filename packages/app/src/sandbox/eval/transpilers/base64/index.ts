import { TranspilerResult, Transpiler } from 'sandpack-core';

class Base64Transpiler extends Transpiler {
  constructor() {
    super('base64-loader');
  }

  doTranspilation(code: string) {
    return new Promise<TranspilerResult>((resolve, reject) => {
      const reader = new FileReader();

      // Is there a way to get the filename? (kinda needed for mime types)
      // @ts-ignore
      const blob: Blob =
        typeof code === 'string'
          ? new Blob([code], { type: 'image/svg+xml' })
          : code;

      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        const base64data = reader.result;
        resolve({
          transpiledCode: `module.exports = "${base64data.toString()}"`,
        });
      };

      reader.onerror = err => {
        reject(err);
      };
    });
  }
}

const transpiler = new Base64Transpiler();

export { Base64Transpiler };

export default transpiler;
