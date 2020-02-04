import postcss, { ProcessOptions } from 'postcss';
import postcssImportPlugin from 'postcss-import';

import { LoaderContext } from '../../../transpiled-module';

import trim from './plugins/trim';
import scopeId from './plugins/scope-id';

export default function(
  code: string,
  loaderContext: LoaderContext
): Promise<{ transpiledCode: string; sourceMap: any }> {
  return new Promise((resolve, reject) => {
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
        resolve: async (id: string) => {
          try {
            const result = await loaderContext.resolveTranspiledModuleAsync(id);

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

    return (
      postcss(plugins)
        // Explcitly give undefined if code is null, otherwise postcss crashses
        .process(code === null ? undefined : code, options)
        .then(result => {
          if (result.messages) {
            const messages = result.messages as any[];
            messages.forEach(m => {
              if (m.type === 'dependency') {
                loaderContext.addDependency(m.file);
              }
            });
          }

          const map = result.map && result.map.toJSON();
          resolve({ transpiledCode: result.css, sourceMap: map });

          return null; // silence bluebird warning
        })
        .catch(err => reject(err))
    );
  });
}
