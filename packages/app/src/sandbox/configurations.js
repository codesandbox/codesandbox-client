// @flow
import type { ConfigurationFile } from 'common/templates/configuration/types';
import type { Module } from './eval/entities/module';

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
      try {
        const parsed = JSON.parse(code);

        configurations[configurationFile.type] = parsed;
      } catch (e) {
        throw new Error(`Could not parse config file '${path}': ${e.message}`);
      }
    }
  }

  return configurations;
}
