import { uniq } from 'lodash-es';
import * as semver from 'semver';

export interface ILambdaResponse {
  contents: {
    [path: string]: { content: string };
  };
  dependency: {
    name: string;
    version: string;
  };
  peerDependencies: {
    [dep: string]: string;
  };
  dependencyDependencies: {
    [dep: string]: {
      semver: string;
      resolved: string;
      parents: string[];
      entries: string[];
    };
  };
  dependencyAliases: {
    [dep: string]: {
      [dep: string]: string;
    };
  };
}

interface IDepDepInfo {
  semver: string;
  resolved: string;
  parents: string[];
  entries: string[];
}

interface IResponse {
  contents: { [path: string]: { content: string } };
  dependencies: Array<{ name: string; version: string }>;
  dependencyAliases: { [dep: string]: { [dep: string]: string } };
  dependencyDependencies: {
    [dep: string]: IDepDepInfo;
  };
}

/**
 * Compare two sorted string arrays
 *
 * @param {string[]} s1
 * @param {string[]} s2
 * @returns
 */
function isEqual(s1: string[], s2: string[]) {
  if (s1.length !== s2.length) {
    return false;
  }

  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Replaces the start of a key with a new string
 *
 * @param {{ [key: string]: string }} paths
 * @param {string} oldName
 * @param {string} newName
 */
function replacePaths(
  paths: { [key: string]: any },
  oldName: string,
  newName: string
) {
  Object.keys(paths).forEach(al => {
    if (al.startsWith(`${oldName}/`) || al === oldName) {
      paths[al.replace(oldName, newName)] =
        typeof paths[al] === 'string'
          ? paths[al].replace(oldName, newName)
          : paths[al];

      delete paths[al];
    }
  });
}

function replaceDependencyInfo(
  r: ILambdaResponse,
  depDepName: string,
  newDepDep: IDepDepInfo
) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    console.log(
      'Resolving conflict for ' +
        depDepName +
        ' new version: ' +
        newDepDep.resolved
    );
  }

  const newPath = `${depDepName}/${newDepDep.resolved}`;

  replacePaths(
    r.contents,
    `/node_modules/${depDepName}`,
    `/node_modules/${newPath}`
  );

  r.dependencyDependencies[newPath] = r.dependencyDependencies[depDepName];
  delete r.dependencyDependencies[depDepName];

  // eslint-disable-next-line
  for (const n of Object.keys(r.dependencyDependencies)) {
    r.dependencyDependencies[n].parents = r.dependencyDependencies[
      n
    ].parents.map(p => (p === depDepName ? newPath : p));
  }

  r.dependencyAliases = r.dependencyAliases || {};
  newDepDep.parents.forEach(p => {
    r.dependencyAliases[p] = r.dependencyAliases[p] || {};
    r.dependencyAliases[p][depDepName] = newPath;
  });
  replacePaths(r.dependencyAliases, depDepName, newPath);
}

const intersects = (v1: string, v2: string) => {
  try {
    return semver.intersects(v1, v2);
  } catch (e) {
    return false;
  }
};

export function mergeDependencies(responses: ILambdaResponse[]) {
  // For consistency between requests
  const sortedResponses = responses.sort((a, b) =>
    a.dependency.name.localeCompare(b.dependency.name)
  );

  const response: IResponse = {
    contents: {},
    dependencies: sortedResponses.map(r => r.dependency),
    dependencyAliases: {},
    dependencyDependencies: {},
  };

  // eslint-disable-next-line
  for (const r of sortedResponses) {
    for (let i = 0; i < Object.keys(r.dependencyDependencies).length; i++) {
      const depDepName = Object.keys(r.dependencyDependencies)[i];

      const newDepDep = r.dependencyDependencies[depDepName];
      const rootDependency = response.dependencies.find(
        d => d.name === depDepName
      );

      if (
        rootDependency &&
        !intersects(rootDependency.version, newDepDep.semver) &&
        rootDependency.version !== newDepDep.resolved &&
        rootDependency.name !== r.dependency.name // and this dependency doesn't require an older version of itself
      ) {
        // If a root dependency is in conflict with a child dependency, we always
        // go for the root dependency
        replaceDependencyInfo(r, depDepName, newDepDep);

        // Start from the beginning, to make sure everything is correct
        i = -1;
      } else if (response.dependencyDependencies[depDepName]) {
        const exDepDep = response.dependencyDependencies[depDepName];

        if (exDepDep.resolved === newDepDep.resolved) {
          exDepDep.parents = uniq([...exDepDep.parents, ...newDepDep.parents]);
          exDepDep.entries = uniq([...exDepDep.entries, ...newDepDep.entries]);
        } else if (
          intersects(exDepDep.semver, newDepDep.semver) &&
          isEqual(exDepDep.entries, newDepDep.entries)
        ) {
          const replacingDepDep = semver.gt(
            newDepDep.resolved,
            exDepDep.resolved
          )
            ? newDepDep
            : exDepDep;

          response.dependencyDependencies[depDepName] = replacingDepDep;
          response.dependencyDependencies[depDepName].parents = uniq([
            ...exDepDep.parents,
            ...newDepDep.parents,
          ]);
        } else {
          replaceDependencyInfo(r, depDepName, newDepDep);
          // Start from the beginning, to make sure everything is correct
          i = -1;
        }
      } else {
        response.dependencyDependencies[depDepName] =
          r.dependencyDependencies[depDepName];
      }
    }

    response.dependencyAliases = {
      ...response.dependencyAliases,
      ...r.dependencyAliases,
    };
    response.contents = { ...response.contents, ...r.contents };
  }

  return response;
}
