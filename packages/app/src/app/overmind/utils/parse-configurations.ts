import getDefinition from '@codesandbox/common/es/templates';
import parse from '@codesandbox/common/es/templates/configuration/parse';
import { Sandbox } from '@codesandbox/common/es/types';

import { resolveModuleWrapped } from './resolve-module-wrapped';

export function parseConfigurations(sandbox: Sandbox) {
  const templateDefinition = getDefinition(sandbox.template);

  return parse(
    sandbox.template,
    templateDefinition.configurationFiles,
    resolveModuleWrapped(sandbox),
    sandbox
  );
}
