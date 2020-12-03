import { Transpiler } from 'sandpack-core';

class NoopTranspiler extends Transpiler {
  constructor() {
    super('noop-loader');
  }

  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: code || '',
    });
  }
}

const transpiler = new NoopTranspiler();

export { NoopTranspiler };

export default transpiler;
