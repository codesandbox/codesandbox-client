import { LoaderContext } from 'sandpack-core/lib/transpiled-module';

let core = null;

export default async (code: string, loaderContext: LoaderContext) => {
  if (!core) {
    const Core = await import(
      /* webpackChunkName: 'css-modules-loader-core' */ 'css-modules-loader-core'
    ).then(x => x.default);

    core = new Core();
  }

  const { injectableSource, exportTokens } = await core.load(
    code,
    loaderContext.path,
    async (dependencyPath: string) => {
      await loaderContext.addDependency(dependencyPath);

      const tModule = loaderContext.resolveTranspiledModule(dependencyPath);

      return tModule.source ? tModule.source.compiledCode : tModule.module.code;
    }
  );

  return {
    css: injectableSource,
    exportTokens,
  };
};
