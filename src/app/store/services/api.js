// @flow

import { camelizeKeys, decamelizeKeys } from 'humps';
import axios from 'axios';

const API_ROOT = '/api/v1/';

export type BodyType = {
  method: ?string,
  body: ?Object,
  shouldCamelize: ?boolean,
};

/**
 * Sends a request to the API and returns a promise with camelized response
 */
export default (async function callApi(
  endpoint: string,
  { method = 'GET', body = null, shouldCamelize = true }: ?BodyType = {},
) {
  if (!endpoint) throw new Error('No endpoint is given');

  // If it is an absolute url.
  const url = endpoint.split('')[0] === '/'
    ? endpoint
    : `${API_ROOT}${endpoint}`;

  const options = { url, method };

  if (body) {
    if (method === 'GET' && body != null) {
      // Convert body to ?x=y&b=a format
      const keyValues = Object.keys(decamelizeKeys(body))
        .map(key => `${key}=${body[key]}`)
        .join('&');
      const parameterizedBody = `?${keyValues}`;
      options.url += parameterizedBody;
    } else {
      options.data = decamelizeKeys(body);
    }
  }

  const result = await axios(options);
  return shouldCamelize ? camelizeKeys(result.data) : result.data;
});
