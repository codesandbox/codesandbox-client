// @flow
import ReasonWorker from 'worker-loader?publicPath=/&name=reason-transpiler.[hash:8].worker.js!./worker';

import { basename } from 'path';
import { sortBy } from 'lodash';

import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

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
        'https://cdn.rawgit.com/jaredly/docre/70303ec3/static/bs-3.0.0.js'
      );
      await addScript('https://reason.surge.sh/bucklescript-deps.js');
    }

    const modulesToAdd = [
      ...sortBy(
        loaderContext
          .getModules()
          .filter(x => x.path !== loaderContext.path)
          .filter(x => x.path.endsWith('.re')),
        'path'
      ),
      loaderContext._module.module,
    ];

    modulesToAdd
      .filter(x => x.path !== loaderContext._module.module.path)
      .forEach(m => {
        loaderContext.addTranspilationDependency(m.path, {});
      });

    const newCode = modulesToAdd
      .map(x => {
        const moduleParts = basename(x.path).split('.');
        moduleParts.pop();

        const unCapitalizedModuleName = moduleParts.join('.');
        const moduleName =
          unCapitalizedModuleName[0].toUpperCase() +
          unCapitalizedModuleName.slice(1);

        return `module ${moduleName} = {
#1 ${moduleName}
${x.code}
};`;
      })
      .join('\n\n');

    console.log(newCode);

    const { js_code, js_error_msg } = window.ocaml.reason_compile_super_errors(
      newCode
    );

    if (js_error_msg) {
      return Promise.reject(js_error_msg);
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
