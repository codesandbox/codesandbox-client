import callApi from '../../services/api';

import delay from '../../services/delay';
import notificationActions from '../../actions/notifications';


export const FETCH_SOURCE_BUNDLE = 'FETCH_SOURCE_BUNDLE';
export const FETCH_SOURCE_BUNDLE_SUCCESS = 'FETCH_SOURCE_BUNDLE_SUCCESS';
export const FETCH_SOURCE_BUNDLE_FAILURE = 'FETCH_SOURCE_BUNDLE_FAILURE';

type Result = {
  hash: string;
  url: string;
  manifest: {
    [path: string]: { id: number, meta: string };
  };
};

function handleSuccess(id, result: Result, dispatch) {
  dispatch({
    type: FETCH_SOURCE_BUNDLE_SUCCESS,
    id,
    manifest: result.manifest,
    hash: result.hash,
    url: result.url,
  });
}

async function fetchUntilResult(id: string, hash: string, dispatch) {
  while (true) {
    await delay(2000);
    const result = await callApi(`/bundle/${hash}`, { shouldCamelize: false });
    if (result.manifest) {
      return handleSuccess(id, result, dispatch);
    }
  }
}

export default {
  fetchBundle: (id: string) => async (dispatch) => {
    dispatch({ type: FETCH_SOURCE_BUNDLE, id });
    try {
      const firstResult = await callApi('/bundle', { method: 'POST', body: { id }, shouldCamelize: false });
      if (firstResult.manifest) {
        handleSuccess(id, firstResult, dispatch);
      } else {
        await fetchUntilResult(id, firstResult.hash, dispatch);
      }
    } catch (e) {
      const error = e.response ? e.response.data.error : e;
      dispatch({
        type: FETCH_SOURCE_BUNDLE_FAILURE,
        id,
        error,
      });
      dispatch(notificationActions.addNotification(
        'Something went wrong while fetching dependencies.',
        error,
        'error',
      ));
    }
  },
};
