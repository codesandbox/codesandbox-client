// @flow
import type { Sandbox } from 'common/libtypes';

import getDefinition from 'common/libtemplates';
import parse from 'common/libtemplates/configuration/parse';
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
