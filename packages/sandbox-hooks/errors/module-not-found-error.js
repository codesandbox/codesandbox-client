// @flow

import SandboxError from './sandbox-error';

export default class ModuleNotFoundError extends SandboxError {
  constructor(path: string, isDependency: boolean, currentPath?: string) {
    super();
    this.path = path;
    this.isDependency = isDependency;

    this.name = 'ModuleNotFoundError';
    this.message = `Could not find module in path: '${path}'`;

    if (currentPath) {
      this.message += ` relative to '${currentPath}'`;
    }
  }
  type = 'module-not-found';
  severity = 'error';
  path: string;
  isDependency: boolean;
}
