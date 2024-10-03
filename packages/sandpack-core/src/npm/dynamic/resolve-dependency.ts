import minimatch from 'minimatch';
import * as semver from 'semver';
import { isAbsoluteVersion } from '@codesandbox/common/lib/utils/dependencies';

import { ILambdaResponse } from '../merge-dependency';
import {
  downloadAllDependencyFiles,
  downloadDependency,
} from './fetch-npm-module';
import { IParsedResolution } from './resolutions';

export async function getPackageJSON(dep: string, version: string) {
  const m = await downloadDependency(dep, version, '/package.json');
  return m.code;
}

async function getLatestVersionForSemver(
  dep: string,
  version: string
): Promise<string> {
  if (isAbsoluteVersion(version)) {
    return Promise.resolve(version);
  }

  const p = await getPackageJSON(dep, version);
  return JSON.parse(p).version;
}

interface IPeerDependencyResult {
  [dep: string]: {
    semver: string;
    resolved: string;
    parents: string[];
    entries: string[];
  };
}

function getAbsoluteVersion(
  originalDep: string,
  depName: string,
  depVersion: string,
  parsedResolutions: { [name: string]: IParsedResolution[] }
): Promise<string> {
  // Try getting it from the resolutions field first, if that doesn't work
  // we try to get the latest version from the semver.
  const applicableResolutions = parsedResolutions[depName];
  if (applicableResolutions) {
    const modulePath = [originalDep, depName].join('/');

    const { range } =
      applicableResolutions.find(({ globPattern }) =>
        minimatch(modulePath, globPattern)
      ) || {};

    if (range) {
      if (semver.valid(range)) {
        return getLatestVersionForSemver(depName, range);
      }

      return Promise.resolve(range);
    }
  }

  return getLatestVersionForSemver(depName, depVersion);
}

async function getDependencyDependencies(
  dep: string,
  version: string,
  parsedResolutions: { [name: string]: IParsedResolution[] },
  peerDependencyResult: IPeerDependencyResult = {}
): Promise<IPeerDependencyResult> {
  const packageJSONCode = await getPackageJSON(dep, version);
  const packageJSON = JSON.parse(packageJSONCode);

  await Promise.all(
    Object.keys(packageJSON.dependencies || {}).map(async (depName: string) => {
      const depVersion = packageJSON.dependencies[depName];

      if (peerDependencyResult[depName]) {
        if (peerDependencyResult[depName].parents.indexOf(dep) === -1) {
          peerDependencyResult[depName].parents.push(dep);
        }
        return;
      }

      const absoluteVersion = await getAbsoluteVersion(
        dep,
        depName,
        depVersion,
        parsedResolutions
      );

      // In case inbetween the peer dependency result has been added already
      if (peerDependencyResult[depName]) {
        if (peerDependencyResult[depName].parents.indexOf(dep) === -1) {
          peerDependencyResult[depName].parents.push(dep);
        }
      } else {
        // eslint-disable-next-line
        peerDependencyResult[depName] = {
          semver: depVersion,
          resolved: absoluteVersion,
          parents: [dep],
          entries: [],
        };
        await getDependencyDependencies(
          depName,
          absoluteVersion,
          parsedResolutions,
          peerDependencyResult
        );
      }
    })
  );

  return peerDependencyResult;
}

export async function resolveDependencyInfo(
  dep: string,
  version: string,
  parsedResolutions: IParsedResolution[]
) {
  const IS_ALIAS = /^npm:/;
  const packageJSONCode = await getPackageJSON(dep, version);
  const packageJSON = JSON.parse(packageJSONCode);
  const response: ILambdaResponse = {
    contents: {},
    dependency: {
      name: dep,
      version,
    },
    peerDependencies: {},
    dependencyDependencies: {},
    dependencyAliases: {},
  };

  const resolutionsByPackage: { [name: string]: IParsedResolution[] } = {};
  parsedResolutions.forEach(res => {
    resolutionsByPackage[res.name] = resolutionsByPackage[res.name] || [];
    resolutionsByPackage[res.name].push(res);
  });

  response.peerDependencies = packageJSON.peerDependencies || {};
  response.dependencyDependencies = await getDependencyDependencies(
    dep,
    version,
    resolutionsByPackage
  );

  response.contents = {
    [`/node_modules/${dep}/package.json`]: {
      content: packageJSONCode,
    },
  };

  const allFiles = await downloadAllDependencyFiles(dep, version);
  if (allFiles) {
    allFiles.forEach(file => {
      response.contents[`/node_modules/${dep}${file.path}`] = {
        content: file.code,
      };
    });
  }

  await Promise.all(
    Object.keys(response.dependencyDependencies).map(async packageName => {
      let packageVersion =
        response.dependencyDependencies[packageName].resolved;

      // If the package is a remote module or is an alias we use the semver as the version for fetching
      const pkgSemver = response.dependencyDependencies[packageName].semver;
      if (pkgSemver && (pkgSemver.match(IS_ALIAS) || pkgSemver.includes('/'))) {
        packageVersion = pkgSemver;
      }

      const pkgJson = await getPackageJSON(packageName, packageVersion);
      response.contents[`/node_modules/${packageName}/package.json`] = {
        content: pkgJson,
      };
    })
  );

  return response;
}
