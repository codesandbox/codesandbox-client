export function openPr({ state, browser }) {
  const url = state.get('git.pr.prURL');

  browser.openWindow(url);
}

function createCommitMessage(state) {
  const subject = state.get('git.subject');
  const description = state.get('git.description');
  return `${subject}${description.length ? `\n\n${description}` : ``}`;
}

export function createPr({ api, state }) {
  const id = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${id}/git/pr`, {
      id,
      message: createCommitMessage(state),
    })
    .then(pr => ({ pr }));
}

export function redirectToPr({ router, props }) {
  router.updateSandboxUrl({ git: props.pr.git });
}

export function createCommit({ api, state }) {
  const id = state.get('editor.currentId');
  return api
    .post(`/sandboxes/${id}/git/commit`, {
      id,
      message: createCommitMessage(state),
    })
    .then(commit => ({ commit }));
}

export function whenValidRepo({ state, path }) {
  const repoTitle = state.get('git.repoTitle');
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
  const name = state.get('git.repoTitle');

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

export function setPRURL({ state }) {
  const pr = state.get('git.pr');
  const user = state.get('user');
  const git = state.get('editor.currentSandbox.originalGit');

  const url = `https://github.com/${git.username}/${git.repo}/compare/${
    git.branch
  }...${user.username}:${pr.newBranch}?expand=1`;

  state.set('git.pr.prURL', url);
}
