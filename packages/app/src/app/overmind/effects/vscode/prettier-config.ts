import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import { Directory, Module, Sandbox } from '@codesandbox/common/lib/types';
import YAML from 'yamljs';
import toml from 'markty-toml';

// Get the prettier config object looking for all
// the possible sources, in order of precedence:
// https://prettier.io/docs/en/configuration.html
export function getPrettierConfigFromSandbox(sandbox: Sandbox) {
  const { modules } = sandbox;
  return (
    getPrettierFromPackageJson(modules) ||
    getPrettierFromPrettierRC(modules) ||
    getPrettierFromPrettierRCWithExtension(modules) ||
    getPrettierFromModule(modules, sandbox.directories) ||
    getPrettierFromTOML(modules)
  );
}

function getPrettierFromPackageJson(modules: Module[]) {
  const packageJsonFile = modules.find(
    (m) => m.type === 'file' && m.path === '/package.json'
  );

  if (packageJsonFile?.code) {
    const packageJson = JSON.parse(packageJsonFile.code);

    return packageJson?.prettier;
  }

  return null;
}

function lookForFileAndParse(
  modules: Module[],
  fileNames: string[],
  parse: (s: string) => Object
) {
  const foundFile = modules.find(
    (m) => m.type === 'file' && fileNames.includes(m.path)
  );

  if (foundFile?.code) {
    return parse(foundFile.code);
  }

  return null;
}

function getPrettierFromPrettierRC(modules: Module[]) {
  return lookForFileAndParse(modules, ['/.prettierrc'], (code) => {
    try {
      return JSON.parse(code);
    } catch (err) {
      return YAML.parse(code);
    }
  });
}

function getPrettierFromPrettierRCWithExtension(modules: Module[]) {
  const prettierConfig = lookForFileAndParse(
    modules,
    ['/.prettierrc.json', '/.prettierrc.json5'],
    JSON.parse
  );

  if (prettierConfig) {
    return prettierConfig;
  }

  return lookForFileAndParse(
    modules,
    ['/prettier.yml', '/.prettierrc.yaml'],
    YAML.parse
  );
}

function getPrettierFromModule(modules: Module[], directories: Directory[]) {
  [
    '/.prettierrc.js',
    '/.prettierrc.cjs',
    '/prettier.config.js',
    '/prettier.config.cjs',
  ].forEach((path) => {
    try {
      const prettierConfig = resolveModule(path, modules, directories);
      return prettierConfig;
    } catch (err) {
      return null;
    }
  });
}

function getPrettierFromTOML(modules: Module[]) {
  return lookForFileAndParse(modules, ['/.prettierrc.toml'], toml);
}
