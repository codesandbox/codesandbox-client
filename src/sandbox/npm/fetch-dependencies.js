import { actions, dispatch } from 'codesandbox-api';
import _debug from 'app/utils/debug';
import dependenciesToQuery from './dependencies-to-query';
import delay from '../utils/delay';

type Dependencies = {
  [dependency: string]: string,
};

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

export const PACKAGER_URL = 'https://webpack-dll-prod.herokuapp.com/v6';
export const NEW_PACKAGER_URL =
  'https://drq28qbjmc.execute-api.eu-west-1.amazonaws.com/prod/packages';

const RETRY_COUNT = 20;

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(query: string) {
  let retries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      const url = `${PACKAGER_URL}/${query}`;
      const result = await callApi(`${url}/manifest.json`); // eslint-disable-line no-await-in-loop

      return { ...result, url };
    } catch (e) {
      const statusCode = e.response && e.response.status;

      // 504 status code means the bundler is still bundling
      if (retries < RETRY_COUNT && statusCode === 504) {
        retries += 1;
      } else if (retries < RETRY_COUNT && statusCode === 500) {
        if (dispatch) {
          dispatch(
            actions.notifications.show(
              'It seems like all packagers are busy, retrying in 10 seconds...',
              'warning'
            )
          );
        }
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

  try {
    // Warmup cache
    window.fetch(`${NEW_PACKAGER_URL}/${dependencyUrl}`).catch(e => {
      if (process.env.NODE_ENV === 'development') {
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
  }

  const manifest = await requestPackager(dependencyUrl);
  return manifest;
}

// eslint-disable-next-line
/*::
  const _apiActions = createAPIActions('pref', 'act');
*/
export default async function fetchDependencies(npmDependencies: Dependencies) {
  if (Object.keys(npmDependencies).length !== 0) {
    // New Packager flow
    try {
      const result = await callPackager(npmDependencies, dispatch);

      return result;
    } catch (e) {
      e.message = `Could not fetch dependencies: ${e.message}`;
      dispatch(actions.notifications.show(e.message, 'error'));

      throw e;
    }
  }
  return false;
}
