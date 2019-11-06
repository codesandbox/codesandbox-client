import { pickBy } from 'lodash-es';

import { fetchDependencies } from './fetch-dependencies';
import { getDependencyVersions } from '../version-resolving';
import dependenciesToQuery from './dependencies-to-query';

import setScreen from '../status-screen';

let loadedDependencyCombination: string | null = null;
let manifest = null;

type NPMDependencies = {
  [dependency: string]: string;
};

/**
 * If there is a URL to a file we need to fetch the dependencies dynamically, at least
 * for the first version. In the future we might want to consider a hybrid version where
 * we only fetch the dynamic files for dependencies with a url as version. But this is a good
 * start.
 */
function shouldFetchDynamically(dependencies: NPMDependencies) {
  return Object.keys(dependencies).some(depName =>
    dependencies[depName].includes('http')
  );
}

/**
 * This fetches the manifest and dependencies from the
 * @param {*} dependencies
 */
export async function loadDependencies(
  dependencies: NPMDependencies,
  { disableExternalConnection = false, resolutions = undefined } = {}
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

      const fetchDynamically =
        disableExternalConnection ||
        shouldFetchDynamically(dependenciesWithoutTypings);

      const fetchFunction = fetchDynamically
        ? getDependencyVersions
        : fetchDependencies;

      const data = await fetchFunction(dependenciesWithoutTypings, resolutions);

      // Mark that the last requested url is this
      loadedDependencyCombination = depQuery;
      manifest = data;

      setScreen({ type: 'loading', text: 'Transpiling Modules...' });
    }
  } else {
    manifest = null;
  }

  return { manifest, isNewCombination };
}
