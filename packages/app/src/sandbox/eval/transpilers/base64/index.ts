import { Transpiler, LoaderContext } from 'sandpack-core';
import { extname } from 'path';
import { isUrl } from '@codesandbox/common/lib/utils/is-url';

// @ts-ignore
import mimeTypes from './mimes.json';

function getMimeType(filePath: string): string | null | undefined {
  const extension = extname(filePath).slice(1);
  return mimeTypes[extension];
}

async function createDataUri(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data.toString());
    };

    reader.onerror = err => {
      reject(err);
    };
  });
}

class Base64Transpiler extends Transpiler {
  constructor() {
    super('base64-loader');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    let uri: string = '#';
    if (typeof code === 'string' && isUrl(code)) {
      uri = code;
    } else {
      const blob: Blob =
        typeof code === 'string'
          ? new Blob([code], { type: getMimeType(loaderContext.path) })
          : code;
      uri = await createDataUri(blob);
    }

    return {
      transpiledCode: `module.exports = "${uri}"`,
    };
  }
}

const transpiler = new Base64Transpiler();

export { Base64Transpiler };

export default transpiler;
