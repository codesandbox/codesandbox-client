import fetchDependencies from './fetch-dependencies';
import dependenciesToQuery from './dependencies-to-query';

let loadedDependencyCombination: ?string = null;
let manifest = null;

type NPMDependencies = {
  [dependency: string]: string,
};

export const PACKAGER_URL = 'https://webpack-dll-prod.herokuapp.com/v6';

function addDependencyBundle(url) {
  return new Promise(resolve => {
    window.dll_bundle = null;
    const script = document.createElement('script');
    script.setAttribute('src', `${PACKAGER_URL}/${url}/dll.js`);
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
    const url = dependenciesToQuery(dependencies);

    if (loadedDependencyCombination !== url) {
      // Mark that the last requested url is this
      loadedDependencyCombination = url;

      manifest = await fetchDependencies(dependencies);

      await addDependencyBundle(url);
    }

    return manifest;
  }

  return {};
}
