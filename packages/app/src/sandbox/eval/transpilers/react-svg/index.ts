import { LoaderContext, Transpiler } from 'sandpack-core';

class ReactSVGTranspiler extends Transpiler {
  constructor() {
    super('react-svg-loader');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const transpiledCode =
      `var link = require(${JSON.stringify(
        `!base64-loader!${loaderContext.path}`
      )});` +
      `module.exports = link;` +
      `exports.Url = link;` +
      `exports.ReactComponent = require(${JSON.stringify(
        `!babel-loader!svgr-loader!${loaderContext.path}`
      )});`;

    return {
      transpiledCode,
    };
  }
}

const transpiler = new ReactSVGTranspiler();

export { ReactSVGTranspiler };

export default transpiler;
