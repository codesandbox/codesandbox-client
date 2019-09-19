import { Action, AsyncAction } from 'app/overmind';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const repoTitleChanged: Action<{
  title: string;
}> = ({ state }, { title }) => {
  state.git.repoTitle = title;
  state.git.error = null;
};

export const createRepoClicked: AsyncAction = async ({ state, effects }) => {
  const { repoTitle } = state.git;
  const modulesNotSaved = !state.editor.isAllModulesSynced;

  if (!repoTitle) {
    state.git.error = 'Repo name cannot be empty';
    return;
  }

  if (/\s/.test(repoTitle.trim())) {
    state.git.error = 'Repo name cannot contain spaces';
    return;
  }

  if (modulesNotSaved) {
    state.git.error = 'All files need to be saved';
    return;
  }

  state.git.isExported = false;
  state.currentModal = 'exportGithub';

  const sandbox = state.editor.currentSandbox;
  const githubData = await effects.git.export(sandbox);
  const git = await effects.api.createGit(sandbox.id, repoTitle, githubData);

  // Not being used?
  // const id = `github/${git.username}/${git.repo}/tree/${git.branch}/`;

  git.commitSha = null;
  state.git.isExported = true;
  state.currentModal = null;
  effects.router.updateSandboxUrl({ git });
};

export const gitMounted: AsyncAction = ({ actions }) =>
  actions.git.internal.fetchGitChanges();

export const createCommitClicked: AsyncAction = async ({ state, effects }) => {
  const { git } = state;
  const id = state.editor.currentId;

  git.commit = null;
  git.isCommitting = true;
  state.currentModal = 'commit';

  const commit = await effects.api.createGitCommit(
    id,
    `${git.subject}${git.description.length ? `\n\n${git.description}` : ``}`
  );
  state.git.commit = commit;
  state.git.isCommitting = false;

  const isDirectCommit = !commit.newBranch && !commit.merge;

  if (isDirectCommit) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    state.currentModal = null;
  }
  state.git.subject = '';
  state.git.description = '';
  state.git.originalGitChanges = null;
};

export const subjectChanged: Action<{
  subject: string;
}> = ({ state }, { subject }) => {
  state.git.subject = subject;
};

export const descriptionChanged: Action<{
  description: string;
}> = ({ state }, { description }) => {
  state.git.description = description;
};

export const createPrClicked: AsyncAction = async ({ state, effects }) => {
  state.git.pr = null;
  state.git.isCreatingPr = true;
  state.currentModal = 'pr';

  const id = state.editor.currentId;
  const pr = await effects.api.createGitPr(
    id,
    `${state.git.subject}${
      state.git.description.length ? `\n\n${state.git.description}` : ``
    }`
  );

  state.git.pr = pr;
  state.git.isCreatingPr = false;

  const { user } = state;
  const git = state.editor.currentSandbox.originalGit;
  const url = `https://github.com/${git.username}/${git.repo}/compare/${
    git.branch
  }...${user.username}:${pr.newBranch}?expand=1`;

  state.git.pr.prURL = url;

  await new Promise(resolve => setTimeout(resolve, 3000));

  effects.browser.openWindow(url);

  state.git.subject = '';
  state.git.description = '';
  state.git.originalGitChanges = null;

  effects.router.updateSandboxUrl({ git: pr.git });
};
