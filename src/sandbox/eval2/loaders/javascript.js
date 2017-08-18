// @flow

import type { Sandbox } from 'common/types';
import type { TranspiledModule } from '../presets';
import LoaderManager from '../presets';

import Loader from './';

/* eslint-disable no-unused-vars */
const evaluate = (code: string, require: Function) => {
  const module = { exports: {} };
  const exports = {};
  const global = window;
  const process = { env: { NODE_ENV: 'development' } };

  try {
    eval(code); // eslint-disable-line no-eval

    // Choose either the export of __esModule or node
    return Object.keys(exports).length > 0 ? exports : module.exports;
  } catch (e) {
    e.isEvalError = true;

    throw e;
  }
};
/* eslint-enable no-unused-vars */

export default class JavaScriptLoader extends Loader {
  specifity = 1;

  evaluate = (
    sandbox: Sandbox,
    module: TranspiledModule,
    manager: LoaderManager,
  ) => {};
}
