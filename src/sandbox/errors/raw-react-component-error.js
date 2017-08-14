// @flow
import type { Module } from 'common/types';

import actions, { dispatch } from '../actions';

import SandboxError from './sandbox-error';

export default class RawReactComponentError extends SandboxError {
  constructor(e: Error, mainModule: Module, importedModule: Module) {
    e.name = 'Raw import';
    e.message = `It seems like ${mainModule.title} is importing a raw module (${importedModule.title})`;
    super(e);

    this.payload = {
      importedModuleId: importedModule.id,
    };

    this.suggestions = [
      {
        title: `Rename ${importedModule.title} to ${importedModule.title}.js`,
        action: () => {
          dispatch(
            actions.source.module.rename(
              importedModule.id,
              `${importedModule.title}.js`,
            ),
          );
        },
      },
    ];
    this.module = mainModule;
  }

  type = 'raw-react-component-import';
  severity = 'error';
}
