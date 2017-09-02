import transpile from 'vue-template-es2015-compiler';
const compiler = require('vue-template-compiler');

import { type LoaderContext } from '../../../transpiled-module';

import transformRequire from './modules/transform-require';

export default function(html: string, loaderContext: LoaderContext) {
  var options = loaderContext.options;

  var defaultModules = [
    transformRequire(options.transformToRequire, loaderContext),
  ];

  var compilerOptions = {
    preserveWhitespace: options.preserveWhitespace,
    modules: defaultModules,
    scopeId: options.hasScoped ? options.id : null,
  };

  var compiled = compiler.compile(html, compilerOptions);

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      this.emitWarning(tip);
    });
  }

  var code;
  if (compiled.errors && compiled.errors.length) {
    loaderContext.emitError(
      new Error(
        `\n  Error compiling template:\n${pad(html)}\n` +
          compiled.errors.map(e => `  - ${e}`).join('\n') +
          '\n'
      )
    );
    code = 'module.exports={render:function(){},staticRenderFns:[]}';
  } else {
    var bubleOptions = options.buble;
    code = transpile(
      'module.exports={' +
        'render:' +
        toFunction(compiled.render) +
        ',' +
        'staticRenderFns: [' +
        compiled.staticRenderFns.map(toFunction).join(',') +
        ']' +
        '}',
      bubleOptions
    );
    // mark with stripped (this enables Vue to use correct runtime proxy detection)
    if (
      !bubleOptions ||
      !bubleOptions.transforms ||
      bubleOptions.transforms.stripWith !== false
    ) {
      code += `\nmodule.exports.render._withStripped = true`;
    }
  }
  // // hot-reload
  // if (!isServer && !isProduction) {
  //   code +=
  //     '\nif (module.hot) {\n' +
  //     '  module.hot.accept()\n' +
  //     '  if (module.hot.data) {\n' +
  //     '     require("' +
  //     hotReloadAPIPath +
  //     '").rerender("' +
  //     options.id +
  //     '", module.exports)\n' +
  //     '  }\n' +
  //     '}';
  // }

  return code;
}

function toFunction(code) {
  return 'function (){' + code + '}';
}

function pad(html) {
  return html
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n');
}
