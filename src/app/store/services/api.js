import { camelizeKeys, decamelizeKeys } from 'humps';

const API_ROOT = '/api/v1/';

/**
 * Sends a request to the API and returns a promise with camelized response
 */
export default async function callApi(endpoint, { method = 'GET', body = null } = {}) {
  if (!endpoint) throw new Error('No endpoint is given');

  // If it is an absolute url.
  const url = endpoint.split('')[0] === '/' ? endpoint : API_ROOT + endpoint;
  const authorization = (document.cookie.match(/[; ]jwt=([^\s;]*)/) || [])[1];
  const options = { method };
  if (authorization) {
    options.headers = { Authorization: authorization && `Bearer ${authorization}` };
  }
  if (body) {
    options.body = JSON.stringify(decamelizeKeys(body));
  }

  const result = await fetch(url, options);
  const json = await result.json();
  return camelizeKeys(json.data);
}
