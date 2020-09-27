import { LoaderContext, Transpiler } from 'sandpack-core';
import { getModuleHTTPPath } from '../utils/binary';

class SVGRTranspiler extends Transpiler {
  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const { svgrTransform } = await import('./transpiler');
    // We follow CRA behaviour, so the code with the component is not the default
    // export, this forces that.

    const codeIsHttp = loaderContext._module.module.code.startsWith('http');
    const sandboxId = loaderContext.sandboxId;
    const state = {
      webpack: {
        previousExport: `"${
          codeIsHttp
            ? loaderContext._module.module.code
            : getModuleHTTPPath(loaderContext._module.module, sandboxId)
        }"`,
      },
    };

    let downloadedCode = code;

    if (codeIsHttp) {
      await fetch(code)
        .then(res => res.text())
        .then(r => {
          downloadedCode = r;
        });
    }

    const result = await svgrTransform(downloadedCode, state);

    return {
      transpiledCode: result,
    };
  }
}

const transpiler = new SVGRTranspiler('svgr-loader');

export { SVGRTranspiler };

export default transpiler;
