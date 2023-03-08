import path from 'path';
import qs from 'querystring';
import hash from 'hash-sum';
import loaderUtils from 'sandpack-core/lib/transpiler/utils/loader-utils';
import { LoaderContext, TranspilerResult } from 'sandpack-core';
import {
  parse,
  compileScript,
  TemplateCompiler,
  CompilerOptions,
  SFCBlock,
  SFCTemplateCompileOptions,
  SFCScriptCompileOptions,
  SFCStyleBlock,
  SFCScriptBlock,
} from 'vue3-browser-compiler';
import { selectBlock } from './select';
import { genHotReloadCode } from './hotReload';
import { genCSSModulesCode } from './cssModules';
import { formatError } from './formatError';

import vueTemplateLoader from './transpilers/template-loader';
import vueStylePostLoader from './transpilers/style-post-loader';

export interface VueLoaderOptions {
  // https://babeljs.io/docs/en/next/babel-parser#plugins
  babelParserPlugins?: SFCScriptCompileOptions['babelParserPlugins'];
  transformAssetUrls?: SFCTemplateCompileOptions['transformAssetUrls'];
  compiler?: TemplateCompiler | string;
  compilerOptions?: CompilerOptions;
  hotReload?: boolean;
  exposeFilename?: boolean;
  appendExtension?: boolean;
}

qs.escape = encodeURIComponent;

