import { Transpiler, LoaderContext } from 'sandpack-core';
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

    return {
      transpiledCode: `module.exports = "${URL.createObjectURL(blob)}"`,
    };
  }
}

const transpiler = new Base64Transpiler();

export { Base64Transpiler };

export default transpiler;
