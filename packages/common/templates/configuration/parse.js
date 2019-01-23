// @flow
import type { ConfigurationFile } from 'common/templates/configuration/types';
import type { Sandbox } from 'common/types';

import { parse } from 'jsonlint';

type ConfigurationFiles = {
  [path: string]: ConfigurationFile,
};

/**
 * We convert all configuration file configs to an object with configuration per
 * type. This makes configs universal.
 */
export default function parseConfigurations(
  template: string,
  configurationFiles: ConfigurationFiles,
  resolveModule: (path: string) => ?{ code: string },
  sandbox?: Sandbox
) {
  const configurations = {};

  const paths = Object.keys(configurationFiles);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const module = resolveModule(path);
    const configurationFile = configurationFiles[path];

    let baseObject = {
      path,
    };
    let code = null;

    if (module) {
      code = module.code;
    } else if (configurationFile.getDefaultCode) {
      code = configurationFile.getDefaultCode(template, resolveModule);
      baseObject = { ...baseObject, generated: true };
    } else if (sandbox && configurationFile.generateFileFromSandbox) {
      code = configurationFile.generateFileFromSandbox(sandbox);
      baseObject = { ...baseObject, generated: true };
    }

    baseObject = {
      ...baseObject,
      code,
    };

    if (code) {
      try {
        const parsed = parse(code);

        configurations[configurationFile.type] = {
          ...baseObject,
          parsed,
        };
      } catch (e) {
        configurations[configurationFile.type] = {
          ...baseObject,
          error: e,
        };
      }
    }
  }

  return configurations;
}
