import { Transpiler } from 'sandpack-core';

class RawTranspiler extends Transpiler {
  constructor() {
    super('raw-loader');
  }

  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: `
      module.exports = ${JSON.stringify(code)};`,
    });
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
