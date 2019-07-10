import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import { GitInfo, GitCommit, GitPr } from '@codesandbox/common/lib/types';

export const internal = internalActions;

export const repoTitleChanged: Action<string> = ({ state }, title) => {
  state.git.repoTitle = title;
  state.git.error = null;
};

export const createRepoClicked: AsyncAction = async ({ state, effects }) => {
  const repoTitle = state.git.repoTitle;
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
  const git = await effects.api.post<GitInfo>(
    `/sandboxes/${sandbox.id}/git/repo/${repoTitle}`,
    githubData
  );
  git.commitSha = null;
  const id = `github/${git.username}/${git.repo}/tree/${git.branch}/`;
  state.git.isExported = true;
  state.currentModal = null;
  effects.router.updateSandboxUrl({ git });
};

export const gitMounted = internalActions.fetchGitChanges;

export const createCommitClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  state.git.commit = null;
  state.git.isCommitting = true;
  state.currentModal = 'commit';
  const id = state.editor.currentId;
  const commit = await effects.api.post<GitCommit>(
    `/sandboxes/${id}/git/commit`,
    {
      id,
      message: actions.git.internal.createCommitMessage(),
    }
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

export const subjectChanged: Action<string> = ({ state }, subject) => {
  state.git.subject = subject;
};

export const descriptionChanged: Action<string> = ({ state }, description) => {
  state.git.description = description;
};

export const createPrClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  state.git.pr = null;
  state.git.isCreatingPr = true;
  state.currentModal = 'pr';

  const id = state.editor.currentId;
  const pr = await effects.api.post<GitPr>(`/sandboxes/${id}/git/pr`, {
    id,
    message: actions.git.internal.createCommitMessage(),
  });

  state.git.pr = pr;
  state.git.isCreatingPr = false;

  const user = state.user;
  const git = state.editor.currentSandbox.originalGit;
  const url = `https://github.com/${git.username}/${git.repo}/compare/${git.branch}...${user.username}:${pr.newBranch}?expand=1`;

  state.git.pr.prURL = url;

  await new Promise(resolve => setTimeout(resolve, 3000));

  effects.browser.openWindow(url);

  state.git.subject = '';
  state.git.description = '';
  state.git.originalGitChanges = null;

  effects.router.updateSandboxUrl({ git: pr.git });
};
