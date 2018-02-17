import { Dictionary } from '@cerebral/fluent';

export function getUser({ api, props }) {
  return api.get(`/users/${props.username}`).then(data => ({ profile: data }));
}

export function deleteSandbox({ api, state }) {
  const sandboxId = state.get(`profile.sandboxToDeleteId`);

  return api
    .request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}`,
      body: {
        id: sandboxId,
      },
    })
    .then(() => state.set(`profile.current.sandboxCount - 1`));
}

export function getAllUserSandboxes({ api }) {
  return api.get('/sandboxes').then(sandboxes => ({ sandboxes }));
}

export function getShowcasedSandbox({ api, state }) {
  const profile = state.get('profile.current');

  return api
    .get(`/sandboxes/${profile.showcasedSandboxShortid}`)
    .then(data => ({ sandbox: data }));
}

export function getSandboxes({ api, state, props }) {
  const username = state.get('profile.current.username');

  return api
    .get(`/users/${username}/sandboxes`, {
      page: props.page,
    })
    .then(data => ({ sandboxes: data[props.page] }));
}

export function saveShowcasedSandbox({ api, props, state }) {
  return api
    .patch(`/users/${state.get('user.username')}`, {
      user: {
        showcasedSandboxShortid: props.id,
      },
    })
    .then(() => undefined);
}

export function setSandboxes({ state, props }) {
  const username = state.get('profile.current.username');

  if (!state.get(`profile.sandboxes.${username}`)) {
    state.set(
      `profile.sandboxes.${username}`,
      Dictionary({
        [props.page]: props.sandboxes,
      })
    );
  } else {
    state.set(`profile.sandboxes.${username}.${props.page}`, props.sandboxes);
  }
}

export function getLikedSandboxes({ api, state, props }) {
  const username = state.get('profile.current.username');

  return api
    .get(`/users/${username}/sandboxes/liked`, {
      page: props.page,
    })
    .then(data => ({ sandboxes: data[props.page] }));
}

export function setLikedSandboxes({ state, props }) {
  const username = state.get('profile.current.username');

  if (!state.get(`profile.likedSandboxes.${username}`)) {
    state.set(
      `profile.likedSandboxes.${username}`,
      Dictionary({
        [props.page]: props.sandboxes,
      })
    );
  } else {
    state.set(
      `profile.likedSandboxes.${username}.${props.page}`,
      props.sandboxes
    );
  }
}
