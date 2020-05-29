import { getModulePath } from '@codesandbox/common/es/sandbox/modules';
import getDefinition from '@codesandbox/common/es/templates';
import { Sandbox } from '@codesandbox/common/es/types';

import { resolveModuleWrapped } from './resolve-module-wrapped';

export const getModuleCode = (sandbox: Sandbox, prettierConfig: unknown) => {
  const path = getModulePath(sandbox.modules, sandbox.directories, module.id);
  const template = getDefinition(sandbox.template);
  const config = template.configurationFiles[path];

  if (
    config &&
    (config.generateFileFromSandbox ||
      config.getDefaultCode ||
      config.generateFileFromState)
  ) {
    if (config.generateFileFromState) {
      return config.generateFileFromState(prettierConfig);
    }
    if (config.generateFileFromSandbox) {
      return config.generateFileFromSandbox(sandbox);
    }
    if (config.getDefaultCode) {
      const resolveModule = resolveModuleWrapped(sandbox);

      return config.getDefaultCode(sandbox.template, resolveModule);
    }
  }

  return '';
};
