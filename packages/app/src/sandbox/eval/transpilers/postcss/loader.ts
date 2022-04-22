import postcss, { ProcessOptions } from 'postcss';
import postcssImportPlugin from 'postcss-import';
import postcssUrlPlugin from 'postcss-url';
import { join } from 'path';
import { isDependencyPath } from 'sandbox/eval/utils/is-dependency-path';

import { LoaderContext, TranspiledModule } from 'sandpack-core';
import hash from 'hash-sum';
import { getBase64FromContent } from '../base64';

export const generateId = () => {
  return `$csb__${hash(`${Date.now()}-${Math.random() * 1000}`)}`;
};

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

function getPackageName(filepath: string): string {
  const parts = filepath.split('/');
  parts.shift();
  parts.shift();
  if (parts[0][0] === '@') {
    return `${parts[0]}/${parts[1]}`;
  }
  return parts[0];
}

export default async function (
  code: string,
  loaderContext: LoaderContext
): Promise<{ transpiledCode: string; sourceMap: any }> {
  // map hash to url
  const collectedUrls: Map<string, string> = new Map();
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
    postcssUrlPlugin({
      url: url => {
        if (url.absolutePath && !url.url.startsWith('data')) {
          const id = generateId();
          collectedUrls.set(id, url.absolutePath);
          return `${id}${url.search ?? ''}${url.hash ?? ''}`;
        }

        return url.url;
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

  let transpiledCode = result.css;
  const map = result.map && result.map.toJSON();

  async function _loadModule(filepath: string): Promise<string> {
    // We load straight from the unpkg link if it's a node_module
    if (filepath.startsWith('/node_modules')) {
      const packageName = getPackageName(filepath);
      const packageRoot = `/node_modules/${packageName}`;
      const pkgJsonModule = await loaderContext.resolveTranspiledModuleAsync(
        `${packageRoot}/package.json`,
        {
          isAbsolute: true,
        }
      );
      const pkgVersion = JSON.parse(pkgJsonModule.module.code).version;
      const remainingPath = filepath.replace(packageRoot, '');
      return `https://unpkg.com/${packageName}@${pkgVersion}/${remainingPath}`;
    }

    // We load from a base64 string
    const module = await loaderContext.resolveTranspiledModuleAsync(filepath, {
      isAbsolute: true,
    });
    return getBase64FromContent(module.module.code, module.module.path);
  }

  const loadCache: Map<string, Promise<string>> = new Map();
  function loadModule(filepath: string): Promise<string> {
    let promise: Promise<string> = loadCache.get(filepath);
    if (!promise) {
      promise = _loadModule(filepath);
      loadCache.set(filepath, promise);
    }
    return promise;
  }

  await Promise.all(
    Array.from(collectedUrls.entries()).map(async ([hashKey, filepath]) => {
      const fullUrl = await loadModule(filepath);
      transpiledCode = transpiledCode.replace(hashKey, fullUrl);
    })
  );

  // console.log(loaderContext.path, collectedUrls);

  return { transpiledCode, sourceMap: map };
}
