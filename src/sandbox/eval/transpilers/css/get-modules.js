// @flow
import Core from 'css-modules-loader-core';
import { type LoaderContext } from '../../transpiled-module';

const core = new Core();

export default (code: string, loaderContext: LoaderContext) =>
  core
    .load(code, loaderContext.path, (dependencyPath: string) => {
      const tModule = loaderContext.addDependency(dependencyPath);

      return tModule.source ? tModule.source.compiledCode : tModule.module.code;
    })
    .then(({ injectableSource, exportTokens }) => ({
      css: injectableSource,
      exportTokens,
    }));
