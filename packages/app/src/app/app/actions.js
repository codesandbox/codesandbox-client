import * as errors from './errors';

export function getUser({ api }) {
  return api
    .get('/users/current')
    .then(data => ({ user: data }))
    .catch(error => {
      throw new errors.AuthenticationError(
        error.response.result.errors.join(',')
      );
    });
}

export function setJwtFromStorage({ jwt, state }) {
  state.set('jwt', jwt.get() || null);
}

export function listenToConnectionChange({ connection }) {
  connection.addListener('connectionChanged');
}

export function stopListeningToConnectionChange({ connection }) {
  connection.removeListener('connectionChanged');
}