export default function loader(
  source: string,
  loaderContext: LoaderContext
): TranspilerResult {
  function getLoaderQuery(lang: string | undefined, vueQuery: string) {
    // !style-loader!css-loader
    const query = lang
      ? loaderContext.getLoaderQuery({
          path: `test.${lang}`,
          code: '',
        })
      : '';

    return `${query}!vue-loader${vueQuery}`;
  }

  const stringifyRequest = (r: string) =>
    loaderUtils.stringifyRequest(loaderContext, r);

  const { target, sourceMap, resourceQuery } = loaderContext;

  const rootContext = '/';
  const resourcePath = loaderContext.path;

  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);
  const options = (loaderUtils.getOptions(loaderContext) ||
    {}) as VueLoaderOptions;

  const isServer = target === 'node';
  const isProduction = false;

  const { descriptor, errors } = parse(source, {
    filename: resourcePath,
    sourceMap,
  });

  if (errors.length) {
    errors.forEach(err => {
      formatError(err, source, resourcePath);
      loaderContext.emitError(err);
    });
    return { transpiledCode: `` };
  }

  // if the query has a type field, this is a language block request
  // e.g. foo.vue?type=template&id=xxxxx
  // and we will return early
  if (incomingQuery.type) {
    return selectBlock(descriptor, incomingQuery);
  }

  // module id for scoped CSS & hot-reload
  const rawShortFilePath = path
    .relative(rootContext || process.cwd(), resourcePath)
    .replace(/^(\.\.[/\\])+/, '');
  const shortFilePath = rawShortFilePath.replace(/\\/g, '/') + resourceQuery;
  const id = hash(isProduction ? shortFilePath + '\n' + source : shortFilePath);

  // feature information
  const hasScoped = descriptor.styles.some(s => s.scoped);
  const needsHotReload =
    !isServer &&
    !isProduction &&
    !!(descriptor.script || descriptor.template) &&
    options.hotReload !== false;

  // script
  let script: SFCScriptBlock | undefined;
  let scriptImport = `const script = {}`;
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      // eslint-disable-next-line no-multi-assign
      script = (descriptor as any).scriptCompiled = compileScript(descriptor, {
        babelParserPlugins: options.babelParserPlugins,
        id,
      });
    } catch (e: any) {
      loaderContext.emitError(e);
    }

    if (script) {
      const src = script.src || resourcePath;
      const attrsQuery = attrsToQuery(script.attrs, 'js');
      const query = `?vue&type=script${attrsQuery}${resourceQuery}`;
      const importers = getLoaderQuery(script.lang || 'js', query);
      const scriptRequest = stringifyRequest(importers + '!' + src);
      scriptImport =
        `import script from ${scriptRequest}\n` +
        // support named exports
        `export * from ${scriptRequest}`;
    }
  }

  // template
  let templateImport = ``;
  let templateRequest;
  const renderFnName = isServer ? `ssrRender` : `render`;
  if (descriptor.template) {
    const src = descriptor.template.src || resourcePath;
    const idQuery = `&id=${id}`;
    const scopedQuery = hasScoped ? `&scoped=true` : ``;
    const attrsQuery = attrsToQuery(descriptor.template.attrs);
    const bindingsQuery = script?.bindings
      ? `&bindings=${JSON.stringify(script.bindings)}`
      : ``;
    const query = `?vue&type=template${idQuery}${scopedQuery}${attrsQuery}${bindingsQuery}${resourceQuery}`;
    const importers = `!babel-loader!${vueTemplateLoader.name}${getLoaderQuery(
      undefined,
      query
    )}`;
    templateRequest = stringifyRequest(importers + '!' + src);
    templateImport = `import { ${renderFnName} } from ${templateRequest};`;
  }

  // styles
  let stylesCode = ``;
  let hasCSSModules = false;
  if (descriptor.styles.length) {
    descriptor.styles.forEach((style: SFCStyleBlock, i: number) => {
      const src = style.src || resourcePath;
      const attrsQuery = attrsToQuery(style.attrs, 'css');
      // make sure to only pass id when necessary so that we don't inject
      // duplicate tags when multiple components import the same css file
      const idQuery = style.scoped ? `&id=${id}` : ``;
      const query = `?vue&type=style&index=${i}${idQuery}${attrsQuery}${resourceQuery}`;
      const importers = getLoaderQuery(style.lang || 'css', query);

      const styleRequest = stringifyRequest(
        // Add the vue-style-post-loader after style-loader
        importers.replace(
          /!style-loader(.*?)!/,
          `!style-loader$1!${vueStylePostLoader.name}!`
        ) +
          '!' +
          src
      );
      if (style.module) {
        if (!hasCSSModules) {
          stylesCode += `\nconst cssModules = script.__cssModules = {}`;
          hasCSSModules = true;
        }
        stylesCode += genCSSModulesCode(
          id,
          i,
          styleRequest,
          style.module,
          needsHotReload
        );
      } else {
        stylesCode += `\nimport ${styleRequest}`;
      }
      // TODO SSR critical CSS collection
    });
  }

  let code = [
    templateImport,
    scriptImport,
    stylesCode,
    templateImport ? `script.${renderFnName} = ${renderFnName}` : ``,
  ]
    .filter(Boolean)
    .join('\n');

  // attach scope Id for runtime use
  if (hasScoped) {
    code += `\nscript.__scopeId = "data-v-${id}"`;
  }

  if (needsHotReload) {
    code += genHotReloadCode(id, templateRequest);
  }

  // Expose filename. This is used by the devtools and Vue runtime warnings.
  if (!isProduction) {
    // Expose the file's full path in development, so that it can be opened
    // from the devtools.
    code += `\nscript.__file = ${JSON.stringify(
      rawShortFilePath.replace(/\\/g, '/')
    )}`;
  } else if (options.exposeFilename) {
    // Libraries can opt-in to expose their components' filenames in production builds.
    // For security reasons, only expose the file's basename in production.
    code += `\nscript.__file = ${JSON.stringify(path.basename(resourcePath))}`;
  }

  // custom blocks
  if (descriptor.customBlocks && descriptor.customBlocks.length) {
    code += `\n/* custom blocks */\n`;
    code +=
      descriptor.customBlocks
        .map((block, i) => {
          const src = block.attrs.src || resourcePath;
          const attrsQuery = attrsToQuery(block.attrs);
          const blockTypeQuery = `&blockType=${qs.escape(block.type)}`;
          const issuerQuery = block.attrs.src
            ? `&issuerPath=${qs.escape(resourcePath)}`
            : '';
          const query = `?vue&type=custom&index=${i}${blockTypeQuery}${issuerQuery}${attrsQuery}${resourceQuery}`;
          return (
            `import block${i} from ${stringifyRequest(src + query)}\n` +
            `if (typeof block${i} === 'function') block${i}(script)`
          );
        })
        .join(`\n`) + `\n`;
  }

  // finalize
  code += `\n\nexport default script`;

  return { transpiledCode: code };
}

// these are built-in query parameters so should be ignored
// if the user happen to add them as attrs
const ignoreList = ['id', 'index', 'src', 'type'];

function attrsToQuery(attrs: SFCBlock['attrs'], langFallback?: string): string {
  let query = ``;
  for (const name in attrs) {
    const value = attrs[name];
    if (!ignoreList.includes(name)) {
      query += `&${qs.escape(name)}=${value ? qs.escape(String(value)) : ``}`;
    }
  }
  if (langFallback && !(`lang` in attrs)) {
    query += `&lang=${langFallback}`;
  }
  return query;
}
