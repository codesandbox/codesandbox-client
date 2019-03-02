// @flow
import type { Sandbox } from 'common/types';

import getDefinition from 'common/templates';
import parse from 'common/templates/configuration/parse';
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
