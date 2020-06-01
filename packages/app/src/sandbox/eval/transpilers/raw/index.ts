import Transpiler from '..';

class RawTranspiler extends Transpiler {
  constructor() {
    super('raw-loader');
  }

  doTranspilation(code: string) {
    return Promise.resolve({
      transpiledCode: `
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _default = ${JSON.stringify(code)};
      exports["default"] = _default;
      `,
    });
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
