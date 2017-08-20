// @flow
import Core from 'css-modules-loader-core';

import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

import insertCss from './utils/insert-css';

const getStyleId = id => id + '-css'; // eslint-disable-line

const core = new Core();

class CSSModulesTranspiler extends Transpiler {
  constructor() {
    super();
    this.cacheable = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const id = getStyleId(loaderContext.path);

    return core
      .load(code, loaderContext.path, (dependencyPath: string) => {
        const tModule = loaderContext.addDependency(
          dependencyPath,
          loaderContext._module.module.directoryShortid,
        );

        return tModule.source
          ? tModule.source.compiledCode
          : tModule.module.code;
      })
      .then(({ injectableSource, exportTokens }) => {
        const insertCssFunctions = insertCss(id, injectableSource);
        const cssWithExports = `${insertCssFunctions}\exports = ${JSON.stringify(
          exportTokens,
        )};`;
        return {
          transpiledCode: cssWithExports,
        };
      });
  }
}

const transpiler = new CSSModulesTranspiler();

export { CSSModulesTranspiler };

export default transpiler;
