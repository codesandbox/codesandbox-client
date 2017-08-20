// @flow
import Transpiler from '../';

class RawTranspiler extends Transpiler {
  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: `
      exports.__esModule = true;
      exports.default = \`${code || ''}\`;`,
    });
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
