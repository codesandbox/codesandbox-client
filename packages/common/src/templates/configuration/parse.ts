// @flow
import { ConfigurationFile } from '../../templates/configuration/types';

import { parse } from 'jsonlint';
import { ParsedConfigurationFiles } from '../template';
import { Sandbox, Module } from '../../types';
import { TemplateType } from '..';

type ConfigurationFiles = {
  [path: string]: ConfigurationFile;
};

function getCode(
  template: TemplateType,
  module: Module,
  sandbox: Sandbox,
  resolveModule: (path: string) => { code: string } | undefined,
  configurationFile: ConfigurationFile
) {
  if (module) {
    return { code: module.code, generated: false };
  } else if (configurationFile.getDefaultCode) {
    return {
      code: configurationFile.getDefaultCode(template, resolveModule),
      generated: true,
    };
  } else if (sandbox && configurationFile.generateFileFromSandbox) {
    return {
      code: configurationFile.generateFileFromSandbox(sandbox),
      generated: true,
    };
  }

  return { code: '', generated: false };
}

/**
 * We convert all configuration file configs to an object with configuration per
 * type. This makes configs universal.
 */
export default function parseConfigurations(
  template: TemplateType,
  configurationFiles: ConfigurationFiles,
  resolveModule: (path: string) => Module | undefined,
  sandbox?: Sandbox
): ParsedConfigurationFiles {
  const configurations: ParsedConfigurationFiles = {};

  const paths = Object.keys(configurationFiles);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const module = resolveModule(path);
    const configurationFile = configurationFiles[path];

    const baseObject = {
      path,
      ...getCode(template, module, sandbox, resolveModule, configurationFile),
    };
    const code = baseObject.code;

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
