import { pickBy } from 'lodash-es';
import { dispatch, actions } from 'codesandbox-api';

import {
  preloadedProtocols,
  getFetchProtocol,
} from './dynamic/fetch-protocols';

import dependenciesToQuery from './dependencies-to-query';
import { parseResolutions } from './dynamic/resolutions';
import { resolveDependencyInfo } from './dynamic/resolve-dependency';
import { getDependency as getPrebundledDependency } from './preloaded/fetch-dependencies';
import { IResponse, mergeDependencies } from './merge-dependency';
import { getSandpackSecret, removeSandpackSecret } from '../sandpack-secret';

let loadedDependencyCombination: string | null = null;
let manifest: IResponse | null = null;

export type NPMDependencies = {
  [dependency: string]: string;
};

const PRELOADED_PROTOCOLS = [
  preloadedProtocols.jsdelivr,
  preloadedProtocols.unpkg,
];

/**
 * Depending on the dependency version we decide whether we can load a prebundled bundle (generated
 * in a lambda) or use a dynamic version of fetching the dependency.
 */
function shouldFetchDynamically(depName: string, depVersion: string) {
  const fetchProtocol = getFetchProtocol(depName, depVersion);
  return !PRELOADED_PROTOCOLS.includes(fetchProtocol);
}

/**
 * Some dependencies have a space in their version for some reason, this is invalid and we
 * ignore them. This is what yarn does as well.
 */
function removeSpacesFromDependencies(dependencies: NPMDependencies) {
  const newDeps: NPMDependencies = {};
  Object.keys(dependencies).forEach(depName => {
    const [version] = dependencies[depName].split(' ');
    newDeps[depName] = version;
  });
  return newDeps;
}

/**
 * Split the dependencies between whether they should be loaded from dynamically or from an endpoint
 * that has the dependency already prebundled.
 */
function splitDependencies(
  dependencies: NPMDependencies,
  forceFetchDynamically: boolean
): {
  dynamicDependencies: NPMDependencies;
  prebundledDependencies: NPMDependencies;
} {
  if (forceFetchDynamically) {
    return { dynamicDependencies: dependencies, prebundledDependencies: {} };
  }

  const dynamicDependencies: NPMDependencies = {};
  const prebundledDependencies: NPMDependencies = {};

  Object.keys(dependencies).forEach(depName => {
    const version = dependencies[depName];
    if (shouldFetchDynamically(depName, version)) {
      dynamicDependencies[depName] = version;
    } else {
      prebundledDependencies[depName] = version;
    }
  });

  return { dynamicDependencies, prebundledDependencies };
}

export type UpdateProgressFunc = (progress: {
  done: number;
  total: number;
  remainingDependencies: string[];
  dependencyName: string;
}) => void;

export async function getDependenciesFromSources(
  dependencies: {
    [depName: string]: string;
  },
  resolutions: { [startGlob: string]: string } | undefined,
  forceFetchDynamically: boolean,
  updateProgress: UpdateProgressFunc
) {
  try {
    const parsedResolutions = parseResolutions(resolutions);
    const remainingDependencies = Object.keys(dependencies);
    const totalDependencies = remainingDependencies.length;

    const depsWithNodeLibs = removeSpacesFromDependencies({
      'node-libs-browser': '2.2.0',
      ...dependencies,
    });

    const { dynamicDependencies, prebundledDependencies } = splitDependencies(
      depsWithNodeLibs,
      forceFetchDynamically
    );

    const updateLoadScreen = (depName: string) => {
      const progress = totalDependencies - remainingDependencies.length;
      const total = totalDependencies;

      updateProgress({
        done: progress,
        total,
        remainingDependencies,
        dependencyName: depName,
      });
    };

    const dynamicPromise = Promise.all(
      Object.keys(dynamicDependencies).map(depName =>
        resolveDependencyInfo(
          depName,
          depsWithNodeLibs[depName],
          parsedResolutions
        ).finally(() => {
          remainingDependencies.splice(
            remainingDependencies.indexOf(depName),
            1
          );
          updateLoadScreen(depName);
        })
      )
    );

    const prebundledPromise = Promise.all(
      Object.keys(prebundledDependencies).map(depName =>
        getPrebundledDependency(depName, depsWithNodeLibs[depName])
          .then(d => {
            // Unfortunately we've let this through in our system, some dependencies will just be { error: string }.
            // The bug has been fixed, but dependencies have been cached, we have to filter them out and fetch them
            // dynamically.
            // @ts-ignore not possible anymore
            if (d.error) {
              return resolveDependencyInfo(
                depName,
                depsWithNodeLibs[depName],
                parsedResolutions
              );
            }

            return d;
          })
          .finally(() => {
            remainingDependencies.splice(
              remainingDependencies.indexOf(depName),
              1
            );
            updateLoadScreen(depName);
          })
      )
    );

    const [
      dynamicLoadedDependencies,
      prebundledLoadedDependencies,
    ] = await Promise.all([dynamicPromise, prebundledPromise]);

    return mergeDependencies([
      ...dynamicLoadedDependencies,
      ...prebundledLoadedDependencies,
    ]);
  } catch (err: any) {
    if (getSandpackSecret()) {
      removeSandpackSecret();
    }

    err.message = `Could not fetch dependencies, please try again in a couple seconds: ${err.message}`;
    dispatch(actions.notifications.show(err.message, 'error'));

    throw err;
  }
}

type DependencyOpts = {
  disableExternalConnection?: boolean;
  resolutions?: { [key: string]: string } | undefined;
};

/**
 * This fetches the manifest and dependencies from our packager or dynamic sources
 * @param {*} dependencies
 */
export async function loadDependencies(
  dependencies: NPMDependencies,
  updateProgress: UpdateProgressFunc,
  {
    disableExternalConnection = false,
    resolutions = undefined,
  }: DependencyOpts = {}
) {
  let isNewCombination = false;
  if (Object.keys(dependencies).length !== 0) {
    // We filter out all @types, as they are not of any worth to the bundler
    const dependenciesWithoutTypings = pickBy(
      dependencies,
      (val, key) => !(key.includes && key.includes('@types'))
    );

    const depQuery = dependenciesToQuery(dependenciesWithoutTypings);

    if (loadedDependencyCombination !== depQuery) {
      isNewCombination = true;

      const data = await getDependenciesFromSources(
        dependenciesWithoutTypings,
        resolutions,
        disableExternalConnection,
        updateProgress
      );

      // Mark that the last requested url is this
      loadedDependencyCombination = depQuery;
      manifest = data;
    }
  } else {
    manifest = null;
  }

  return { manifest, isNewCombination };
}
