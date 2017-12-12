export function moveDirectoryToDirectory({ state, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const directoryIndex = sandbox.directories.findIndex(
    directory => directory.id === props.directoryId
  );

  state.set(
    `editor.sandboxes.${
      sandbox.id
    }.directories.${directoryIndex}.directoryShortid`,
    props.directoryShortid
  );
}

export function moveModuleToDirectory({ state, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const moduleIndex = sandbox.modules.findIndex(
    module => module.id === props.moduleId
  );

  state.set(
    `editor.sandboxes.${sandbox.id}.modules.${moduleIndex}.directoryShortid`,
    props.directoryShortid
  );
}

export function deleteDirectory({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get('editor.currentSandbox');
  const directory = sandbox.directories.find(
    directoryEntry => directoryEntry.id === props.id
  );

  return api
    .delete(`/sandboxes/${sandboxId}/directories/${directory.shortid}`)
    .then(() => undefined);
}

export function removeDirectory({ state, props }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get('editor.currentSandbox');
  const directoryIndex = sandbox.directories.findIndex(
    directoryEntry => directoryEntry.id === props.id
  );

  state.splice(`editor.sandboxes.${sandboxId}.directories`, directoryIndex, 1);
}

export function whenDeleteDirectory({ browser, state, path, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const directory = sandbox.directories.find(
    directoryEntry => directoryEntry.id === props.id
  );

  return browser.confirm(
    `Are you sure you want to delete ${directory.title} and all its children?`
  )
    ? path.confirmed()
    : path.cancelled();
}

export function saveNewDirectoryName({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get('editor.currentSandbox');
  const directory = sandbox.directories.find(
    directoryEntry => directoryEntry.id === props.id
  );

  return api
    .put(`/sandboxes/${sandboxId}/directories/${directory.shortid}`, {
      directory: { title: props.title },
    })
    .then(() => undefined);
}

export function renameDirectory({ state, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const directoryIndex = sandbox.directories.findIndex(
    directoryEntry => directoryEntry.id === props.id
  );

  state.set(
    `editor.sandboxes.${sandbox.id}.directories.${directoryIndex}.title`,
    props.title
  );
}

export function deleteModule({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get('editor.currentSandbox');
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.id === props.id
  );

  return api
    .delete(`/sandboxes/${sandboxId}/modules/${module.shortid}`)
    .then(() => undefined);
}

export function saveDirectory({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/directories`, {
      directory: {
        title: props.title,
        directoryShortid: props.directoryShortid,
      },
    })
    .then(data => ({ newDirectory: data }));
}

export function removeModule({ state, props }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get('editor.currentSandbox');
  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.id === props.id
  );

  state.splice(`editor.sandboxes.${sandboxId}.modules`, moduleIndex, 1);
}

export function saveNewModule({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/modules`, {
      module: { title: props.title, directoryShortid: props.directoryShortid },
    })
    .then(data => ({ newModule: data }));
}

export function saveNewModuleName({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get('editor.currentSandbox');
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.id === props.id
  );

  return api
    .put(`/sandboxes/${sandboxId}/modules/${module.shortid}`, {
      module: { title: props.title },
    })
    .then(() => undefined);
}

export function renameModule({ state, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.id === props.id
  );

  state.set(
    `editor.sandboxes.${sandbox.id}.modules.${moduleIndex}.title`,
    props.title
  );
}

export function updateSandbox({ api, state }) {
  const sandboxId = state.get('editor.currentId');
  const body = {
    sandbox: {
      title: state.get('editor.workspace.project.title'),
      description: state.get('editor.workspace.project.description'),
    },
  };

  return api
    .put(`/sandboxes/${sandboxId}`, body)
    .then(data => ({ data }))
    .catch(error => ({ error }));
}

export function addTag({ api, state }) {
  const sandboxId = state.get('editor.currentId');
  const tag = state.get('editor.workspace.tags.tagName');
  const body = {
    tag,
  };
  return api
    .post(`/sandboxes/${sandboxId}/tags`, body)
    .then(data => ({ data }));
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
  const sandboxId = state.get('editor.currentId');
  const tags = state.get(`editor.sandboxes.${sandboxId}.tags`);
  const index = tags.indexOf(tag);
  state.splice(`editor.sandboxes.${sandboxId}.tags`, index, 1);
  return { tag };
}

export function removeNpmDependency({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .delete(`/sandboxes/${sandboxId}/dependencies/${props.name}`)
    .then(data => ({ npmDependencies: data }));
}

export function addExternalResource({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/resources`, {
      externalResource: props.resource,
    })
    .then(data => ({ externalResources: data }));
}

export function removeExternalResource({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}/resources/`,
      body: {
        id: props.resource,
      },
    })
    .then(data => ({ externalResources: data }));
}
