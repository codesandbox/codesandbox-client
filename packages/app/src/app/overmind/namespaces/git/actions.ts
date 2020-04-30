import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { GitInfo, SandboxGitState } from '@codesandbox/common/lib/types';
import { Action, AsyncAction, Operator } from 'app/overmind';
import { debounce, mutate, pipe } from 'overmind';

import * as internalActions from './internalActions';

export const internal = internalActions;

export const repoTitleChanged: Action<{
  title: string;
}> = ({ state }, { title }) => {
  state.git.repoTitle = title;
  state.git.error = null;
};

export const loadGitSource: AsyncAction<GitInfo> = async (
  { state, actions, effects },
  info
) => {
  const sandbox = state.editor.currentSandbox;
  const sourceSandbox = await effects.api.getSandbox(
    `github/${info.username}/${info.repo}/tree/${info.branch}`
  );

  state.editor.sandboxes[sourceSandbox.id] = sourceSandbox;
  state.git.sourceSandboxId = sourceSandbox.id;

  state.git.sourceModulesByPath = sourceSandbox.modules.reduce(
    (aggr, module) => {
      const path = getModulePath(
        sourceSandbox.modules,
        sourceSandbox.directories,
        module.id
      );
      module.path = path;
      if (path) {
        aggr[path] = module;
      }

      return aggr;
    },
    {}
  );

  if (sandbox.prNumber) {
    state.git.pr = await effects.api.getGitPr(sandbox.id, sandbox.prNumber);

    const changes = await effects.api.compareGit(
      sandbox.id,
      state.git.pr.username,
      state.git.pr.baseCommitSha
    );

    state.git.originalGitChanges = changes.reduce((aggr, file) => {
      aggr['/' + file.filename] = file;

      return aggr;
    }, {});

    actions.git._setGitChanges();

    if (sandbox.originalGitCommitSha === state.git.pr.commitSha) {
      state.git.gitState = SandboxGitState.SYNCED;
    } else {
      const outOfSyncChanges = await effects.api.compareGit(
        sandbox.id,
        state.git.pr.username,
        sandbox.originalGitCommitSha,
        true
      );
      state.git.outOfSyncChanges = outOfSyncChanges.reduce((aggr, file) => {
        aggr['/' + file.filename] = file;

        return aggr;
      }, {});
      state.git.gitState = SandboxGitState.OUT_OF_SYNC_PR;
      // Will move to "CONFLICT" if there is a conflict
      actions.git._setGitChanges();
    }
  } else {
    state.git.gitState = SandboxGitState.DETACHED;
  }
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
  if (!sandbox) {
    return;
  }

  const githubData = await effects.git.export(sandbox);
  if (!githubData) {
    return;
  }
  const git = await effects.api.createGit(sandbox.id, repoTitle, githubData);

  if (!git) {
    effects.notificationToast.error(
      'Unable to create git repo, please try again'
    );
    return;
  }
  // Not being used?
  // const id = `github/${git.username}/${git.repo}/tree/${git.branch}/`;

  git.commitSha = null;
  state.git.isExported = true;
  state.currentModal = null;
  effects.router.updateSandboxUrl({ git });
};

export const createCommitClicked: AsyncAction = async ({ state, effects }) => {
  const { git } = state;
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  const { id } = sandbox;

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
  state.git.gitChanges = null;
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
  state.git.isCreatingPr = true;
  state.git.pr = null;
  state.currentModal = 'pr';
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  const { id } = sandbox;
  const pr = await effects.api.createGitPr(
    id,
    `${state.git.subject}${
      state.git.description.length ? `\n\n${state.git.description}` : ``
    }`
  );

  state.git.pr = pr;
  state.git.isCreatingPr = false;

  const { user } = state;
  const git = sandbox.originalGit;

  if (!user || !git) {
    effects.notificationToast.error(
      'Something wrong happened creating the PR, please refresh and try again'
    );
    return;
  }
  const url = `https://github.com/${git.username}/${git.repo}/compare/${git.branch}...${user.username}:${pr.newBranch}?expand=1`;

  state.git.pr.prURL = url;

  await new Promise(resolve => setTimeout(resolve, 3000));

  effects.browser.openWindow(url);

  state.git.subject = '';
  state.git.description = '';
  state.git.gitChanges = null;

  effects.router.updateSandboxUrl({ git: pr.git });
};

export const updateGitChanges: Operator = pipe(
  debounce(500),
  mutate(({ actions }) => actions.git._setGitChanges())
);

export const _setGitChanges: Action = ({ state }) => {
  const changes = {
    added: [],
    deleted: [],
    modified: [],
    rights: '',
  };
  let hasConflict = false;
  state.editor.currentSandbox.modules.forEach(module => {
    if (
      state.git.outOfSyncChanges[module.path] &&
      state.git.outOfSyncChanges[module.path].content !== module.code
    ) {
      hasConflict = true;
    }

    // We check if the file is not in source and not on PR
    if (
      !state.git.sourceModulesByPath[module.path] &&
      !state.git.originalGitChanges[module.path]
    ) {
      changes.added.push(module.path);
    } else if (
      // We check if the file has been changed related to PR
      state.git.originalGitChanges[module.path] &&
      module.code !== state.git.originalGitChanges[module.path].content
    ) {
      changes.modified.push(module.path);
    } else if (
      // We check if the file has been changed related to source
      state.git.sourceModulesByPath[module.path].code !== module.code
    ) {
      changes.modified.push(module.path);
    }
  });
  state.editor.sandboxes[state.git.sourceSandboxId].modules.forEach(module => {
    if (!state.editor.modulesByPath[module.path]) {
      changes.deleted.push(module.path);
    }
  });
  state.git.gitChanges = changes;

  if (state.git.gitState === SandboxGitState.CONFLICT_PR && !hasConflict) {
    state.git.gitState = SandboxGitState.OUT_OF_SYNC_PR;
  } else if (
    state.git.gitState === SandboxGitState.OUT_OF_SYNC_PR &&
    hasConflict
  ) {
    state.git.gitState = SandboxGitState.CONFLICT_PR;
  }
};

export const resolveOutOfSyncPR: Action = ({ state, effects }) => {
  const sandbox = state.editor.currentSandbox;
  state.git.gitState = SandboxGitState.RESOLVING;

  sandbox.modules.forEach(module => {
    if (
      state.git.outOfSyncChanges[module.path] &&
      state.git.outOfSyncChanges[module.path].content !== module.code
    ) {
      effects.vscode.openDiff(
        sandbox.id,
        module,
        state.git.outOfSyncChanges[module.path].content
      );
    }
  });
};

export const updateOutOfSyncPR: Action = ({ state, effects }) => {};
