import { LoaderContext, Transpiler } from 'sandpack-core';

class SVGRTranspiler extends Transpiler {
  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const { svgrTransform } = await import('./transpiler');

    // We follow CRA behaviour, so the code with the component is not the default
    // export, this forces that.

    const codeIsHttp = loaderContext._module.module.code.startsWith('http');
    let downloadedCode = code;
    if (codeIsHttp) {
      await fetch(code)
        .then(res => res.text())
        .then(r => {
          downloadedCode = r;
        });
    }

    const result = await svgrTransform(loaderContext.path, downloadedCode);
    return {
      transpiledCode: result,
    };
  }
}

const transpiler = new SVGRTranspiler('svgr-loader');

export { SVGRTranspiler };

export default transpiler;
