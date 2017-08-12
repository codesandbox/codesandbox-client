import _debug from 'app/utils/debug';
import dependenciesToQuery from './dependencies-to-query';
import { PACKAGER_URL } from './';
import delay from '../utils/delay';
import actions, { dispatch } from '../actions';

type Dependencies = {
  [dependency: string]: string,
};

const RETRY_COUNT = 20;
const debug = _debug('cs:sandbox:packager');

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
async function requestPackager(query: string) {
  let retries = 0;

  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      const url = `${PACKAGER_URL}/${query}`;
      const manifest = await callApi(`${url}/manifest.json`); // eslint-disable-line no-await-in-loop

      return manifest;
    } catch (e) {
      const statusCode = e.response && e.response.status;

      // 504 status code means the bundler is still bundling
      if (retries < RETRY_COUNT && statusCode === 504) {
        retries += 1;
      } else if (retries < RETRY_COUNT && statusCode === 500) {
        dispatch(
          actions.notifications.showNotification(
            'It seems like all packagers are busy, retrying in 10 seconds...',
            'warning',
          ),
        );

        await delay(1000 * 10); // eslint-disable-line no-await-in-loop
        retries += 1;
      } else {
        throw e;
      }
    }
  }
}

async function callPackager(dependencies: Object) {
  const dependencyUrl = dependenciesToQuery(dependencies);

  const result = await requestPackager(dependencyUrl);
  return result;
}

export default async function fetchDependencies(npmDependencies: Dependencies) {
  if (Object.keys(npmDependencies).length !== 0) {
    // New Packager flow
    try {
      const result = await callPackager(npmDependencies);

      return result;
    } catch (e) {
      e.message = `Could not fetch dependencies: ${e.message}`;
      dispatch(actions.notifications.showNotification(e.message, 'error'));

      throw e;
    }
  }
  return false;
}
