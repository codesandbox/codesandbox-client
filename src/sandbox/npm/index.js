import { pickBy } from 'lodash';

import fetchDependencies from './fetch-dependencies';
import fetchDependenciesNew from './fetch-dependencies.new';
import dependenciesToQuery from './dependencies-to-query';

import setScreen from '../status-screen';

let loadedDependencyCombination: ?string = null;
let manifest = null;

type NPMDependencies = {
  [dependency: string]: string,
};

export const PACKAGER_URL =
  'https://42qpdtykai.execute-api.eu-west-1.amazonaws.com/prod/package';

function addDependencyBundle(url) {
  return new Promise(resolve => {
    window.dll_bundle = null;
    const script = document.createElement('script');
    script.setAttribute('src', `${url}/dll.js`);
    script.setAttribute('async', false);
    script.setAttribute('crossorigin', true);
    script.addEventListener('load', resolve);

    document.head.appendChild(script);
  });
}

/**
 * This fetches the manifest and dependencies from the
 * @param {*} dependencies
 */
export default async function loadDependencies(
  dependencies: NPMDependencies,
  experimentalPackager = false
) {
  let isNewCombination = false;
  if (Object.keys(dependencies).length !== 0) {
    // We filter out all @types, as they are not of any worth to the bundler
    const dependenciesWithoutTypings = pickBy(
      dependencies,
      (val, key) => !key.includes('@types')
    );

    const depQuery = dependenciesToQuery(dependenciesWithoutTypings);

    if (loadedDependencyCombination !== depQuery) {
      isNewCombination = true;
      // Mark that the last requested url is this
      loadedDependencyCombination = depQuery;

      setScreen({ type: 'loading', text: 'Bundling Dependencies...' });

      const fetcher = experimentalPackager
        ? fetchDependenciesNew
        : fetchDependencies;

      const data = await fetcher(dependenciesWithoutTypings);
      manifest = data;

      setScreen({ type: 'loading', text: 'Downloading Dependencies...' });

      if (!experimentalPackager) {
        await addDependencyBundle(data.url);
      }
    }
  } else {
    manifest = {};
  }

  return { manifest, isNewCombination };
}
