// @flow
import Transpiler from '../';

class RawTranspiler extends Transpiler {
  constructor() {
    super('raw-loader');
  }

  async doTranspilation(code: string) {
    // code is a URL, this is probably a binary module, load its contents
    if (code.substr(0, 4) === 'http') {
      const res = await fetch(code);
      const text = await res.text();
      return {
        transpiledCode: `module.exports = ${JSON.stringify(text)};`,
      };
    }
    return {
      transpiledCode: `module.exports = ${JSON.stringify(code)};`,
    };
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
