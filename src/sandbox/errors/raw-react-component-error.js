// @flow
import type { Module } from 'common/types';

import SandboxError from './sandbox-error';

export default class RawReactComponentError extends SandboxError {
  constructor(mainModule: Module, importedModule: Module) {
    super();

    this.payload = {
      importedModuleId: importedModule.id,
    };
    this.module = mainModule;
  }

  type = 'raw-react-component-import';
  severity = 'error';
  hideLine = true;
}
