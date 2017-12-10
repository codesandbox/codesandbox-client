// @flow
import { camelizeKeys, decamelizeKeys } from 'humps';
import axios from 'axios';

import { optionsToParameterizedUrl } from 'common/utils/url-generator';

const API_ROOT = '/api/v1/';

export type BodyType = {
  method: ?string,
  body: ?Object,
  shouldCamelize: ?boolean,
  jwt: ?string,
};

function getUrl(endpoint: string) {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  return endpoint.split('')[0] === '/' ? endpoint : `${API_ROOT}${endpoint}`;
}

/**
 * Sends a request to the API and returns a promise with camelized response
 */
export default (async function callApi(
  endpoint: string,
  jwt: ?string,
  { method = 'GET', body = null, shouldCamelize = true }: ?BodyType = {}
) {
  if (!endpoint) throw new Error('No endpoint is given');

  // If it is an absolute url.
  const url = getUrl(endpoint);

  const options = { url, method };

  if (jwt) {
    options.headers = {
      Authorization: `Bearer ${jwt}`,
    };
  }

  if (body) {
    if (method === 'GET' && body != null) {
      // Convert body to ?x=y&b=a format
      options.url += optionsToParameterizedUrl(decamelizeKeys(body));
    } else {
      options.data = decamelizeKeys(body);
    }
  }

  const result = await axios(options);

  const camelizedData = shouldCamelize
    ? camelizeKeys(result.data)
    : result.data;

  // Quickfix to prevent underscored dependencies from being camelized.
  // Never store data as keys in the future.
  if (
    camelizedData &&
    camelizedData.data &&
    camelizedData.data.npmDependencies
  ) {
    camelizedData.data.npmDependencies = result.data.data.npm_dependencies;
  }

  return camelizedData;
});
