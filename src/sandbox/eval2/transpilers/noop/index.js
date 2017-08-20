// @flow
import Transpiler from '../';

class NoopTranspiler extends Transpiler {
  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: code || '',
    });
  }
}

const transpiler = new NoopTranspiler();

export { NoopTranspiler };

export default transpiler;
