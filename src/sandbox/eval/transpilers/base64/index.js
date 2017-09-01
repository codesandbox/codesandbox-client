// @flow
import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

import mimes from './mimes.json';

function getMime(path) {
  const extension = path
    .split('.')
    .pop()
    .toLowerCase();
  const mime = mimes[extension];
  if (!mime) {
    throw new Error(
      'Unsupported type of image of extension ' + extension + ': ' + path
    );
  }
  return mime;
}

class Base64Transpiler extends Transpiler {
  constructor() {
    super('base64-loader');
  }

  doTranspilation(code: string) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(code);

      reader.onloadend = function() {
        const base64data = reader.result;
        resolve({
          transpiledCode: `module.exports = "${base64data.toString()}"`,
        });
      };
    });
  }
}

const transpiler = new Base64Transpiler();

export { Base64Transpiler };

export default transpiler;
