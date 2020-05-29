import getDefinition from '@codesandbox/common/es/templates';
import { Sandbox } from '@codesandbox/common/es/types';

import { resolveModuleWrapped } from './resolve-module-wrapped';

export function mainModule(sandbox: Sandbox, parsedConfigurations: any) {
  const templateDefinition = getDefinition(sandbox.template);

  const resolve = resolveModuleWrapped(sandbox);

  const module = templateDefinition
    .getEntries(parsedConfigurations)
    .map(p => resolve(p))
    .find(m => Boolean(m));

  return module || sandbox.modules[0];
}

export function defaultOpenedModule(
  sandbox: Sandbox,
  parsedConfigurations: any
) {
  const templateDefinition = getDefinition(sandbox.template);

  const resolve = resolveModuleWrapped(sandbox);

  const module = templateDefinition
    .getDefaultOpenedFiles(parsedConfigurations)
    .map(p => resolve(p))
    .find(m => Boolean(m));

  return module || sandbox.modules[0];
}
