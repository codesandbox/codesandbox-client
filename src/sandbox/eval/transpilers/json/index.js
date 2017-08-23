// @flow
import Transpiler from '../';

class JSONTranspiler extends Transpiler {
  doTranspilation(code: string) {
    const result = `
      exports = JSON.parse(${JSON.stringify(code || '')})
    `;

    return Promise.resolve({
      transpiledCode: result,
    });
  }
}

const transpiler = new JSONTranspiler('json-loader');

export { JSONTranspiler };

export default transpiler;
