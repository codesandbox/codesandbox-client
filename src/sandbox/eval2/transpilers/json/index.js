// @flow
import Transpiler from '../';
import TranspiledModule, { type LoaderContext } from '../../TranspiledModule';

class JSONTranspiler extends Transpiler {
  doTranspilation(module: TranspiledModule, loaderContext: LoaderContext) {
    const result = `
      export default JSON.parse(${module.module.code || ''})
    `;
    return Promise.resolve({
      transpiledCode: result,
    });
  }
}

const transpiler = new JSONTranspiler();

export { JSONTranspiler };

export default transpiler;
