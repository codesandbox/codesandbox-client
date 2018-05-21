// @flow
import ReasonWorker from 'worker-loader?publicPath=/&name=reason-transpiler.[hash:8].worker.js!./worker';

import { basename } from 'path';
import stripANSI from 'strip-ansi';

import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';
import type { Module } from '../../entities/module';

type ReasonModule = Module & {
  moduleName: string,
};

function addScript(src) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);

    s.onload = () => {
      resolve();
    };
  });
}

const IGNORED_DEPENDENCIES = ['ReactDOMRe', 'ReasonReact'];

function getModuleName(path: string) {
  const moduleParts = basename(path).split('.');
  moduleParts.pop();

  const unCapitalizedModuleName = moduleParts.join('.');
  return (
    unCapitalizedModuleName[0].toUpperCase() + unCapitalizedModuleName.slice(1)
  );
}

function getDependencyList(
  modules: Array<ReasonModule>,
  list: Set<ReasonModule>,
  module: ReasonModule
) {
  const listFunction = module.path.endsWith('.re')
    ? window.ocaml.reason_list_dependencies
    : window.ocaml.list_dependencies;

  const deps = listFunction(module.code)
    .filter(x => IGNORED_DEPENDENCIES.indexOf(x) === -1)
    .filter(x => !list.has(x));

  deps.shift(); // Remove the first 0 value

  deps.forEach(dep => {
    const foundModule = modules.find(x => x.moduleName === dep);

    if (foundModule) {
      getDependencyList(modules, list, foundModule);
    }
  });

  list.add(module);
}

class ReasonTranspiler extends Transpiler {
  worker: Worker;

  constructor() {
    super('reason-loader', ReasonWorker, 1, { hasFS: true });
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<{ transpiledCode: string }> {
    if (!window.ocaml) {
      await addScript(
        'https://cdn.rawgit.com/jaredly/docre/73fb3c05/static/bs-3.0.0.js'
      );
      await addScript('https://reason.surge.sh/bucklescript-deps.js');
      await addScript('https://unpkg.com/reason@3.1.0/refmt.js');
    }

    const reasonModules = loaderContext
      .getModules()
      .filter(x => x.path.endsWith('.re') || x.path.endsWith('.ml'))
      .map(x => ({
        ...x,
        moduleName: getModuleName(x.path),
      }));

    const mainReasonModule: ReasonModule = reasonModules.find(
      m => m.path === loaderContext._module.module.path
    );

    const modulesToAdd: Set<ReasonModule> = new Set();

    getDependencyList(reasonModules, modulesToAdd, mainReasonModule);

    modulesToAdd.forEach(m => {
      if (m.path !== loaderContext._module.module.path) {
        loaderContext.addTranspilationDependency(m.path, {});
      }
    });

    const newCode = Array.from(modulesToAdd)
      .map(x => {
        const usedCode = x.path.endsWith('.re')
          ? x.code
          : window.printRE(window.parseML(x.code));

        const moduleName = x.moduleName;

        return `module ${moduleName} = {
#1 ${moduleName}
${usedCode}
};`;
      })
      .join('\n\n');

    const {
      js_code,
      js_error_msg,
      row,
      column,
      text,
    } = window.ocaml.reason_compile_super_errors(newCode);

    if (js_error_msg) {
      const error = new Error(stripANSI(text));
      error.name = 'Reason Compile Error';
      error.fileName = loaderContext._module.module.path;
      error.lineNumber = row + 1;
      error.columnNumber = column;
      return Promise.reject(error);
    } else {
      return Promise.resolve({
        transpiledCode: js_code,
      });
    }
  }
}

const transpiler = new ReasonTranspiler();

export { ReasonTranspiler };

export default transpiler;
