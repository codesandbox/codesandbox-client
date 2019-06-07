import axios, { AxiosResponse, AxiosError } from 'axios';
import { logError } from '@codesandbox/common/lib/utils/analytics';
import { values } from 'lodash-es';
import { camelizeKeys, decamelizeKeys } from 'humps';

const API_ROOT = '/api/v1';

const getMessage = (error: AxiosError) => {
  const response = error.response;

  if (!response || response.status >= 500) {
    logError(error);
  }

  if (response && response.data) {
    if (response.data.errors) {
      const errors = values(response.data.errors)[0];
      if (Array.isArray(errors)) {
        if (errors[0]) {
          error.message = errors[0]; // eslint-disable-line no-param-reassign
        }
      } else {
        error.message = errors; // eslint-disable-line no-param-reassign
      }
    } else if (response.data.error) {
      error.message = response.data.error; // eslint-disable-line no-param-reassign
    } else if (response.status === 413) {
      return 'File too large, upload limit is 5MB.';
    }
  }

  return error.message;
};

function handleResponse(
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

type Options = {
  provideJwtToken: () => string;
  onError: (error: string) => void;
};

export default (() => {
  let _options: Options = {
    provideJwtToken() {
      throw new Error('Missing implementation');
    },
    onError() {
      throw new Error('Missing implementation');
    },
  };

  function createHeaders(jwt: string) {
    return jwt
      ? {
          Authorization: `Bearer ${jwt}`,
        }
      : {};
  }

  const showError = error => {
    const errorMessage = getMessage(error);

    _options.onError(errorMessage);
    error.apiMessage = errorMessage; // eslint-disable-line no-param-reassign
  };

  const handleError = error => {
    try {
      showError(error);
    } catch (e) {
      console.error(e);
    }

    throw error;
  };

  return {
    initialize(options: Options) {
      _options = options;
    },
    get<T>(
      path: string,
      params?: { [key: string]: string },
      options?: {}
    ): Promise<T> {
      return axios
        .get(API_ROOT + path, {
          params,
          headers: createHeaders(_options.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    post(path, body, options?) {
      return axios
        .post(API_ROOT + path, decamelizeKeys(body), {
          headers: createHeaders(_options.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    patch(path, body, options) {
      return axios
        .patch(API_ROOT + path, decamelizeKeys(body), {
          headers: createHeaders(_options.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    put(path, body, options) {
      return axios
        .put(API_ROOT + path, decamelizeKeys(body), {
          headers: createHeaders(_options.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    delete(path, params?, options?) {
      return axios
        .delete(API_ROOT + path, {
          params,
          headers: createHeaders(_options.provideJwtToken()),
        })
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
    request(options) {
      return axios
        .request(
          Object.assign(options, {
            url: API_ROOT + options.url,
            body: options.body ? camelizeKeys(options.body) : null,
            headers: createHeaders(_options.provideJwtToken()),
          })
        )
        .then(response => handleResponse(response, options))
        .catch(e => handleError(e));
    },
  };
})();
