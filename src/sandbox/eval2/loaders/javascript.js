// @flow

import type { Sandbox, Module } from 'common/types';
import Loader from './';

export default class JavaScriptLoader extends Loader {
  specifity = 1;

  evaluate = (sandbox: Sandbox, module: Module) => {};
}
