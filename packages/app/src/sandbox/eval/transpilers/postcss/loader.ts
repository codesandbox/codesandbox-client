import postcss, { ProcessOptions } from 'postcss';
import postcssImportPlugin from 'postcss-import';
import { join } from 'path';
import { isDependencyPath } from 'sandbox/eval/utils/is-dependency-path';

import { LoaderContext, TranspiledModule } from 'sandpack-core';

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

export default function(
  code: string,
  loaderContext: LoaderContext
): Promise<{ transpiledCode: string; sourceMap: any }> {
  return new Promise((resolve, reject) => {
    const plugins = [
      postcssImportPlugin({
        resolve: async (id: string, root: string) => {
          try {
            const result = await resolveCSSFile(loaderContext, id, root);

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
    ];

    const options: ProcessOptions = {
      to: loaderContext.path,
      from: loaderContext.path,
      map: {
        inline: true,
        annotation: true,
      },
    };

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
