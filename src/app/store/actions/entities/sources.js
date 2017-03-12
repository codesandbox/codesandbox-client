import callApi from '../../services/api';

import delay from '../../services/delay';
import notificationActions from '../../actions/notifications';

export const FETCH_SOURCE_BUNDLE = 'FETCH_SOURCE_BUNDLE';
export const FETCH_SOURCE_BUNDLE_SUCCESS = 'FETCH_SOURCE_BUNDLE_SUCCESS';
export const FETCH_SOURCE_BUNDLE_FAILURE = 'FETCH_SOURCE_BUNDLE_FAILURE';

export const ADD_NPM_DEPENDENCY = 'ADD_NPM_DEPENDENCY';
export const REMOVE_NPM_DEPENDENCY = 'REMOVE_NPM_DEPENDENCY';

type Result = {
  hash: string;
  url: string;
  manifest: {
    [path: string]: { id: number, meta: string };
  };
};

class BundleLoader {
  constructor(id, dispatch) {
    this.cancelled = false;
    this.id = id;
    this.dispatch = dispatch;

    this.fetch();
  }

  id: string;
  done: boolean;
  cancelled: boolean;
  dispatch: Function;

  handleSuccess = (id, result: Result, dispatch) => {
    dispatch({
      type: FETCH_SOURCE_BUNDLE_SUCCESS,
      id,
      manifest: result.manifest,
      hash: result.hash,
      url: result.url,
    });
    this.done = true;
  };

  cancel = () => {
    this.cancelled = true;
    if (!this.done) {
      console.log(`'${this.id}' bundle fetch got cancelled`);
    }
  }

  fetch = async () => {
    const { id } = this;
    try {
      const firstResult = await callApi('/bundler/bundle', { method: 'POST', body: { id }, shouldCamelize: false });
      if (firstResult.manifest && !this.cancelled) {
        this.handleSuccess(id, firstResult, this.dispatch);
      } else {
        while (!this.cancelled) {
          await delay(2000);
          const result = await callApi(`/bundler/bundle/${firstResult.hash}`, { shouldCamelize: false });
          if (result.manifest) {
            if (!this.cancelled) {
              this.handleSuccess(id, result, this.dispatch);
            }
            return;
          }
        }
      }
    } catch (e) {
      const error = e.response ? e.response.data.error : e;
      this.dispatch({
        type: FETCH_SOURCE_BUNDLE_FAILURE,
        id,
        error,
      });
      this.dispatch(notificationActions.addNotification(
        'Something went wrong while fetching dependencies.',
        error,
        'error',
      ));
    }
  }
}

export default {
  fetchBundle: (id: string) => function fetchBundle(dispatch) {
    dispatch({ type: FETCH_SOURCE_BUNDLE, id });
    return new BundleLoader(id, dispatch);
  },

  addNPMDependency: (id: string, name: string, version: ?string = 'latest') => async (dispatch) => {
    try {
      const absoluteVersion = await callApi(`/bundler/npm/version/${name}/${version}`);
      dispatch({
        type: ADD_NPM_DEPENDENCY,
        name: name.toLowerCase(),
        version: absoluteVersion.version,
        id,
      });

      // Return true if success
      return true;
    } catch (e) {
      const message = e.response ? e.response.data.error : e.message;
      dispatch(notificationActions.addNotification(
        `Error adding package '${name}'`,
        message,
        'error',
      ));

      // Return false if failure
      return false;
    }
  },

  removeNPMDependency: (id: string, name: string) => ({ type: REMOVE_NPM_DEPENDENCY, id, name }),
};
