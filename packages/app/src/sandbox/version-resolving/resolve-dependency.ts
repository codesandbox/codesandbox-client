import Cache from 'lru-cache';
import { ILambdaResponse } from './merge-dependency';

const packageJSONCache: Cache.Cache<string, Promise<any>> = new Cache({
  max: 100,
});

const ROOT_DOMAIN = 'https://unpkg.com';

function getPackageJSON(dep: string, version: string) {
  const cachedPromise = packageJSONCache.get(dep + version);
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = fetch(`${ROOT_DOMAIN}/${dep}@${version}/package.json`).then(
    res => res.json()
  );
  packageJSONCache.set(dep + version, promise);

  return promise;
}

function getLatestVersionForSemver(dep: string, version: string) {
  return getPackageJSON(dep, version).then(p => p.version);
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
  const packageJSON = await getPackageJSON(dep, version);

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
  const packageJSON = await getPackageJSON(dep, version);
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
      content: JSON.stringify(packageJSON, null, 2),
    },
  };

  return response;
}
