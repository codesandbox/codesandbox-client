import { ILambdaResponse } from './merge-dependency';
import { downloadDependency } from '../eval/npm/fetch-npm-module';

function getPackageJSON(dep: string, version: string) {
  return downloadDependency(dep, version, '/package.json').then(m => m.code);
}

function getLatestVersionForSemver(dep: string, version: string) {
  return getPackageJSON(dep, version).then(p => JSON.parse(p).version);
}

interface IPeerDependencyResult {
  [dep: string]: {
    semver: string;
    resolved: string;
    parents: string[];
    entries: string[];
  };
}

async function getDependencyDependencies(
  dep: string,
  version: string,
  peerDependencyResult: IPeerDependencyResult = {}
): Promise<IPeerDependencyResult> {
  const packageJSONCode = await getPackageJSON(dep, version);
  const packageJSON = JSON.parse(packageJSONCode);

  await Promise.all(
    Object.keys(packageJSON.dependencies || {}).map(async (depName: string) => {
      const depVersion = packageJSON.dependencies[depName];

      if (peerDependencyResult[depName]) {
        peerDependencyResult[depName].parents.push(dep);
        return;
      }

      const absoluteVersion = await getLatestVersionForSemver(
        depName,
        depVersion
      );

      // eslint-disable-next-line
      peerDependencyResult[depName] = {
        semver: depVersion,
        resolved: absoluteVersion,
        parents: [dep],
        entries: [],
      };

      await getDependencyDependencies(
        depName,
        depVersion,
        peerDependencyResult
      );
    })
  );

  return peerDependencyResult;
}

export async function resolveDependencyInfo(dep: string, version: string) {
  const packageJSONCode = await getPackageJSON(dep, version);
  const packageJSON = JSON.parse(packageJSONCode);
  const response: ILambdaResponse = {
    contents: {},
    dependency: {
      name: dep,
      version: packageJSON.version,
    },
    peerDependencies: {},
    dependencyDependencies: {},
    dependencyAliases: {},
  };

  response.peerDependencies = packageJSON.peerDependencies;
  response.dependencyDependencies = await getDependencyDependencies(
    dep,
    version
  );

  response.contents = {
    [`/node_modules/${dep}/package.json`]: {
      content: packageJSONCode,
    },
  };

  return response;
}
