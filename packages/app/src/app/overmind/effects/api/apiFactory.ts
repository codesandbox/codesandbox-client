/* eslint-disable camelcase */
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import track, { logError } from '@codesandbox/common/lib/utils/analytics';
import { values } from 'lodash-es';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { Module } from '@codesandbox/common/lib/types';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';

export const API_ROOT = '/api/v1';

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

export type Params = {
  [key: string]: string;
};

export type Options = {
  shouldCamelize: boolean;
};

export type Api = {
  get<T>(path: string, params?: Params, options?: Options): Promise<T>;
  post<T>(path: string, body: any, options?: Options): Promise<T>;
  patch<T>(path: string, body: any, options?: Options): Promise<T>;
  put<T>(path: string, body: any, options?: Options): Promise<T>;
  delete<T>(path: string, params?: Params, options?: Options): Promise<T>;
  request<T>(requestConfig: AxiosRequestConfig, options?: Options): Promise<T>;
};

export type ApiConfig = {
  provideJwtToken: () => string;
  getModulesByPath: () => {
    [path: string]: Module;
  };
  getParsedConfigurations: () => any;
  signIn: (val: any) => Promise<void>;
};

export default (config: ApiConfig) => {
  const createHeaders = (jwt: string) =>
    jwt
      ? {
          Authorization: `Bearer ${jwt}`,
        }
      : {};

  const showError = error => {
    const errorMessage = getMessage(error);
    showNotification(errorMessage);

    error.apiMessage = errorMessage; // eslint-disable-line no-param-reassign
  };

  const showNotification = (errorMessage: string) => {
    if (errorMessage.startsWith('You need to sign in to create more than')) {
      // Error for "You need to sign in to create more than 10 sandboxes"
      track('Anonymous Sandbox Limit Reached', { errorMessage });

      notificationState.addNotification({
        message: errorMessage,
        status: NotificationStatus.ERROR,
        actions: {
          primary: [
            {
              label: 'Sign in',
              run: () => {
                config.signIn({});
              },
            },
          ],
        },
      });
    } else if (errorMessage.startsWith('You reached the maximum of')) {
      track('Non-Patron Sandbox Limit Reached', { errorMessage });

      notificationState.addNotification({
        message: errorMessage,
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
        message: errorMessage,
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

      notificationState.addNotification({
        message: errorMessage,
        status: NotificationStatus.ERROR,
      });
    }
  };

  const getMessage = (
    error: AxiosError<{ errors: string[] } | { error: string } | any>
  ) => {
    const { response } = error;

    if (!response || response.status >= 500) {
      logError(error);
    }

    const result = response.data;
    if (result) {
      if ('errors' in result) {
        const errors = values(result.errors)[0];
        if (Array.isArray(errors)) {
          if (errors[0]) {
            error.message = errors[0]; // eslint-disable-line no-param-reassign,prefer-destructuring
          }
        } else {
          error.message = errors; // eslint-disable-line no-param-reassign
        }
      } else if (result.error) {
        error.message = result.error; // eslint-disable-line no-param-reassign
      } else if (response.status === 413) {
        return 'File too large, upload limit is 5MB.';
      }
    }

    return error.message;
  };

  const handleError = (error: AxiosError) => {
    try {
      showError(error);
    } catch (e) {
      console.error(e);
    }

    throw error;
  };

  const api: Api = {
    get(path, params, options) {
      return axios
        .get(API_ROOT + path, {
          params,
          headers: createHeaders(config.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    post(path, body, options) {
      return axios
        .post(API_ROOT + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    patch(path, body, options) {
      return axios
        .patch(API_ROOT + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    put(path, body, options) {
      return axios
        .put(API_ROOT + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    delete(path, params, options) {
      return axios
        .delete(API_ROOT + path, {
          params,
          headers: createHeaders(config.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    request(requestConfig, options) {
      return axios
        .request(
          Object.assign(requestConfig, {
            url: API_ROOT + requestConfig.url,
            data: requestConfig.data ? camelizeKeys(requestConfig.data) : null,
            headers: createHeaders(config.provideJwtToken()),
          })
        )
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
  };

  return api;
};

export function handleResponse(
  response: AxiosResponse,
  { shouldCamelize = true } = {}
) {
  const camelizedData = shouldCamelize
    ? camelizeKeys(response.data)
    : response.data;

  // Quickfix to prevent underscored dependencies from being camelized.
  // Never store data as keys in the future.
  if (
    camelizedData &&
    camelizedData.data &&
    camelizedData.data.npmDependencies
  ) {
    camelizedData.data.npmDependencies = response.data.data.npm_dependencies;
  }

  return camelizedData.data ? camelizedData.data : camelizedData;
}
