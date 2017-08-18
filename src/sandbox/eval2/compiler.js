// @flow
import type { Module, Directory, Sandbox } from 'common/types';
import resolveModule from 'common/sandbox/resolve-module';

export default class Compiler {
  sandbox: Sandbox;

  cachedModules: {
    [id: string]: Module,
  };

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;

    this.cachedModules = {};
  }

  getModule(path: string, directoryShortid?: string): ?Module {
    return resolveModule(
      path,
      this.getModules(),
      this.getDirectories(),
      directoryShortid,
    );
  }

  getModules(): Array<Module> {
    return this.sandbox.modules;
  }

  getDirectories(): Array<Directory> {
    return this.sandbox.directories;
  }
}
