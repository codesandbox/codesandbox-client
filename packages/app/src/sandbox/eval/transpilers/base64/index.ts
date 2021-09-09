import { Transpiler, LoaderContext, TranspilerResult } from 'sandpack-core';
import { extname } from 'path';
// @ts-ignore
import mimeTypes from './mimes.json';

function getMimeType(filePath: string): string | null | undefined {
  const extension = extname(filePath).slice(1);
  return mimeTypes[extension];
}

class Base64Transpiler extends Transpiler {
  constructor() {
    super('base64-loader');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const blob: Blob =
      typeof code === 'string'
        ? new Blob([code], { type: getMimeType(loaderContext.path) })
        : code;

    return new Promise<TranspilerResult>((resolve, reject) => {
      const reader = new FileReader();

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
