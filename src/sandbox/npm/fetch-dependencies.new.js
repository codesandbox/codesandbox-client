import { actions, dispatch } from 'codesandbox-api';
import _debug from 'app/utils/debug';
import dependenciesToQuery from './dependencies-to-query';

import delay from '../utils/delay';
import setScreen from '../status-screen';

type Dependencies = {
  [dependency: string]: string,
};

const RETRY_COUNT = 60;
const debug = _debug('cs:sandbox:packager');

const BUCKET_URL = 'https://d1jyvh0kxilfa7.cloudfront.net';
const PACKAGER_URL =
  'https://drq28qbjmc.execute-api.eu-west-1.amazonaws.com/prod/packages';

function callApi(url: string) {
  return fetch(url)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      const error = new Error(response.statusText || response.status);
      error.response = response;
      return Promise.reject(error);
    })
    .then(response => response.json());
}

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(url) {
  let retries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      const manifest = await callApi(url); // eslint-disable-line no-await-in-loop

      return manifest;
    } catch (e) {
      const statusCode = e.response && e.response.status;

      setScreen({ type: 'loading', text: 'Bundling Dependencies...' });

      // 403 status code means the bundler is still bundling
      if (retries < RETRY_COUNT && statusCode === 403) {
        retries += 1;
        await delay(1000 * 2); // eslint-disable-line no-await-in-loop
      } else if (retries < RETRY_COUNT && statusCode === 500) {
        dispatch(
          actions.notifications.show(
            'It seems like all packagers are busy, retrying in 10 seconds...',
            'warning'
          )
        );

        await delay(1000 * 2); // eslint-disable-line no-await-in-loop
        retries += 1;
      } else {
        throw e;
      }
    }
  }
}

function dependenciesToBucketPath(dependencies: Object) {
  return `combinations/${Object.keys(dependencies)
    .sort()
    .map(
      // Paths starting with slashes don't work with cloudfront, even escaped. So we remove the slashes
      dep =>
        `${encodeURIComponent(
          dep.replace('/', '-').replace('@', '')
        )}@${dependencies[dep]}`
    )
    .join('%2B')}.json`;
}

async function getDependencies(dependencies: Object) {
  const dependencyUrl = dependenciesToQuery(dependencies);
  const bucketDependencyUrl = dependenciesToBucketPath(dependencies);

  setScreen({ type: 'loading', text: 'Downloading Dependencies...' });
  try {
    const bucketManifest = await callApi(
      `${BUCKET_URL}/${bucketDependencyUrl}`
    );
    return bucketManifest;
  } catch (e) {
    // The dep has not been generated yet...
    const { url } = await requestPackager(`${PACKAGER_URL}/${dependencyUrl}`);

    setScreen({ type: 'loading', text: 'Downloading Dependencies...' });
    return callApi(`${BUCKET_URL}/${url}`);
  }
}

export default async function fetchDependencies(npmDependencies: Dependencies) {
  if (Object.keys(npmDependencies).length !== 0) {
    // New Packager flow

    try {
      const result = await getDependencies(npmDependencies);

      return result;
    } catch (e) {
      e.message = `Could not fetch dependencies: ${e.message}`;
      dispatch(actions.notifications.show(e.message, 'error'));

      throw e;
    }
  }
  return false;
}
