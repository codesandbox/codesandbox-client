import fetchDependencies from './fetch-dependencies';
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
    script.addEventListener('load', resolve);

    document.head.appendChild(script);
  });
}

/**
 * This fetches the manifest and dependencies from the
 * @param {*} dependencies
 */
export default async function loadDependencies(dependencies: NPMDependencies) {
  if (Object.keys(dependencies).length !== 0) {
    const depQuery = dependenciesToQuery(dependencies);

    if (loadedDependencyCombination !== depQuery) {
      // Mark that the last requested url is this
      loadedDependencyCombination = depQuery;

      setScreen({ type: 'loading', text: 'Bundling Dependencies...' });

      const data = await fetchDependencies(dependencies);

      manifest = data;

      setScreen({ type: 'loading', text: 'Downloading Dependencies...' });

      await addDependencyBundle(data.url);
    }
  }

  return { manifest };
}
