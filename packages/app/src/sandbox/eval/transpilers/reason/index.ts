import { basename, dirname, join } from 'path';
import stripANSI from 'strip-ansi';

import { LoaderContext, Transpiler } from 'sandpack-core';
import { Module } from 'sandpack-core/lib/types/module';

type ReasonModule = Module & {
  moduleName: string;
};

function addScript(src) {
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);

    s.onload = () => {
      resolve(undefined);
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

const cachedDependencies = new Map();
const global = window as any;

function getDependencyList(
  modules: Array<ReasonModule>,
  list: Set<ReasonModule>,
  module: ReasonModule
) {
  const cache = cachedDependencies.get(module.path);

  const listFunction = module.path.endsWith('.re')
    ? global.ocaml.reason_list_dependencies
    : global.ocaml.list_dependencies;

  const deps =
    cache ||
    listFunction(module.code)
      .filter(x => IGNORED_DEPENDENCIES.indexOf(x) === -1)
      .filter(x => !list.has(x));

  if (!cache) {
    // Didn't get it from the cache
    deps.shift(); // Remove the first 0 value
  }

  if (module.path.startsWith('/node_modules')) {
    cachedDependencies.set(module.path, deps);
  }

  deps.forEach(dep => {
    const foundModule = modules.find(
      x => x.moduleName === dep && !x.path.endsWith('.rei')
    );

    if (foundModule) {
      getDependencyList(modules, list, foundModule);
    }
  });

  list.add(module);
}

class ReasonTranspiler extends Transpiler {
  constructor() {
    super('reason-loader');
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<{ transpiledCode: string }> {
    if (!global.ocaml) {
      await addScript(
        'https://cdn.jsdelivr.net/gh/jaredly/reason-react@more-docs/docs/bucklescript.js'
      );
      await addScript('https://reason.surge.sh/bucklescript-deps.js');
      await addScript('https://unpkg.com/reason@3.3.4/refmt.js');
    }

    const reasonModules = loaderContext
      .getModules()
      .filter(
        x =>
          x.path.endsWith('.re') ||
          x.path.endsWith('.rei') ||
          x.path.endsWith('.ml')
      )
      .map(x => ({
        ...x,
        moduleName: getModuleName(x.path),
      }));

    const mainReasonModule: ReasonModule = reasonModules.find(
      m => m.path === loaderContext._module.module.path
    );

    const modulesToAdd: Set<ReasonModule> = new Set();
    getDependencyList(reasonModules, modulesToAdd, mainReasonModule);

    const modulesToAddArr = Array.from(modulesToAdd);

    await Promise.all(
      modulesToAddArr.map(async m => {
        if (m.path !== loaderContext._module.module.path) {
          await loaderContext.addTranspilationDependency(m.path, {});
        }
      })
    );

    const newCode = modulesToAddArr
      .map(x => {
        const usedCode = x.path.endsWith('.re')
          ? x.code
          : global.printRE(global.parseML(x.code));

        const { moduleName } = x;

        const typesPath = join(
          dirname(x.path),
          basename(x.path, '.re') + '.rei'
        );

        const typesModule = reasonModules.find(
          module => module.path === typesPath
        );

        let reasonCode = `module ${moduleName}`;

        if (typesModule) {
          reasonCode += `: {\n${typesModule.code}\n}`;
        }

        reasonCode += ` = {
#1 ${moduleName}
${usedCode}
};`;

        return reasonCode;
      })
      .join('\n\n');

    const {
      // eslint-disable-next-line camelcase
      js_code,
      js_error_msg: errorMessage,
      row,
      column,
      text,
    } = global.ocaml.reason_compile_super_errors(newCode);

    if (errorMessage) {
      const error = new Error(stripANSI(text));

      error.name = 'Reason Compile Error';
      // @ts-ignore
      error.fileName = loaderContext._module.module.path;
      // @ts-ignore
      error.lineNumber = row + 1;
      // @ts-ignore
      error.columnNumber = column;

      throw error;
    }

    return {
      transpiledCode: js_code,
    };
  }
}

const transpiler = new ReasonTranspiler();

export { ReasonTranspiler };

export default transpiler;
