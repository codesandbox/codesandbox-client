import { IFiles, IDependencies } from '../manager';

export function getPackageJSON(
  dependencies: IDependencies = {},
  entry: string = '/index.js'
) {
  return JSON.stringify(
    {
      name: 'sandpack-project',
      main: entry,
      dependencies,
    },
    null,
    2
  );
}

export default function createMissingPackageJSON(
  files: IFiles,
  dependencies?: IDependencies,
  entry?: string
) {
  const newFiles = { ...files };

  if (!newFiles['/package.json']) {
    if (!dependencies) {
      throw new Error(
        'No dependencies specified, please specify either a package.json or provide dependencies.'
      );
    }

    if (!entry) {
      throw new Error(
        "No entry specified, please specify either a package.json with 'main' field or provide entry."
      );
    }

    newFiles['/package.json'] = {
      code: getPackageJSON(dependencies, entry),
    };
  }

  return newFiles;
}
