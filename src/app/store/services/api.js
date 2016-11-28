import { camelizeKeys, decamelizeKeys } from 'humps';
import axios from 'axios';

const API_ROOT = '/api/v1/';

/**
 * Sends a request to the API and returns a promise with camelized response
 */
export default async function callApi(endpoint, { method = 'GET', body = null } = {}) {
  if (!endpoint) throw new Error('No endpoint is given');

  // If it is an absolute url.
  const url = endpoint.split('')[0] === '/' ? endpoint : `${API_ROOT}${endpoint}`;
  const authorization = (document.cookie.match(/[; ]jwt=([^\s;]*)/) || [])[1];
  const options = { url, method };
  if (authorization) {
    options.headers = { Authorization: authorization && `Bearer ${authorization}` };
  }
  if (body) {
    if (method === 'GET') {
      // Convert body to ?x=y&b=a format
      const keyValues = Object.keys(decamelizeKeys(body)).map(key => (
        `${key}=${body[key]}`
      )).join('&');
      const parameterizedBody = `?${keyValues}`;
      options.url += parameterizedBody;
    } else {
      options.data = decamelizeKeys(body);
    }
  }


  const result = await axios(options);
  return camelizeKeys(result.data.data);
}
