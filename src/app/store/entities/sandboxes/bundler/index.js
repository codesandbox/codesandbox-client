// @flow
import _debug from 'app/utils/debug';

import { createAPIActions } from '../../../api/actions'; // eslint-disable-line

import callApi from '../../../services/api';
import dependenciesToQuery from './dependencies-to-query';
import logError from '../../../../utils/error';

const debug = _debug('cs:app:packager');

export const PACKAGER_URL = 'https://webpack-dll-prod.herokuapp.com/v6';

const RETRY_COUNT = 10;

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
      const result = await callApi(`${url}/manifest.json`); // eslint-disable-line

      return { ...result, url };
    } catch (e) {
      const statusCode = e.response && e.response.status;

      // 504 status code means the bundler is still bundling
      if (retries < RETRY_COUNT && statusCode === 504) {
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

// eslint-disable-next-line
/*::
  const _apiActions = createAPIActions('pref', 'act');
*/
export default function fetch(
  actions: typeof _apiActions, // eslint-disable-line
  id: string,
  npmDependencies: Object,
) {
  return async (dispatch: Function) => {
    if (Object.keys(npmDependencies).length !== 0) {
      dispatch({ type: actions.REQUEST, initial: true, id });
      // New Packager flow
      try {
        const result = await callPackager(npmDependencies);

        dispatch({ type: actions.SUCCESS, id, result });
        return result;
      } catch (e) {
        logError(e, { level: 'error', service: 'packager' });
        dispatch({ type: actions.FAILURE, id });

        throw e;
      }
    }
    return false;
  };
}
