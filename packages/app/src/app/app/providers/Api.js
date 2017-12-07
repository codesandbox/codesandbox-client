import { camelizeKeys, decamelizeKeys } from 'humps';
import { Provider } from 'cerebral';

const API_ROOT = '/api/v1';

function createHeaders({ state }) {
  const jwt = state.get('jwt');

  return jwt
    ? {
        Authorization: `Bearer ${jwt}`,
      }
    : {};
}

export default Provider({
  get(path, query) {
    return this.context.http
      .get(API_ROOT + path, query, {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data));
  },
  post(path, body) {
    return this.context.http
      .post(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data));
  },
  patch(path, body) {
    return this.context.http
      .patch(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data));
  },
  delete(path, query) {
    return this.context.http
      .delete(API_ROOT + path, query, {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data));
  },
});
