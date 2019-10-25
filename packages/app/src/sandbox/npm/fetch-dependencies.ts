import { actions, dispatch } from 'codesandbox-api';
import _debug from '@codesandbox/common/lib/utils/debug';
import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';

import dependenciesToQuery from './dependencies-to-query';

import delay from '../utils/delay';
import setScreen from '../status-screen';

type Dependencies = {
  [dependency: string]: string;
};

const RETRY_COUNT = 60;
const debug = _debug('cs:sandbox:packager');

const VERSION = 1;

const BUCKET_URL =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
    ? 'https://d1jyvh0kxilfa7.cloudfront.net'
    : 'https://dev-packager-packages.codesandbox.io';

const NEW_PACKAGER_URL =
  'https://aiwi8rnkp5.execute-api.eu-west-1.amazonaws.com/prod/packages';

const PACKAGER_URL =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
    ? 'https://drq28qbjmc.execute-api.eu-west-1.amazonaws.com/prod/packages'
    : 'https://xi5p9f7czk.execute-api.eu-west-1.amazonaws.com/dev/packages';

function warmupPackager(url: string, method = 'GET') {
  fetch(url, {
    method,
  })
    .then(() => {})
    .catch(() => {});
}

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
        return Promise.reject(error);
      }

      return Promise.resolve(response);
    })
    .then(response => response.json());
}

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(url, method = 'GET') {
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

function dependenciesToBucketPath(dependencies: Object) {
  return `v${VERSION}/combinations/${Object.keys(dependencies)
    .sort()
    .map(
      // Paths starting with slashes don't work with cloudfront, even escaped. So we remove the slashes
      dep =>
        `${encodeURIComponent(dep.replace('/', '-').replace('@', ''))}@${
          dependencies[dep]
        }`
    )
    .join('%2B')}.json`;
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

async function getDependencies(dependencies: Object) {
  const absoluteDependencies = await getAbsoluteDependencies(
    removeSpacesFromDependencies(dependencies)
  );
  const dependencyUrl = dependenciesToQuery(absoluteDependencies);
  const bucketDependencyUrl = dependenciesToBucketPath(absoluteDependencies);

  setScreen({ type: 'loading', text: 'Downloading Dependencies...' });
  warmupPackager(`${NEW_PACKAGER_URL}/${dependencyUrl}`, 'POST');
  try {
    const bucketManifest = await callApi(
      `${BUCKET_URL}/${bucketDependencyUrl}`
    );
    return bucketManifest;
  } catch (e) {
    setScreen({ type: 'loading', text: 'Resolving Dependencies...' });

    // The dep has not been generated yet...
    const { url } = await requestPackager(
      `${PACKAGER_URL}/${dependencyUrl}`,
      'POST'
    );

    setScreen({ type: 'loading', text: 'Downloading Dependencies...' });

    return requestPackager(`${BUCKET_URL}/${url}`);
  }
}

export async function fetchDependencies(
  npmDependencies: Dependencies,
  resolutions?: { [key: string]: string }
) {
  if (Object.keys(npmDependencies).length !== 0) {
    // New Packager flow

    try {
      const result = await getDependencies(npmDependencies);
      setScreen({ type: 'loading', text: 'Transpiling Modules...' });

      return result;
    } catch (e) {
      e.message = `Could not fetch dependencies, please try again in a couple seconds: ${
        e.message
      }`;
      dispatch(actions.notifications.show(e.message, 'error'));

      throw e;
    }
  }
  return false;
}
