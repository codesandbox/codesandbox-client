import { ParsedConfigurationFiles } from '@codesandbox/common/es/templates/template';

export function getDependenciesFromConfig(
  configurations: ParsedConfigurationFiles
) {
  if (
    configurations &&
    configurations.package &&
    configurations.package.parsed
  ) {
    return {
      ...configurations.package.parsed.devDependencies,
      ...configurations.package.parsed.dependencies,
    };
  }

  return {};
}
