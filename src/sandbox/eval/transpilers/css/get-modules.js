// @flow
import { type LoaderContext } from '../../transpiled-module';

let core = null;

export default async (code: string, loaderContext: LoaderContext) => {
  if (!core) {
    const Core = await import('css-modules-loader-core');

    core = new Core();
  }

  return core
    .load(code, loaderContext.path, (dependencyPath: string) => {
      const tModule = loaderContext.addDependency(dependencyPath);

      return tModule.source ? tModule.source.compiledCode : tModule.module.code;
    })
    .then(({ injectableSource, exportTokens }) => ({
      css: injectableSource,
      exportTokens,
    }));
};
