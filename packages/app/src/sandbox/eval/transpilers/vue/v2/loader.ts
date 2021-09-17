// @flow
/* eslint-disable import/no-webpack-loader-syntax, prefer-template, no-use-before-define, no-shadow, operator-assignment, no-else-return */
import querystring from 'querystring';

import { basename, dirname } from '@codesandbox/common/lib/utils/path';

import type { LoaderContext } from 'sandpack-core';
import loaderUtils from 'sandpack-core/lib/transpiler/utils/loader-utils';
// @ts-ignore
import componentNormalizerRaw from '!raw-loader!./component-normalizer';
// @ts-ignore
import vueHotReloadAPIRaw from '!raw-loader!vue-hot-reload-api';

import genId from './utils/gen-id';
import parse from './parser';

// When extracting parts from the source vue file, we want to apply the
// loaders chained before vue-loader, but exclude some loaders that simply
// produces side effects such as linting.
function getRawRequest(loaderContext) {
  return loaderUtils.getRemainingRequest(loaderContext);
}

const hotReloadAPIPath = '!noop-loader!/node_modules/vue-hot-reload-api.js';
const styleLoaderPath = 'vue-style-loader';
const templateCompilerPath = 'vue-template-compiler';
const styleCompilerPath = 'vue-style-compiler';
const selectorPath = 'vue-selector';

const defaultLang = {
  template: 'html',
  styles: 'css',
  script: 'js',
};

const postcssExtensions = ['postcss', 'pcss', 'sugarss', 'sss'];

const rewriterInjectRE = /\b(css(?:-loader)?(?:\?[^!]+)?)(?:!|$)/;

