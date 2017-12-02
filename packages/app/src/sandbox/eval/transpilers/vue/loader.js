// @flow
/* eslint-disable import/no-webpack-loader-syntax, prefer-template, no-use-before-define */
import { basename, dirname } from 'common/utils/path';

import componentNormalizerRaw from '!raw-loader!./component-normalizer';
import type { LoaderContext } from '../../transpiled-module';

import genId from './utils/gen-id';
import parse from './parser';

const getStyleFileName = attrs => {
  let extension = 'css';

  if (attrs.lang === 'scss') extension = 'scss';
  if (attrs.lang === 'sass') extension = 'sass';
  if (attrs.lang === 'styl') extension = 'styl';
  if (attrs.lang === 'stylus') extension = 'styl';
  if (attrs.lang === 'less') extension = 'less';

  return attrs.module ? `module.${extension}` : extension;
};

const getStyleLoaders = (attrs, id, scoped) => {
  let loader = `!style-loader`;

  if (attrs.module) {
    loader += `?${JSON.stringify({ module: true })}`;
  }

  loader += `!vue-style-compiler?${JSON.stringify({
    id,
    scoped: !!scoped,
  })}`;

  if (attrs.lang === 'scss') loader += '!sass-loader';
  if (attrs.lang === 'sass') loader += '!sass-loader';
  if (attrs.lang === 'styl' || attrs.lang === 'stylus')
    loader += '!stylus-loader';
  if (attrs.lang === 'less') loader += '!less-loader';

  return loader;
};

const getScriptFileName = attrs => {
  if (attrs.lang === 'js') return 'js';
  if (attrs.lang === 'ts') return 'ts';
  if (attrs.lang === 'typescript') return 'ts';

  return 'js';
};

const getTemplateFileName = attrs => {
  if (attrs.lang === 'pug') return 'pug';
  if (attrs.lang === 'jade') return 'jade';

  return 'html';
};

export default function(code: string, loaderContext: LoaderContext) {
  const { path, options, _module } = loaderContext;
  const moduleTitle = basename(_module.module.path);

  const sourceRoot = dirname(path);
  const moduleId = 'data-v-' + genId(path, options.context, options.hashKey);

  let output = '';
  const parts = parse(code, moduleTitle, false, sourceRoot);
  const hasScoped = parts.styles.some(s => s.scoped);
  const templateAttrs =
    parts.template && parts.template.attrs && parts.template.attrs;
  const hasComment = templateAttrs && templateAttrs.comments;
  const functionalTemplate = templateAttrs && templateAttrs.functional;
  const bubleTemplateOptions = Object.assign({}, options.buble);
  bubleTemplateOptions.transforms = Object.assign(
    {},
    bubleTemplateOptions.transforms
  );
  bubleTemplateOptions.transforms.stripWithFunctional = functionalTemplate;

  const templateOptions =
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

  let cssModules;
  if (parts.styles.length) {
    let styleInjectionCode = 'function injectStyle (ssrContext) {\n';
    parts.styles.forEach((style, i) => {
      // require style
      const requireLocation = style.src
        ? getRequireForImport('style', style, i, style.scoped)
        : getRequire('style', style, i, style.scoped);

      const requireString = `require('${requireLocation}')`;

      const invokeStyle = c => `  ${c}\n`;

      const moduleName = style.module === true ? '$style' : style.module;
      // setCssModule
      if (moduleName) {
        if (!cssModules) {
          cssModules = {};
        }
        if (moduleName in cssModules) {
          loaderContext.emitError(
            new Error('CSS module name "' + moduleName + '" is not unique!')
          );
          styleInjectionCode += invokeStyle(requireLocation);
        } else {
          styleInjectionCode += invokeStyle(
            'this["' + moduleName + '"] = ' + requireString
          );
        }
      } else {
        styleInjectionCode += invokeStyle(`require('${requireLocation}')`);
      }
    });
    styleInjectionCode += '}\n';
    output += styleInjectionCode;
  }

  loaderContext.emitModule(
    // No extension, so no transpilation !noop
    '!noop-loader!component-normalizer.js',
    componentNormalizerRaw,
    '/'
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
    "var normalizeComponent = require('!noop-loader!@/component-normalizer.js')\n";
  // <script>
  output += '  /* script */\n  ';
  const script = parts.script;
  if (script) {
    const file = script.src
      ? getRequireForImport('script', script)
      : getRequire('script', script);

    output += `var __vue_script__ = require('${file}')\n`;
  } else {
    output += 'var __vue_script__ = null\n';
  }

  // <template>
  output += '  /* template */\n  ';
  const template = parts.template;
  if (template) {
    const file = template.src
      ? getRequireForImport('template', template)
      : getTemplateRequire(templateOptions, template);

    output += `var __vue_template__ = require('${file}')\n`;
  } else {
    output += 'var __vue_template__ = null\n';
  }

  // template functional
  output += '/* template functional */\n  ';
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
  // check named exports
  output +=
    'if (Component.esModule && Object.keys(Component.esModule).some(function (key) {' +
    'return key !== "default" && key.substr(0, 2) !== "__"' +
    '})) {' +
    'console.error("named exports are not supported in *.vue files.")' +
    '}\n';

  output += `module.exports = Component.exports;\n`;

  return output;

  function getTemplateRequire(templateCompilerOptions, impt) {
    const tModule = loaderContext.emitModule(
      `!vue-template-compiler${templateCompilerOptions}!${
        moduleTitle
      }:template.vue.${getTemplateFileName(impt.attrs)}`,
      impt.content
    );

    return `${tModule.query}!./${basename(tModule.module.path)}`;
  }

  function getRequireForImport(type, impt, i = 0, scoped) {
    if (type === 'style') {
      const styleCompiler = `${getStyleLoaders(
        impt.attrs,
        moduleId,
        !!scoped
      )}!${impt.src}`;

      const tModule = loaderContext.addDependency(styleCompiler);

      return `${tModule.query}!./${basename(tModule.module.path)}`;
    } else if (type === 'script' || type === 'template') {
      const tModule = loaderContext.addDependency(impt.src);

      return `./${basename(tModule.module.path)}`;
    }
    return '';
  }

  function getRequire(type, impt, i = 0, scoped) {
    if (type === 'style') {
      const styleCompiler = `${getStyleLoaders(
        impt.attrs,
        moduleId,
        !!scoped
      )}!${moduleTitle}:style-${i}.vue.${getStyleFileName(impt.attrs)}`;

      const tModule = loaderContext.emitModule(styleCompiler, impt.content);

      return `${tModule.query}!./${basename(tModule.module.path)}`;
    } else if (type === 'script') {
      const tModule = loaderContext.emitModule(
        `${moduleTitle}:script.${getScriptFileName(impt.attrs)}`,
        impt.content
      );

      return `./${basename(tModule.module.path)}`;
    }
    return '';
  }
}
