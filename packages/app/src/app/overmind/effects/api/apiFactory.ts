/* eslint-disable camelcase */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

const API_ROOT = '/api';

const getBaseApi = (path: string, options: Options = {}) => {
  // Special case for /auth/workos requests which are not on /api/v1
  if (path.startsWith('/auth/workos')) {
    return '';
  }

  // Version is either a datetime string or null in case the param can be omitted
  // However, null will still mean `/v1` is not appended
  if (options.version !== undefined) {
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
  shouldCamelize?: boolean;
  version?: string | null;
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
  provideJwtToken: () => string | null;
};

export default (config: ApiConfig) => {
  const createHeaders = (
    provideJwt: () => string | null,
    version?: string | null
  ) => ({
    'x-codesandbox-client': 'legacy-web',
    ...(version ? { 'X-CSB-API-Version': version } : {}),
    ...(provideJwt()
      ? {
          Authorization: `Bearer ${provideJwt()}`,
        }
      : {}),
  });
  const api: Api = {
    get(path, params, options) {
      return axios
        .get(getBaseApi(path, options) + path, {
          params,
          headers: createHeaders(config.provideJwtToken, options?.version),
        })
        .then(response => handleResponse(response, options));
    },
    post(path, body, options) {
      return axios
        .post(getBaseApi(path, options) + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken, options?.version),
        })
        .then(response => handleResponse(response, options));
    },
    patch(path, body, options) {
      return axios
        .patch(getBaseApi(path, options) + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken, options?.version),
        })
        .then(response => handleResponse(response, options));
    },
    put(path, body, options) {
      return axios
        .put(getBaseApi(path, options) + path, decamelizeKeys(body), {
          headers: createHeaders(config.provideJwtToken, options?.version),
        })
        .then(response => handleResponse(response, options));
    },
    delete(path, params, options) {
      return axios
        .delete(getBaseApi(path, options) + path, {
          params,
          headers: createHeaders(config.provideJwtToken, options?.version),
        })
        .then(response => handleResponse(response, options));
    },
    request(requestConfig, options) {
      return axios
        .request(
          Object.assign(requestConfig, {
            url:
              getBaseApi(requestConfig.url ?? '', options) + requestConfig.url,
            data: requestConfig.data ? camelizeKeys(requestConfig.data) : null,
            headers: createHeaders(config.provideJwtToken, options?.version),
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
