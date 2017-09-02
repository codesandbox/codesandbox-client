import postcss from 'postcss';

import { type LoaderContext } from '../../../transpiled-module';

import trim from './plugins/trim';
import scopeId from './plugins/scope-id';

export default function(code: string, loaderContext: LoaderContext) {
  return new Promise(resolve => {
    const query = loaderContext.options;

    let vueOptions = loaderContext.options.__vueOptions__;

    if (!vueOptions) {
      vueOptions = Object.assign(
        {},
        loaderContext.options.vue,
        loaderContext.vue
      );
    }

    // TODO autoprefixer
    const plugins = [trim];

    const options = {
      to: loaderContext.path,
      from: loaderContext.path,
      map: false,
    };

    // add plugin for vue-loader scoped css rewrite
    if (query.scoped) {
      plugins.push(scopeId({ id: query.id }));
    }

    // source map
    if (
      loaderContext.sourceMap &&
      vueOptions.cssSourceMap !== false &&
      !loaderContext.map
    ) {
      options.map = {
        inline: false,
        annotation: false,
        prev: loaderContext.map,
      };
    }

    return postcss(plugins)
      .process(code, options)
      .then(result => {
        if (result.messages) {
          result.messages.forEach(m => {
            if (m.type === 'dependency') {
              loaderContext.addDependency(m.file);
            }
          });
        }

        const map = result.map && result.map.toJSON();
        resolve({ transpiledCode: result.css, sourceMap: map });

        return null; // silence bluebird warning
      });
  });
}
