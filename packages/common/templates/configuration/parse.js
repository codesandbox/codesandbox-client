// @flow
import type { ConfigurationFile } from 'common/templates/configuration/types';

type Module = {
  path: string,
  code: string,
};

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
  modules: { [path: string]: Module }
) {
  const configurations = {};

  const paths = Object.keys(configurationFiles);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const module = modules[path];
    const configurationFile = configurationFiles[path];

    let code = null;

    if (module) {
      code = module.code;
    } else if (configurationFile.getDefaultCode) {
      code = configurationFile.getDefaultCode(template);
    }

    if (code) {
      const baseObject = {
        code,
        path,
      };
      try {
        const parsed = JSON.parse(code);

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
