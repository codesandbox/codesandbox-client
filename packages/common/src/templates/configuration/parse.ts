import toml from 'markty-toml';
import { parse } from '../../forked-vendors/jsonlint.browser';
import { ConfigurationFile } from '../../templates/configuration/types';
import { ParsedConfigurationFiles } from '../template';
import { Sandbox } from '../../types';
import { TemplateType } from '..';

type ConfigurationFiles = {
  [path: string]: ConfigurationFile;
};

type PossibleModule = {
  code: string;
} & (
  | {
      title: string;
    }
  | {
      path: string;
    }
);

function stripJSONComments(jsonString: string) {
  return jsonString.replace(
    /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
    (m, g) => (g ? '' : m)
  );
}

function getCode(
  template: TemplateType,
  module: PossibleModule,
  sandbox: Sandbox,
  resolveModule: (path: string) => PossibleModule | undefined,
  configurationFile: ConfigurationFile
) {
  if (module) {
    return { code: module.code, generated: false };
  }
  if (configurationFile.getDefaultCode) {
    return {
      code: configurationFile.getDefaultCode(template, resolveModule),
      generated: true,
    };
  }
  if (sandbox && configurationFile.generateFileFromSandbox) {
    return {
      code: configurationFile.generateFileFromSandbox(sandbox),
      generated: true,
    };
  }

  return { code: '', generated: false };
}

function titleIncludes(module: PossibleModule, test: string) {
  if ('title' in module) {
    return module.title.includes(test);
  }

  if ('path' in module) {
    return module.path.includes(test);
  }

  return false;
}

/**
 * We convert all configuration file configs to an object with configuration per
 * type. This makes configs universal.
 */
export default function parseConfigurations(
  template: TemplateType,
  configurationFiles: ConfigurationFiles,
  resolveModule: (path: string) => PossibleModule | undefined,
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

    const { code } = baseObject;

    if (code) {
      try {
        let parsed;
        // it goes here three times and the third time it doesn't have a title but a path
        // that took a while ffs
        // if toml do it with toml parser
        if (module && titleIncludes(module, 'toml')) {
          // never throws
          parsed = toml(code);
        } else if (module && titleIncludes(module, 'tsconfig.json')) {
          parsed = parse(stripJSONComments(code));
        } else {
          parsed = parse(code);
        }

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
