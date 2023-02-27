/* eslint-disable camelcase */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

const API_ROOT = '/api';

/**
 * If the path starts with `/beta`, do not append `/v1` to the api root
 * url. Alternatively we have the useRoot param for when we just want to
 * use the root path.
 */
const getBaseApi = (path: string, useRoot: boolean = false) => {
  if (useRoot) {
    return API_ROOT;
  }

  return path.startsWith('/beta') ? API_ROOT : `${API_ROOT}/v1`;
};

export type ApiError = AxiosError<
  { errors: string[] } | { error: string } | any
>;

export type Params = {
  [key: string]: string;
};

type Options = {
  shouldCamelize: boolean;
};

export type Api = {
  get<T>(
    path: string,
    params?: Params,
    options?: Options,
    /**
     * Our API has three different base paths: /beta, /v1 and a path
     * without one of those. We can use the useRoot parameter to use the
     * latter.
     */
    useRoot?: boolean
  ): Promise<T>;
  post<T>(path: string, body: any, options?: Options): Promise<T>;
  patch<T>(path: string, body: any, options?: Options): Promise<T>;
  put<T>(path: string, body: any, options?: Options): Promise<T>;
  delete<T>(path: string, params?: Params, options?: Options): Promise<T>;
  request<T>(requestConfig: AxiosRequestConfig, options?: Options): Promise<T>;
};

export type ApiConfig = {
  provideJwtToken: () => string | null;
  getParsedConfigurations: () => any;
};

export default (config: ApiConfig) => {
  const createHeaders = (provideJwt: () => string | null) => ({
    'x-codesandbox-client': 'legacy-web',
    ...(provideJwt()
      ? {
          Authorization: `Bearer ${provideJwt()}`,
        }
      : {}),
  });
  const api: Api = {
    get(path, params, options, useRoot) {
      return axios
        .get(getBaseApi(path, useRoot) + path, {
          params,
          headers: createHeaders(config.provideJwtToken),
        })
        .then(response => handleResponse(response, options));
    },
    post(path, body, options) {
      return axios
        .post(getBaseApi(path) + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken),
        })
        .then(response => handleResponse(response, options));
    },
    patch(path, body, options) {
      return axios
        .patch(getBaseApi(path) + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken),
        })
        .then(response => handleResponse(response, options));
    },
    put(path, body, options) {
      return axios
        .put(getBaseApi(path) + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken),
        })
        .then(response => handleResponse(response, options));
    },
    delete(path, params, options) {
      return axios
        .delete(getBaseApi(path) + path, {
          params,
          headers: createHeaders(config.provideJwtToken),
        })
        .then(response => handleResponse(response, options));
    },
    request(requestConfig, options) {
      return axios
        .request(
          Object.assign(requestConfig, {
            url: getBaseApi(requestConfig.url ?? '') + requestConfig.url,
            data: requestConfig.data ? camelizeKeys(requestConfig.data) : null,
            headers: createHeaders(config.provideJwtToken),
          })
        )
        .then(response => handleResponse(response, options));
    },
  };

  return api;
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
