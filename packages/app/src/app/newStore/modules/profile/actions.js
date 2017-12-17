export function getUser({ api, props }) {
  return api.get(`/users/${props.username}`).then(data => ({ profile: data }));
}

export function getShowcasedSandbox({ api, props }) {
  return api
    .get(`/sandboxes/${props.profile.showcasedSandboxShortid}`)
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

export function setSandboxes({ state, props }) {
  const username = state.get('profile.current.username');

  if (!state.get(`profile.sandboxes.${username}`)) {
    state.set(`profile.sandboxes.${username}`, {
      [props.page]: props.sandboxes,
    });
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
    state.set(`profile.likedSandboxes.${username}`, {
      [props.page]: props.sandboxes,
    });
  } else {
    state.set(
      `profile.likedSandboxes.${username}.${props.page}`,
      props.sandboxes
    );
  }
}