export default async function (content: string, loaderContext: LoaderContext) {
  const dependencyPromises = [];
  const addDependency = (p: string) => {
    dependencyPromises.push(loaderContext.addDependency(p, options));
  };

  // Emit the vue-hot-reload-api so it's available in the sandbox
  loaderContext.emitModule(
    hotReloadAPIPath,
    vueHotReloadAPIRaw,
    '/',
    false,
    false
  );

  const path = loaderContext.path;
  const query = loaderContext.options;
  const filePath = loaderContext._module.module.path;
  const options = {
    // Always disable esModule as sandpack is CommonJS
    esModule: false,
    ...this.vue,
    ...query,
  };

  const rawRequest = getRawRequest(loaderContext);
  const fileName = basename(filePath);

  const sourceRoot = dirname(path);
  const moduleId = 'data-v-' + genId(path, options.context, options.hashKey);

  const cssLoaderOptions = '?sourceMap';

  let output = '';
  const bustCache = true;

  const parts = parse(content, fileName, false, sourceRoot);
  const hasScoped = parts.styles.some(({ scoped }) => scoped);
  const templateAttrs =
    parts.template && parts.template.attrs && parts.template.attrs;
  const hasComment = templateAttrs && templateAttrs.comments;
  const functionalTemplate = templateAttrs && templateAttrs.functional;
  const bubleTemplateOptions = { ...options.buble };
  bubleTemplateOptions.transforms = { ...bubleTemplateOptions.transforms };
  bubleTemplateOptions.transforms.stripWithFunctional = functionalTemplate;

  const templateCompilerOptions =
    '?' +
    JSON.stringify({
      id: moduleId,
      hasScoped,
      hasComment,
      transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href',
      },
      preserveWhitespace: false,
      buble: bubleTemplateOptions,
      // only pass compilerModules if it's a path string
      compilerModules:
        typeof options.compilerModules === 'string'
          ? options.compilerModules
          : undefined,
    });

  const defaultLoaders = {
    html: templateCompilerPath + templateCompilerOptions,
    css: styleLoaderPath + '!css-loader' + cssLoaderOptions,
    js: 'babel-loader',
  };

  const codeSandboxLoaders = {
    less: ['vue-style-loader', 'css-loader', 'less-loader'],
    scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
    sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
    styl: ['vue-style-loader', 'css-loader', 'stylus-loader'],
    stylus: ['vue-style-loader', 'css-loader', 'stylus-loader'],
    ts: ['ts-loader'],
    typescript: ['ts-loader'],
    pug: ['pug-loader'],
    coffee: ['babel-loader', 'coffee-loader'],
  };

  const loaders = { ...defaultLoaders, ...codeSandboxLoaders };
  const preLoaders = {};
  const postLoaders = {};

  const needsHotReload = parts.script || parts.template;
  if (needsHotReload) {
    output += 'var disposed = false\n';
  }

  let cssModules;
  if (parts.styles.length) {
    let styleInjectionCode = 'function injectStyle (ssrContext) {\n';
    if (needsHotReload) {
      styleInjectionCode += `  if (disposed) return\n`;
    }
    parts.styles.forEach((style, i) => {
      // require style
      let requireString = style.src
        ? getRequireForImport('styles', style, style.scoped)
        : getRequire('styles', style, i, style.scoped);

      const hasStyleLoader = requireString.indexOf('style-loader') > -1;
      // const hasVueStyleLoader = requireString.indexOf('vue-style-loader') > -1;

      const invokeStyle = c => `  ${c}\n`;

      const moduleName = style.module === true ? '$style' : style.module;
      // setCssModule
      if (moduleName) {
        if (!cssModules) {
          cssModules = {};
          if (needsHotReload) {
            output += `var cssModules = {}\n`;
          }
        }

        if (moduleName in cssModules) {
          loaderContext.emitError(
            new Error('CSS module name "' + moduleName + '" is not unique!')
          );
          styleInjectionCode += invokeStyle(requireString);
        } else {
          cssModules[moduleName] = true;

          // `(vue-)style-loader` exposes the name-to-hash map directly
          // `css-loader` exposes it in `.locals`
          // add `.locals` if the user configured to not use style-loader.
          if (!hasStyleLoader) {
            requireString += '.locals';
          }

          if (!needsHotReload) {
            styleInjectionCode += invokeStyle(
              'this["' + moduleName + '"] = ' + requireString
            );
          } else {
            // handle hot reload for CSS modules.
            // we store the exported locals in an object and proxy to it by
            // defining getters inside component instances' lifecycle hook.
            /* prettier-ignore */
            styleInjectionCode +=
            invokeStyle(`cssModules["${moduleName}"] = ${requireString}`) +
            `Object.defineProperty(this, "${moduleName}", { get: function () { return cssModules["${moduleName}"] }})\n`

            const requirePath = style.src
              ? getRequireForImportString('styles', style, style.scoped)
              : getRequireString('styles', style, i, style.scoped);

            output +=
              `module.hot && module.hot.accept([${requirePath}], function () {\n` +
              // 1. check if style has been injected
              `  var oldLocals = cssModules["${moduleName}"]\n` +
              `  if (!oldLocals) return\n` +
              // 2. re-import (side effect: updates the <style>)
              `  var newLocals = ${requireString}\n` +
              // 3. compare new and old locals to see if selectors changed
              `  if (JSON.stringify(newLocals) === JSON.stringify(oldLocals)) return\n` +
              // 4. locals changed. Update and force re-render.
              `  cssModules["${moduleName}"] = newLocals\n` +
              `  require("${hotReloadAPIPath}").rerender("${moduleId}")\n` +
              `})\n`;
          }
        }
      } else {
        styleInjectionCode += invokeStyle(requireString);
      }
    });
    styleInjectionCode += '}\n';
    output += styleInjectionCode;
  }

  loaderContext.emitModule(
    // No extension, so no transpilation !noop
    '!noop-loader!/node_modules/component-normalizer.js',
    componentNormalizerRaw,
    '/',
    false,
    false
  );

  // we require the component normalizer function, and call it like so:
  // normalizeComponent(
  //   scriptExports,
  //   compiledTemplate,
  //   functionalTemplate,
  //   injectStyles,
  //   scopeId,
  //   moduleIdentifier (server only)
  // )
  output +=
    "var normalizeComponent = require('!noop-loader!/node_modules/component-normalizer.js')\n";

  // <script>
  output += '  /* script */\n  ';
  const { script } = parts;
  if (script) {
    output +=
      'var __vue_script__ = ' +
      (script.src
        ? getRequireForImport('script', script, false)
        : getRequire('script', script, 0, false)) +
      '\n';

    // inject loader interop
    if (query.inject) {
      output += '__vue_script__ = __vue_script__(injections)\n';
    }
  } else {
    output += 'var __vue_script__ = null\n';
  }

  // <template>
  output += '/* template */\n';
  const { template } = parts;
  if (template) {
    output +=
      'var __vue_template__ = ' +
      (template.src
        ? getRequireForImport('template', template, false)
        : getRequire('template', template, 0, false)) +
      '\n';
  } else {
    output += 'var __vue_template__ = null\n';
  }

  // template functional
  output += '/* template functional */\n';
  output +=
    'var __vue_template_functional__ = ' +
    (functionalTemplate ? 'true' : 'false') +
    '\n';

  // style
  output += '  /* styles */\n  ';
  output +=
    'var __vue_styles__ = ' +
    (parts.styles.length ? 'injectStyle' : 'null') +
    '\n';

  // scopeId
  output += '  /* scopeId */\n  ';
  output +=
    'var __vue_scopeId__ = ' +
    (hasScoped ? JSON.stringify(moduleId) : 'null') +
    '\n';

  // moduleIdentifier (server only)
  output += '/* moduleIdentifier (server only) */\n';
  output += 'var __vue_module_identifier__ = null\n';

  // close normalizeComponent call
  output +=
    'var Component = normalizeComponent(\n' +
    '  __vue_script__,\n' +
    '  __vue_template__,\n' +
    '  __vue_template_functional__,\n' +
    '  __vue_styles__,\n' +
    '  __vue_scopeId__,\n' +
    '  __vue_module_identifier__\n' +
    ')\n';

  // add filename in dev
  output += 'Component.options.__file = ' + JSON.stringify(path) + '\n';

  if (!query.inject) {
    // hot reload
    if (needsHotReload) {
      output +=
        '\n/* hot reload */\n' +
        'if (module.hot) {(function () {\n' +
        '  var hotAPI = require("' +
        hotReloadAPIPath +
        '")\n' +
        '  hotAPI.install(require("vue"), false)\n' +
        '  if (!hotAPI.compatible) return\n' +
        '  module.hot.accept()\n' +
        '  if (!module.hot.data) {\n' +
        // initial insert
        '    hotAPI.createRecord("' +
        moduleId +
        '", Component.options)\n' +
        '  } else {\n';
      // update
      if (cssModules) {
        output +=
          '    if (module.hot.data.cssModules && Object.keys(module.hot.data.cssModules) !== Object.keys(cssModules)) {\n' +
          '      delete Component.options._Ctor\n' +
          '    }\n';
      }
      output += `    hotAPI.${
        functionalTemplate ? 'rerender' : 'reload'
      }("${moduleId}", Component.options)\n  }\n`;
      // dispose
      output +=
        '  module.hot.dispose(function (data) {\n' +
        (cssModules ? '    data.cssModules = cssModules\n' : '') +
        '    disposed = true\n' +
        '  })\n';
      output += '})()}\n';
    }

    // final export
    output += '\nmodule.exports = Component.exports\n';
  } else {
    // inject-loader support
    output =
      '\n/* dependency injection */\n' +
      'module.exports = function (injections) {\n' +
      output +
      '\n' +
      '\nreturn Component.exports\n}';
  }

  await Promise.all(dependencyPromises);

  // done
  return output;

  // --- helpers ---

  function getRequire(type, part, index: number, scoped: boolean) {
    return 'require(' + getRequireString(type, part, index, scoped) + ')';
  }

  function getRequireString(type, part, index: number, scoped: boolean) {
    const rawPath =
      '!!' +
      // get loader string for pre-processors
      getLoaderString(type, part, index, scoped) +
      // // select the corresponding part from the vue file
      getSelectorString(type, index || 0) +
      // the url to the actual vue file, including remaining requests
      // getFileName(type, part, index);
      rawRequest;

    // loaderContext.emitModule(rawPath, part.content, dirname(filePath), false, false);

    const depPath = loaderUtils.stringifyRequest(loaderContext, rawPath);
    addDependency(JSON.parse(depPath));

    return depPath;
  }

  function getRequireForImport(type, impt, scoped: boolean) {
    return 'require(' + getRequireForImportString(type, impt, scoped) + ')';
  }

  function getRequireForImportString(type, impt, scoped: boolean) {
    const depPath = loaderUtils.stringifyRequest(
      loaderContext,
      '!!' + getLoaderString(type, impt, 0, scoped) + impt.src
    );

    addDependency(JSON.parse(depPath));

    return depPath;
  }

  function addCssModulesToLoader(loader, part, index: number) {
    if (!part.module) return loader;
    const option = options.cssModules || {};
    const DEFAULT_OPTIONS = {
      modules: true,
    };
    const OPTIONS = {
      localIdentName: '[hash:base64]',
      importLoaders: true,
    };
    return loader.replace(/((?:^|!)css(?:-loader)?)(\?[^!]*)?/, (m, $1, $2) => {
      // $1: !css-loader
      // $2: ?a=b
      const q = loaderUtils.parseQuery($2 || '?');
      Object.assign(q, OPTIONS, option, DEFAULT_OPTIONS);
      if (index >= 0) {
        // Note:
        //   Class name is generated according to its filename.
        //   Different <style> tags in the same .vue file may generate same names.
        //   Append `_[index]` to class name to avoid this.
        q.localIdentName += '_' + index;
      }
      return $1 + '?' + JSON.stringify(q);
    });
  }

  function buildCustomBlockLoaderString(attrs) {
    const noSrcAttrs = { ...attrs };
    delete noSrcAttrs.src;
    const qs = querystring.stringify(noSrcAttrs);
    return qs ? '?' + qs : qs;
  }

  // stringify an Array of loader objects
  function stringifyLoaders(_loaders) {
    return _loaders
      .map(obj =>
        obj && typeof obj === 'object' && typeof obj.loader === 'string'
          ? obj.loader + (obj.options ? '?' + JSON.stringify(obj.options) : '')
          : obj
      )
      .join('!');
  }

  function getLoaderString(type, part, index: number, scoped: boolean) {
    let loader = getRawLoaderString(type, part, index, scoped);
    const lang = getLangString(type, part);
    if (preLoaders[lang]) {
      loader = loader + ensureBang(preLoaders[lang]);
    }
    if (postLoaders[lang]) {
      loader = ensureBang(postLoaders[lang]) + loader;
    }
    return loader;
  }

  function getLangString(type, { lang }) {
    if (type === 'script' || type === 'template' || type === 'styles') {
      return lang || defaultLang[type];
    } else {
      return type;
    }
  }

  function getRawLoaderString(type, part, index: number, scoped: boolean) {
    let lang = part.lang || defaultLang[type];

    let styleCompiler = '';
    if (type === 'styles') {
      // style compiler that needs to be applied for all styles
      styleCompiler =
        styleCompilerPath +
        '?' +
        JSON.stringify({
          // a marker for vue-style-loader to know that this is an import from a vue file
          vue: true,
          id: moduleId,
          scoped: !!scoped,
          hasInlineConfig: !!query.postcss,
        }) +
        '!';
      // normalize scss/sass/postcss if no specific loaders have been provided
      if (!loaders[lang]) {
        if (postcssExtensions.indexOf(lang) !== -1) {
          lang = 'css';
        } else if (lang === 'sass') {
          lang = 'sass?indentedSyntax';
        } else if (lang === 'scss') {
          lang = 'scss';
        }
      }
    }

    let loader = loaders[lang];

    const injectString =
      type === 'script' && query.inject ? 'inject-loader!' : '';

    if (loader != null) {
      if (Array.isArray(loader)) {
        loader = stringifyLoaders(loader);
      } else if (typeof loader === 'object') {
        loader = stringifyLoaders([loader]);
      }
      if (type === 'styles') {
        // add css modules
        loader = addCssModulesToLoader(loader, part, index);
        // inject rewriter before css loader for extractTextPlugin use cases
        if (rewriterInjectRE.test(loader)) {
          loader = loader.replace(
            rewriterInjectRE,
            (m, $1) => ensureBang($1) + styleCompiler
          );
        } else {
          loader = ensureBang(loader) + styleCompiler;
        }
      }
      // if user defines custom loaders for html, add template compiler to it
      if (type === 'template' && loader.indexOf(defaultLoaders.html) < 0) {
        loader = defaultLoaders.html + '!' + loader;
      }
      return injectString + ensureBang(loader);
    } else {
      // unknown lang, infer the loader to be used
      switch (type) {
        case 'template':
          return defaultLoaders.html + '!';
        case 'styles':
          loader = addCssModulesToLoader(defaultLoaders.css, part, index);
          return loader + '!' + styleCompiler + ensureBang(ensureLoader(lang));
        case 'script':
          return injectString + ensureBang(ensureLoader(lang));
        default:
          loader = loaders[type];
          if (Array.isArray(loader)) {
            loader = stringifyLoaders(loader);
          }
          return ensureBang(loader + buildCustomBlockLoaderString(part.attrs));
      }
    }
  }

  // sass => sass-loader
  // sass-loader => sass-loader
  // sass?indentedSyntax!css => sass-loader?indentedSyntax!css-loader
  function ensureLoader(lang) {
    return lang
      .split('!')
      .map(loader =>
        loader.replace(
          /^([\w-]+)(\?.*)?/,
          (_, name, q) =>
            (/-loader$/.test(name) ? name : name + '-loader') + (q || '')
        )
      )
      .join('!');
  }

  function getSelectorString(type: string, index: number) {
    return (
      selectorPath +
      '?type=' +
      (type === 'script' || type === 'template' || type === 'styles'
        ? type
        : 'customBlocks') +
      '&index=' +
      index +
      (bustCache ? '&bustCache' : '') +
      '!'
    );
  }

  function ensureBang(loader) {
    if (loader.charAt(loader.length - 1) !== '!') {
      return loader + '!';
    } else {
      return loader;
    }
  }
}
