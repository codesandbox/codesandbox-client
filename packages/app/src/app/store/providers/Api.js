import { camelizeKeys, decamelizeKeys } from 'humps';
import { Provider } from 'cerebral';

const API_ROOT = '/api/v1';

function createHeaders({ state, jwt }) {
  const foundJwt = state.get('jwt') || jwt.get();

  return foundJwt
    ? {
        Authorization: `Bearer ${foundJwt}`,
      }
    : {};
}

export default Provider({
  get(path, query) {
    return this.context.http
      .get(API_ROOT + path, query, {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data || response.result));
  },
  post(path, body) {
    return this.context.http
      .post(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data || response.result));
  },
  patch(path, body) {
    return this.context.http
      .patch(API_ROOT + path, decamelizeKeys(body), {
        headers: createHeaders(this.context),
      })
      .then(response => camelizeKeys(response.result.data || response.result));
  },
  put(path, body) {
    return this.context.http
      .put(API_ROOT + path, decamelizeKeys(body), {
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
  request(options) {
    return this.context.http
      .request(
        Object.assign(options, {
          url: API_ROOT + options.url,
          body: options.body ? camelizeKeys(options.body) : null,
          headers: createHeaders(this.context),
        })
      )
      .then(response => camelizeKeys(response.result.data));
  },
});
