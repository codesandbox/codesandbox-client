import _debug from '@codesandbox/common/lib/utils/debug';
import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';
import { actions, dispatch } from 'codesandbox-api';
import { mergeDependencies } from 'sandbox/version-resolving/merge-dependency';

import setScreen from '../status-screen';
import delay from '../utils/delay';
import dependenciesToQuery from './dependencies-to-query';

type Dependencies = {
  [dependency: string]: string;
};

const RETRY_COUNT = 60;
const debug = _debug('cs:sandbox:packager');

const VERSION = 2;

// eslint-disable-next-line
const DEV_URLS = {
  packager:
    'https://xi5p9f7czk.execute-api.eu-west-1.amazonaws.com/dev/packages',
  bucket: 'https://dev-packager-packages.codesandbox.io',
};
// eslint-disable-next-line
const PROD_URLS = {
  packager:
    'https://aiwi8rnkp5.execute-api.eu-west-1.amazonaws.com/prod/packages',
  bucket: 'https://prod-packager-packages.codesandbox.io',
};

const URLS = DEV_URLS;
const BUCKET_URL = URLS.bucket;
const PACKAGER_URL = URLS.packager;

function callApi(url: string, method = 'GET') {
  return fetch(url, {
    method,
  })
    .then(async response => {
      if (!response.ok) {
        const error = new Error(response.statusText || '' + response.status);

        const message = await response.json();

        // @ts-ignore
        error.response = message;
        // @ts-ignore
        error.statusCode = response.status;
        throw error;
      }

      return response;
    })
    .then(response => response.json());
}

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(url: string, method = 'GET') {
  let retries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      const manifest = await callApi(url, method); // eslint-disable-line no-await-in-loop

      return manifest;
    } catch (e) {
      if (e.response && e.statusCode !== 504) {
        throw new Error(e.response.error);
      }
      // 403 status code means the bundler is still bundling
      if (retries < RETRY_COUNT) {
        retries += 1;
        await delay(1000 * 2); // eslint-disable-line no-await-in-loop
      } else {
        throw e;
      }
    }
  }
}

function dependencyToPackagePath(name: string, version: string) {
  return `v${VERSION}/packages/${name}/${version}.json`;
}

/**
 * Some dependencies have a space in their version for some reason, this is invalid and we
 * ignore them. This is what yarn does as well.
 */
function removeSpacesFromDependencies(dependencies: Object) {
  const newDeps = {};
  Object.keys(dependencies).forEach(depName => {
    const [version] = dependencies[depName].split(' ');
    newDeps[depName] = version;
  });
  return newDeps;
}

async function getDependencies(
  dependencies: Object,
  showLoadingFullScreen: boolean
) {
  setScreen({
    type: 'loading',
    text: 'Downloading Dependencies...',
    showFullScreen: showLoadingFullScreen,
  });

  const absoluteDependencies = await getAbsoluteDependencies(
    removeSpacesFromDependencies(dependencies)
  );

  const deps = await Promise.all(
    Object.keys(absoluteDependencies).map(async name => {
      const version = absoluteDependencies[name];
      const dep = { [name]: version };

      const dependencyUrl = dependenciesToQuery(dep);
      const bucketDependencyUrl = dependencyToPackagePath(name, version);
      const fullUrl = `${BUCKET_URL}/${bucketDependencyUrl}`;

      try {
        const bucketManifest = await callApi(fullUrl);
        return bucketManifest;
      } catch (e) {
        setScreen({
          type: 'loading',
          text: 'Resolving Dependencies...',
          showFullScreen: showLoadingFullScreen,
        });

        // The dep has not been generated yet...
        await requestPackager(`${PACKAGER_URL}/${dependencyUrl}`, 'POST');

        setScreen({
          type: 'loading',
          text: 'Downloading Dependencies...',
          showFullScreen: showLoadingFullScreen,
        });

        return requestPackager(fullUrl);
      }
    })
  );

  return mergeDependencies(deps);
}

export async function fetchDependencies(
  npmDependencies: Dependencies,
  _: any,
  showLoaderFullScreen: boolean
) {
  if (Object.keys(npmDependencies).length !== 0) {
    // New Packager flow

    try {
      const result = await getDependencies(
        npmDependencies,
        showLoaderFullScreen
      );

      if (showLoaderFullScreen) {
        setScreen({
          type: 'loading',
          text: 'Transpiling Modules...',
          showFullScreen: showLoaderFullScreen,
        });
      }

      return result;
    } catch (e) {
      e.message = `Could not fetch dependencies, please try again in a couple seconds: ${e.message}`;
      dispatch(actions.notifications.show(e.message, 'error'));

      throw e;
    }
  }
  return false;
}
