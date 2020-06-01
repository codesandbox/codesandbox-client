import Transpiler from '..';

class JSONTranspiler extends Transpiler {
  doTranspilation(code: string) {
    const result = `
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _default = JSON.parse(${JSON.stringify(code || '')})
    exports["default"] = _default;
    `;

    return Promise.resolve({
      transpiledCode: result,
    });
  }
}

const transpiler = new JSONTranspiler('json-loader');

export { JSONTranspiler };

export default transpiler;
