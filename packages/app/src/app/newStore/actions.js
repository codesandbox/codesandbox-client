import * as errors from './errors';

export function siginInGithub({ browser, path, props }) {
  const { useExtraScopes } = props;
  const popup = browser.openPopup(
    `/auth/github${useExtraScopes ? '?scope=user:email,public_repo' : ''}`,
    'sign in'
  );

  return browser.waitForMessage('signin').then(data => {
    const jwt = data.jwt;

    popup.close();

    if (jwt) {
      return path.success({ jwt });
    }

    return path.error();
  });
}

export function signOutGithub({ api }) {
  return api.delete(`/users/current_user/integrations/github`);
}

export function getAuthToken({ api, path }) {
  return api
    .get('/auth/auth-token')
    .then(token => path.success({ token }))
    .catch(error => path.error({ error }));
}

export function setStoredSettings({ state, settingsStore }) {
  const settings = settingsStore.getAll();

  if (settings.keybindings) {
    settings.keybindings = Object.keys(settings.keybindings).reduce(
      (value, key) =>
        value.concat({
          key,
          bindings: settings.keybindings[key],
        }),
      []
    );
  }

  state.merge('editor.preferences.settings', settings);
}

export function removeNotification({ state, props }) {
  const notifications = state.get('notifications');
  const notificationToRemoveIndex = notifications.findIndex(
    notification => notification.id === props.id
  );

  state.splice('notifications', notificationToRemoveIndex, 1);
}

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

export function setPatronPrice({ props, state }) {
  state.set(
    'patron.price',
    props.user.subscription ? props.user.subscription.amount : 10
  );
}
