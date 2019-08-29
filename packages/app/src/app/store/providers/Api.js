import track, { logError } from '@codesandbox/common/lib/utils/analytics';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';
import { values } from 'lodash-es';

import { camelizeKeys, decamelizeKeys } from 'humps';
import { Provider } from 'cerebral';
import { addNotification } from '../factories';

const API_ROOT = '/api/v1';

function createHeaders({ state, jwt }) {
  const foundJwt = state.get('jwt') || jwt.get();

  return foundJwt
    ? {
        Authorization: `Bearer ${foundJwt}`,
      }
    : {};
}

const getMessage = (error: Error & { response: ?Object }) => {
  const response = error.response;

  if (!response || response.status >= 500) {
    logError(error);
  }

  if (response && response.result) {
    if (response.result.errors) {
      const errors = values(response.result.errors)[0];
      if (Array.isArray(errors)) {
        if (errors[0]) {
          error.message = errors[0]; // eslint-disable-line no-param-reassign
        }
      } else {
        error.message = errors; // eslint-disable-line no-param-reassign
      }
    } else if (response.result.error) {
      error.message = response.result.error; // eslint-disable-line no-param-reassign
    } else if (response.status === 413) {
      return 'File too large, upload limit is 5MB.';
    }
  }

  return error.message;
};

function showNotification(controller, errorMessage: string) {
  if (errorMessage.startsWith('You need to sign in to create more than')) {
    // Error for "You need to sign in to create more than 10 sandboxes"
    track('Anonymous Sandbox Limit Reached', { errorMessage });

    notificationState.addNotification({
      title: errorMessage,
      status: NotificationStatus.ERROR,
      actions: {
        primary: [
          {
            label: 'Sign in',
            run: () => {
              controller.getSignal('signInClicked')({});
            },
          },
        ],
      },
    });
  } else if (errorMessage.startsWith('You reached the maximum of')) {
    track('Non-Patron Sandbox Limit Reached', { errorMessage });

    notificationState.addNotification({
      title: errorMessage,
      status: NotificationStatus.ERROR,
      actions: {
        primary: [
          {
            label: 'Open Patron Page',
            run: () => {
              window.open(patronUrl(), '_blank');
            },
          },
        ],
      },
    });
  } else if (
    errorMessage.startsWith(
      'You reached the limit of server sandboxes, you can create more server sandboxes as a patron.'
    )
  ) {
    track('Non-Patron Server Sandbox Limit Reached', { errorMessage });

    notificationState.addNotification({
      title: errorMessage,
      status: NotificationStatus.ERROR,
      actions: {
        primary: [
          {
            label: 'Open Patron Page',
            run: () => {
              window.open(patronUrl(), '_blank');
            },
          },
        ],
      },
    });
  } else {
    if (
      errorMessage.startsWith(
        'You reached the limit of server sandboxes, we will increase the limit in the future. Please contact hello@codesandbox.io for more server sandboxes.'
      )
    ) {
      track('Patron Server Sandbox Limit Reached', { errorMessage });
    }

    controller.runSignal(
      'notificationAdded',
      addNotification(errorMessage, 'error')
    );
  }
}

const showError = (error, controller) => {
  const errorMessage = getMessage(error);
  showNotification(controller, errorMessage);

  error.apiMessage = errorMessage; // eslint-disable-line no-param-reassign
};

const handleError = (error, controller) => {
  try {
    showError(error, controller);
  } catch (e) {
    console.error(e);
  }

  throw error;
};

function handleResponse(response, { shouldCamelize = true } = {}) {
  const camelizedData = shouldCamelize
    ? camelizeKeys(response.result)
    : response.result;

  // Quickfix to prevent underscored dependencies from being camelized.
  // Never store data as keys in the future.
  if (
    camelizedData &&
    camelizedData.data &&
    camelizedData.data.npmDependencies
  ) {
    camelizedData.data.npmDependencies = response.result.data.npm_dependencies;
  }

  return camelizedData.data ? camelizedData.data : camelizedData;
}

export default Provider({
  get(path, query, options) {
    return this.context.http
      .get(API_ROOT + path, query, {
        headers: createHeaders(this.context),
      })
      .then(response => handleResponse(response, options))
      .catch(e => handleError(e, this.context.controller));
  },
  post(path, body, options) {
    return this.context.http
      .post(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => handleResponse(response, options))
      .catch(e => handleError(e, this.context.controller));
  },
  patch(path, body, options) {
    return this.context.http
      .patch(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => handleResponse(response, options))
      .catch(e => handleError(e, this.context.controller));
  },
  put(path, body, options) {
    return this.context.http
      .put(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => handleResponse(response, options))
      .catch(e => handleError(e, this.context.controller));
  },
  delete(path, query, options) {
    return this.context.http
      .delete(API_ROOT + path, query, {
        headers: createHeaders(this.context),
      })
      .then(response => handleResponse(response, options))
      .catch(e => handleError(e, this.context.controller));
  },
  request(options) {
    return this.context.http
      .request({
        ...options,
        url: API_ROOT + options.url,
        body: options.body ? camelizeKeys(options.body) : null,
        headers: createHeaders(this.context),
      })
      .then(response => handleResponse(response, options))
      .catch(e => handleError(e, this.context.controller));
  },
});
