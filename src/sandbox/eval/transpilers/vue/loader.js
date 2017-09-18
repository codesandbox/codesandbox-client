// @flow

import type { LoaderContext } from '../../transpiled-module';

import genId from './utils/gen-id';
import parse from './parser';
import componentNormalizerRaw from '!raw-loader!./component-normalizer';

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
  let loader = `!style-loader!vue-style-compiler?${JSON.stringify({
    id,
    scoped: !!scoped,
  })}`;

  if (attrs.module) {
    loader += `?${JSON.stringify({ module: true })}`;
  }

  if (attrs.lang === 'scss') loader += '!sass-loader';
  if (attrs.lang === 'sass') loader += '!sass-loader';
  if (attrs.lang === 'styl' || attrs.lang === 'stylus')
    loader += '!stylus-loader';
  if (attrs.lang === 'less') loader += '!less-loader';

  return loader;
};

const getScriptFileName = attrs => {
  if (attrs.lang === 'js') return 'js';
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
  const moduleTitle = _module.module.title;

  let output = '';
  const moduleId = 'data-v-' + genId(path, options.context, options.hashKey);
  const parts = parse(code, _module.module.title, false);
  const hasScoped = parts.styles.some(s => s.scoped);

  var templateOptions =
    '?' +
    JSON.stringify({
      id: moduleId,
      hasScoped,
      transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href',
      },
      preserveWhitespace: false,
      buble: null,
      // // only pass compilerModules if it's a path string
      // compilerModules:
      //   typeof options.compilerModules === 'string'
      //     ? options.compilerModules
      //     : undefined,
    });

  var cssModules;
  if (parts.styles.length) {
    let styleInjectionCode = 'function injectStyle (ssrContext) {\n';
    parts.styles.forEach(function(style, i) {
      // require style
      const requireLocation = style.src
        ? getRequireForImport('style', style, i, style.scoped)
        : getRequire('style', style, i, style.scoped);

      const requireString = `require('${requireLocation}')`;

      const invokeStyle = c => `  ${c}\n`;

      var moduleName = style.module === true ? '$style' : style.module;
      // setCssModule
      if (moduleName) {
        if (!cssModules) {
          cssModules = {};
        }
        if (moduleName in cssModules) {
          loaderContext.emitError(
            'CSS module name "' + moduleName + '" is not unique!'
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
    componentNormalizerRaw
  );

  output +=
    "var Component = require('!noop-loader!component-normalizer.js')(\n";
  // <script>
  output += '  /* script */\n  ';
  var script = parts.script;
  if (script) {
    const file = script.src
      ? getRequireForImport('script', script)
      : getRequire('script', script);

    output += `require('${file}')`;
  } else {
    output += 'null';
  }
  output += ',\n';

  // <template>
  output += '  /* template */\n  ';
  var template = parts.template;
  if (template) {
    const file = template.src
      ? getRequireForImport('template', template)
      : getTemplateRequire(templateOptions, template);

    output += `require('${file}')`;
  } else {
    output += 'null';
  }

  output += ',\n';

  // style
  output += '  /* styles */\n  ';
  output += (parts.styles.length ? 'injectStyle' : 'null') + ',\n';

  // scopeId
  output += '  /* scopeId */\n  ';
  output += (hasScoped ? JSON.stringify(moduleId) : 'null') + ',\n';

  // close normalizeComponent call
  output += ')\n';

  // add filename in dev
  output += 'Component.options.__file = ' + JSON.stringify(path) + '\n';
  // check named exports
  output +=
    'if (Component.esModule && Object.keys(Component.esModule).some(function (key) {' +
    'return key !== "default" && key.substr(0, 2) !== "__"' +
    '})) {' +
    'console.error("named exports are not supported in *.vue files.")' +
    '}\n';
  // check functional components used with templates
  if (template) {
    output +=
      'if (Component.options.functional) {' +
      'console.error("' +
      '[vue-loader] ' +
      _module.module.title +
      ': functional components are not ' +
      'supported with templates, they should use render functions.' +
      '")}\n';
  }

  output += `module.exports = Component.esModule;\n`;

  // IVES: Implement custom blocks later?

  // // add requires for customBlocks
  // if (parts.customBlocks && parts.customBlocks.length) {
  //   var addedPrefix = false;

  //   parts.customBlocks.forEach(function(customBlock, i) {
  //     if (loaders[customBlock.type]) {
  //       // require customBlock
  //       customBlock.src = customBlock.attrs.src;
  //       var requireString = customBlock.src
  //         ? getRequireForImport(customBlock.type, customBlock)
  //         : getRequire(customBlock.type, customBlock, i);

  //       if (!addedPrefix) {
  //         output += '\n/* customBlocks */\n';
  //         addedPrefix = true;
  //       }

  //       output +=
  //         'var customBlock = ' +
  //         requireString +
  //         '\n' +
  //         'if (typeof customBlock === "function") {' +
  //         'customBlock(Component)' +
  //         '}\n';
  //     }
  //   });

  //   output += '\n';
  // }

  return output;

  function getTemplateRequire(templateCompilerOptions, impt) {
    const tModule = loaderContext.emitModule(
      `!vue-template-compiler${templateCompilerOptions}!${moduleTitle}:template.vue.${getTemplateFileName(
        impt.attrs
      )}`,
      impt.content
    );

    return `${tModule.query}!./${tModule.module.title}`;
  }

  function getRequireForImport(type, impt, i = 0, scoped) {
    if (type === 'style') {
      const styleCompiler = `!!${getStyleLoaders(
        impt.attrs,
        moduleId,
        !!scoped
      )}!${impt.src}`;

      const tModule = loaderContext.addDependency(styleCompiler);

      return `${tModule.query}!./${tModule.module.title}`;
    } else if (type === 'script' || type === 'template') {
      const tModule = loaderContext.addDependency(impt.src);

      return `./${tModule.module.title}`;
    }
    return '';
  }

  function getRequire(type, impt, i = 0, scoped) {
    if (type === 'style') {
      const styleCompiler = `!!${getStyleLoaders(
        impt.attrs,
        moduleId,
        !!scoped
      )}!${moduleTitle}:style-${i}.vue.${getStyleFileName(impt.attrs)}`;

      const tModule = loaderContext.emitModule(styleCompiler, impt.content);

      return `${tModule.query}!./${tModule.module.title}`;
    } else if (type === 'script') {
      const tModule = loaderContext.emitModule(
        `${moduleTitle}:script.${getScriptFileName(impt.attrs)}`,
        impt.content
      );

      return `./${tModule.module.title}`;
    }
    return '';
  }
}
