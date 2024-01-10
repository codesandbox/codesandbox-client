import { LoaderContext, Transpiler } from 'sandpack-core';

class ReactSVGTranspiler extends Transpiler {
  constructor() {
    super('react-svg-loader');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const transpiledCode =
      `import link from ${JSON.stringify(
        `!base64-loader!${loaderContext.path}`
      )};` +
      `export default link;` +
      `export const Url = link;` +
      `export { default as ReactComponent } from ${JSON.stringify(
        `!babel-loader!svgr-loader!${loaderContext.path}`
      )};`;

    return {
      transpiledCode,
    };
  }
}

const transpiler = new ReactSVGTranspiler();

export { ReactSVGTranspiler };

export default transpiler;
