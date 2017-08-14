// @flow
import _debug from 'app/utils/debug';
import notifActions from 'app/store/notifications/actions';

import { createAPIActions } from '../../../api/actions'; // eslint-disable-line

import callApi from '../../../services/api';
import dependenciesToQuery from './dependencies-to-query';
import logError from '../../../../utils/error';
import delay from '../../../services/delay';

const debug = _debug('cs:app:packager');

export const PACKAGER_URL = 'https://webpack-dll-prod.herokuapp.com/v6';
export const NEW_PACKAGER_URL =
  'https://42qpdtykai.execute-api.eu-west-1.amazonaws.com/prod/package';

const RETRY_COUNT = 20;

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(query: string, dispatch: ?Function) {
  let retries = 0;

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
            notifActions.addNotification(
              'It seems like all packagers are busy, retrying in 10 seconds...',
              'warning',
            ),
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

async function callPackager(dependencies: Object, dispatch: Function) {
  const dependencyUrl = dependenciesToQuery(dependencies);

  try {
    window.fetch(`${NEW_PACKAGER_URL}/${dependencyUrl}`);
  } catch (e) {
    console.error(e);
  }

  const result = await requestPackager(dependencyUrl, dispatch);
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
        const result = await callPackager(npmDependencies, dispatch);

        dispatch({ type: actions.SUCCESS, id, result });
        return result;
      } catch (e) {
        e.message = `Could not fetch dependencies: ${e.message}`;
        logError(e, { level: 'error', service: 'packager' });
        dispatch({ type: actions.FAILURE, id });

        throw e;
      }
    }
    return false;
  };
}
