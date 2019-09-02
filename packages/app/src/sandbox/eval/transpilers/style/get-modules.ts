import { LoaderContext } from '../../transpiled-module';

let core = null;

export default async (code: string, loaderContext: LoaderContext) => {
  if (!core) {
    const Core = await import(
      /* webpackChunkName: 'css-modules-loader-core' */ 'css-modules-loader-core'
    ).then(x => x.default);

    core = new Core();
  }

  return core
    .load(code, loaderContext.path, (dependencyPath: string) => {
      loaderContext.addDependency(dependencyPath);

      const tModule = loaderContext.resolveTranspiledModule(dependencyPath);

      return tModule.source ? tModule.source.compiledCode : tModule.module.code;
    })
    .then(({ injectableSource, exportTokens }) => ({
      css: injectableSource,
      exportTokens,
    }));
};
