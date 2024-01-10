import { Transpiler } from 'sandpack-core';

class JSONTranspiler extends Transpiler {
  doTranspilation(code: string) {
    const result = `
      module.exports = JSON.parse(${JSON.stringify(code || '')})
    `;

    return Promise.resolve({
      transpiledCode: result,
    });
  }
}

const transpiler = new JSONTranspiler('json-loader');

export { JSONTranspiler };

export default transpiler;
