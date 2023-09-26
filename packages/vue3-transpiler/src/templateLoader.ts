import qs from 'querystring';
import { LoaderContext } from 'sandpack-core';
import loaderUtils from 'sandpack-core/lib/transpiler/utils/loader-utils';
import { compileTemplate, TemplateCompiler } from 'vue3-browser-compiler';
import { WarningStructure } from 'sandpack-core/lib/transpiler/utils/worker-warning-handler';

import { VueLoaderOptions } from './index';
import { formatError } from './formatError';

// Loader that compiles raw template into JavaScript functions.
// This is injected by the global pitcher (../pitch) for template
// selection requests initiated from vue files.
function TemplateLoader(source: string, loaderContext: LoaderContext) {
  // eslint-disable-next-line no-param-reassign
  source = String(source);
  const inMap = undefined;

  // although this is not the main vue-loader, we can get access to the same
  // vue-loader options because we've set an ident in the plugin and used that
  // ident to create the request for this loader in the pitcher.
  const options = (loaderUtils.getOptions(loaderContext) ||
    {}) as VueLoaderOptions;

  const query = qs.parse(loaderContext.resourceQuery.slice(1));
  const id: string = `${query.id}`;
  const scopeId = query.scoped ? `data-v-${id}` : null;

  let compiler: TemplateCompiler | undefined;
  if (typeof options.compiler === 'string') {
    // compiler = require(options.compiler);
    throw new Error("Setting compiler via string doesn't work in CodeSandbox");
  } else {
    compiler = options.compiler;
  }

  const compiled = compileTemplate({
    id,
    source,
    inMap,
    filename: loaderContext.path,
    ssr: loaderContext.target === 'node',
    compiler,
    compilerOptions: {
      ...options.compilerOptions,
      scopeId,
      bindingMetadata:
        typeof query.bindings === 'string' ? JSON.parse(query.bindings) : {},
    },
    transformAssetUrls: options.transformAssetUrls || true,
  });

  // tips
  if (compiled.tips.length) {
    compiled.tips.forEach(tip => {
      const warning: WarningStructure = {
        message: tip,
        fileName: loaderContext.path,
        source: 'Vue Template Compiler',
        severity: 'notice',
        lineNumber: 0,
        columnNumber: 0,
      };
      loaderContext.emitWarning(warning);
    });
  }

  // errors
  if (compiled.errors && compiled.errors.length) {
    compiled.errors.forEach(err => {
      if (typeof err === 'string') {
        loaderContext.emitError(new Error(err));
      } else {
        formatError(
          err,
          // @ts-ignore
          inMap ? inMap.sourcesContent![0] : (source as string),
          loaderContext.path
        );
        loaderContext.emitError(err);
      }
    });
  }

  const { code, map } = compiled;
  // loaderContext.callback(null, code, map);
  return { transpiledCode: code, sourceMap: map };
}

export default TemplateLoader;
