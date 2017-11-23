// @flow

import SandboxError from './sandbox-error';

export default class ModuleNotFoundError extends SandboxError {
  constructor(path: string, isDependency: boolean) {
    super();
    this.path = path;
    this.isDependency = isDependency;

    this.name = 'ModuleNotFoundError';
    this.message = `Could not find module in path: '${path}'`;
  }
  type = 'module-not-found';
  severity = 'error';
  path: string;
  isDependency: boolean;
}
