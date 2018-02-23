export function saveSandboxPrivacy({ api, state, props }) {
  const id = state.get('editor.currentId');
  return api
    .patch(`/sandboxes/${id}/privacy`, {
      sandbox: {
        privacy: props.privacy,
      },
    })
    .then(() => undefined);
}

export function deleteSandbox({ api, state }) {
  const id = state.get('editor.currentId');

  return api
    .request({
      method: 'DELETE',
      url: `/sandboxes/${id}`,
      body: {
        id,
      },
    })
    .then(() => undefined);
}

export function redirectToNewSandbox({ router }) {
  router.redirectToNewSandbox();
}

export function updateSandbox({ api, state }) {
  const sandboxId = state.get('editor.currentId');
  const body = {
    sandbox: {
      title: state.get('workspace.project.title'),
      description: state.get('workspace.project.description'),
    },
  };

  return api
    .put(`/sandboxes/${sandboxId}`, body)
    .then(data => ({ data }))
    .catch(error => ({ error }));
}

export function addTag({ api, path, state }) {
  const sandboxId = state.get('editor.currentId');
  const tag = state.get('workspace.tags.tagName');
  const body = {
    tag,
  };
  return api
    .post(`/sandboxes/${sandboxId}/tags`, body)
    .then(data => path.success({ data }))
    .catch(e => path.error({ error: e }));
}

export function removeTag({ api, props, state }) {
  const { tag } = props;
  const sandboxId = state.get('editor.currentId');
  return api
    .delete(`/sandboxes/${sandboxId}/tags/${tag}`)
    .then(data => ({ tags: data }));
}

export function removeTagFromState({ props, state }) {
  const { tag } = props;
  const tags = state.get(`editor.currentSandbox.tags`);
  const index = tags.indexOf(tag);
  state.splice(`editor.currentSandbox.tags`, index, 1);
  return { tag };
}

export function removeOptimisticExternalResource({ state, props }) {
  const sandboxId = state.get('editor.currentId');
  const externalResources = state.get(
    'editor.currentSandbox.externalResources'
  );

  state.splice(
    `editor.sandboxes.${sandboxId}.externalResources`,
    externalResources.indexOf(props.resource),
    1
  );
}

export function addExternalResource({ api, state, props, path }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/resources`, {
      externalResource: props.resource,
    })
    .then(() => path.success())
    .catch(error => path.error({ error }));
}

export function removeExternalResource({ api, state, props, path }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}/resources/`,
      body: {
        id: props.resource,
      },
    })
    .then(() => path.success())
    .catch(error => path.error({ error }));
}
