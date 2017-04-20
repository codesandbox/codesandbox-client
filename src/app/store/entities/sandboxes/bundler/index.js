import _debug from 'app/utils/debug';

import callApi from '../../../services/api';
import delay from '../../../services/delay';

import dependenciesToQuery from './dependencies-to-query';
import { singleSandboxSelector } from '../selectors';
import logError from '../../../../utils/error';

const debug = _debug('cs:app:packager');

/**
 * Request the packager, if retries > 4 it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(query: string) {
  let retries = 0;

  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      await callApi(
        `https://cdn.jsdelivr.net/webpack/v1/${query}/manifest.json`,
      );
      return;
    } catch (e) {
      if (retries < 5) {
        retries += 1;
      } else {
        throw e;
      }
    }
  }
}

async function callNewPackager(dependencies: Object) {
  // New Packager flow
  try {
    const dependencyUrl = dependenciesToQuery(dependencies);

    await requestPackager(dependencyUrl);
  } catch (e) {
    logError(e, { level: 'warning', service: 'packager' });
  }
}

export default function fetch(actions, id: string) {
  return async (dispatch: Function, getState: Function) => {
    const sandbox = singleSandboxSelector(getState(), { id });
    if (sandbox) {
      callNewPackager(sandbox.npmDependencies);
    }

    dispatch({ type: actions.REQUEST, initial: true, id });
    const firstResult = await callApi('/bundler/bundle', null, {
      method: 'POST',
      body: { id },
    });
    dispatch({ type: actions.SUCCESS, result: firstResult });

    if (firstResult.manifest) {
      return firstResult;
    }

    while (true) {
      await delay(1000);
      const result = await callApi(`/bundler/bundle/${firstResult.hash}`);

      if (result.manifest) {
        return result;
      }
    }
  };
}
