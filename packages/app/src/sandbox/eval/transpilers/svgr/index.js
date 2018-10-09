// @flow
import Transpiler from '../';
import type { LoaderContext } from '../../../eval/transpiled-module';

class SVGRTranspiler extends Transpiler {
  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const { svgrTransform } = await import('./transpiler');
    // We follow CRA behaviour, so the code with the component is not the default
    // export, this forces that.
    const state = {
      webpack: {
        previousExport: `"${loaderContext._module.module.path}"`,
      },
    };

    let downloadedCode = code;

    if (code.startsWith('http')) {
      await fetch(code)
        .then(res => res.text())
        .then(r => {
          downloadedCode = r;
        });
    }

    const result = await svgrTransform(downloadedCode, state);

    console.log(result);

    return {
      transpiledCode: result,
    };
  }
}

const transpiler = new SVGRTranspiler('svgr-loader');

export { SVGRTranspiler };

export default transpiler;
