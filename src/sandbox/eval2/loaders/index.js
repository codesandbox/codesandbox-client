// @flow
import type { Module, Sandbox } from 'common/types';

export default class Loader {
  evaluate: (sandbox: Sandbox, module: Module) => any;
  test: (sandbox: Sandbox, module: Module) => boolean;
  specifity: 0 | 1 | 2;
  deleteCache: (module: Module) => boolean;
}
