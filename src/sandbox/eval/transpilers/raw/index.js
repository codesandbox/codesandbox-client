// @flow
import Transpiler from '../';

class RawTranspiler extends Transpiler {
  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: `
      exports = \`${code || ''}\`;`,
    });
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
