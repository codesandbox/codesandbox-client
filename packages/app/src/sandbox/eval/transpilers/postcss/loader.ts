import postcss, { ProcessOptions } from 'postcss';
import postcssImportPlugin from 'postcss-import';
import postcssUrl from 'postcss-url';
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

export default async function (
  code: string,
  loaderContext: LoaderContext
): Promise<{ transpiledCode: string; sourceMap: any }> {
  const plugins = [
    postcssImportPlugin({
      resolve: async (id: string, root: string) => {
        try {
          // Angular specific, remove the ~ from the path to determine if it's a dependency
          const sanitizedPath = id.replace(/^~/, '');
          const result = await resolveCSSFile(
            loaderContext,
            sanitizedPath,
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
    postcssUrl({
      url: 'rebase',
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

  // Explicitly give undefined if code is null, otherwise postcss crashes
  const result = await postcss(plugins).process(
    code === null ? undefined : code,
    options
  );
  if (result.messages) {
    const messages = result.messages as any[];
    await Promise.all(
      messages.map(async m => {
        if (m.type === 'dependency') {
          await loaderContext.addDependency(m.file);
        }
      })
    );
  }

  const map = result.map && result.map.toJSON();

  return { transpiledCode: result.css, sourceMap: map };
}
