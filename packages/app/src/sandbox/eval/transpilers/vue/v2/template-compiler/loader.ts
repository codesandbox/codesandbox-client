/* eslint-disable no-use-before-define */
import transpile from 'vue-template-es2015-compiler';
import * as compiler from 'vue-template-compiler';
// @ts-ignore
import { LoaderContext } from 'sandpack-core';
// @ts-ignore
import vueHotReloadAPIRaw from '!raw-loader!vue-hot-reload-api';

// eslint-disable-next-line
import transformRequire from './modules/transform-require';
import transformSrcset from './modules/transform-srcset';

const hotReloadAPIPath = '!noop-loader!/node_modules/vue-hot-reload-api.js';
export default async function (
  html: string,
  loaderContext: LoaderContext
): Promise<string> {
  loaderContext.emitModule(
    hotReloadAPIPath,
    vueHotReloadAPIRaw,
    '/',
    false,
    false
  );

  const { options } = loaderContext;
  const vueOptions = options.vueOptions || {};
  const needsHotReload = true;

  const depPromises = [];
  const addDependency = (p: string) => {
    depPromises.push(loaderContext.addDependency(p));
  };

  const defaultModules = [
    transformRequire(options.transformRequire, addDependency),
    transformSrcset(),
  ];
  const userModules = vueOptions.compilerModules || options.compilerModules;

  const compilerOptions: compiler.CompilerOptionsWithSourceRange = {
    preserveWhitespace: options.preserveWhitespace,
    modules: defaultModules.concat(userModules || []),
    directives:
      vueOptions.compilerDirectives || options.compilerDirectives || {},
    // @ts-ignore
    comments: options.hasComment,
    // @ts-ignore
    scopeId: options.hasScoped ? options.id : null,
  };

  const compiled = compiler.compile(html, compilerOptions);

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      loaderContext.emitWarning({
        name: 'vue-warning',
        message: typeof tip === 'string' ? tip : '',
        fileName: loaderContext._module.module.parent
          ? loaderContext._module.module.parent.path
          : loaderContext.path,
        lineNumber: 1,
        columnNumber: 1,
        source: 'vue-template-compiler',
      });
    });
  }

  let code;
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
    const bubleOptions = options.buble;
    const stripWith = bubleOptions.transforms.stripWith !== false;
    const { stripWithFunctional } = bubleOptions.transforms;

    const staticRenderFns = compiled.staticRenderFns.map(fn =>
      toFunction(fn, stripWithFunctional)
    );

    code =
      transpile(
        'var render = ' +
          toFunction(compiled.render, stripWithFunctional) +
          '\n' +
          'var staticRenderFns = [' +
          staticRenderFns.join(',') +
          ']',
        bubleOptions
      ) + '\n';
    // mark with stripped (this enables Vue to use correct runtime proxy detection)
    if (stripWith) {
      code += `render._withStripped = true\n`;
    }

    const exports = `{ render: render, staticRenderFns: staticRenderFns }`;
    code += `module.exports = ${exports}`;
  }

  // hot-reload
  if (needsHotReload) {
    const exportsName = vueOptions.esModule ? 'esExports' : 'module.exports';
    code +=
      '\nif (module.hot) {\n' +
      '  module.hot.accept()\n' +
      '  if (module.hot.data) {\n' +
      '    require("' +
      hotReloadAPIPath +
      '")' +
      '      .rerender("' +
      options.id +
      '", ' +
      exportsName +
      ')\n' +
      '  }\n' +
      '}';
  }

  await Promise.all(depPromises);

  return code;
}

function toFunction(code, stripWithFunctional) {
  return (
    'function (' + (stripWithFunctional ? '_h,_vm' : '') + ') {' + code + '}'
  );
}

function pad(html) {
  return html
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n');
}
