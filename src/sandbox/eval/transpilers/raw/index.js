// @flow
import Transpiler from '../';

class RawTranspiler extends Transpiler {
  constructor() {
    super('raw-loader');
  }

  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: `
      exports = ${JSON.stringify(code)};`,
    });
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
