export function whenValidRepo({ state, path }) {
  const repoTitle = state.get('editor.git.repoTitle');
  const modulesNotSaved = !state.get('editor.isAllModulesSynced');

  if (!repoTitle) {
    return path.error({ error: 'Repo name cannot be empty' });
  }

  if (/\s/.test(repoTitle.trim())) {
    return path.error({ error: 'Repo name cannot contain spaces' });
  }

  if (modulesNotSaved) {
    return path.error({ error: 'All files need to be saved' });
  }

  return path.true();
}

export function exportSandboxToGithub({ state, git }) {
  const sandbox = state.get('editor.currentSandbox');

  return git.export(sandbox).then(githubData => ({ githubData }));
}

export function saveGithubData({ api, state, props }) {
  const id = state.get('editor.currentId');
  const name = state.get('editor.git.repoTitle');

  return api
    .post(`/sandboxes/${id}/git/repo/${name}`, props.githubData)
    .then(git => ({
      git: Object.assign({}, git, {
        commitSha: null,
      }),
    }));
}

export function redirectToGithubSandbox({ props, router }) {
  router.updateSandboxUrl({ git: props.git });
}
