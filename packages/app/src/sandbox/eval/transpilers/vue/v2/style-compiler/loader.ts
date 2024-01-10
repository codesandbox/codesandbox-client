import postcss, { ProcessOptions } from 'postcss';
import postcssImportPlugin from 'postcss-import';
import { join } from 'path';
import { isDependencyPath } from 'sandbox/eval/utils/is-dependency-path';
import { TranspiledModule } from 'sandpack-core';
import { LoaderContext } from 'sandpack-core/lib/transpiled-module';

import trim from './plugins/trim';
import scopeId from './plugins/scope-id';

async function resolveCSSFile(
  loaderContext: LoaderContext,
  path: string,
  basePath: string
): Promise<TranspiledModule> {
  const isDependency = isDependencyPath(path);

  if (isDependency) {
    // First try to resolve the package.json, in case it has a style field
    try {
      const pkgJson = await loaderContext.resolveTranspiledModuleAsync(
        join(path, 'package.json')
      );
      const parsedPkg = JSON.parse(pkgJson.module.code);

      if (parsedPkg.style) {
        const fullPath = join(path, parsedPkg.style);

        return loaderContext.resolveTranspiledModuleAsync(fullPath);
      }
    } catch (e) {
      /* Move to step 2 */
    }

    return loaderContext.resolveTranspiledModuleAsync(path);
  }

  const fullPath = path.charAt(0) === '/' ? path : join(basePath, path);
  return loaderContext.resolveTranspiledModuleAsync(fullPath);
}

export default async function (
  code: string,
  loaderContext: LoaderContext
): Promise<{ transpiledCode: string; sourceMap: any }> {
  const query = loaderContext.options;

  let vueOptions = loaderContext.options.__vueOptions__;

  if (!vueOptions) {
    vueOptions = {
      ...loaderContext.options.vue,
    };
  }

  // TODO autoprefixer
  const plugins = [
    postcssImportPlugin({
      resolve: async (id: string, root: string) => {
        try {
          const result = await resolveCSSFile(
            loaderContext,
            id.replace(/^~/, ''),
            root
          );

          return result.module.path;
        } catch (e) {
          return null;
        }
      },
      load: async (filename: string) => {
        const tModule = await loaderContext.resolveTranspiledModuleAsync(
          filename
        );

        return tModule.module.code;
      },
    }),
    trim,
  ];

  const options: ProcessOptions = {
    to: loaderContext.path,
    from: loaderContext.path,
  };

  // add plugin for vue-loader scoped css rewrite
  if (query.scoped) {
    plugins.push(scopeId({ id: query.id }));
  }

  // source map
  if (
    loaderContext.sourceMap &&
    vueOptions.cssSourceMap !== false
    // !loaderContext.map
  ) {
    options.map = {
      inline: false,
      annotation: false,
      // prev: loaderContext.map,
    };
  }

  // Explicitly give undefined if code is null, otherwise postcss crashses
  const postcssResult = await postcss(plugins).process(code || '', options);

  if (postcssResult.messages) {
    const messages = postcssResult.messages as any[];
    await Promise.all(
      messages.map(m => {
        if (m.type === 'dependency') {
          return loaderContext.addDependency(m.file);
        }
        return Promise.resolve();
      })
    );
  }

  const map = postcssResult.map && postcssResult.map.toJSON();
  return { transpiledCode: postcssResult.css, sourceMap: map };
}
