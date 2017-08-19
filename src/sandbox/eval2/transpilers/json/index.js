// @flow
import Transpiler from '../';

class JSONTranspiler extends Transpiler {
  doTranspilation(code: string) {
    const result = `
      export default JSON.parse(${code || ''})
    `;
    return Promise.resolve({
      transpiledCode: result,
    });
  }
}

const transpiler = new JSONTranspiler();

export { JSONTranspiler };

export default transpiler;
