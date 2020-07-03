import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import {
  GitChanges,
  GitFileCompare,
  GitInfo,
  Module,
  SandboxGitState,
} from '@codesandbox/common/lib/types';
import { convertTypeToStatus } from '@codesandbox/common/lib/utils/notifications';
import { Action, AsyncAction, Operator } from 'app/overmind';
import { debounce, mutate, pipe } from 'overmind';

import * as internalActions from './internalActions';
import { createDiff } from './utils';

export const internal = internalActions;

export const repoTitleChanged: Action<{
  title: string;
}> = ({ state }, { title }) => {
  state.git.repoTitle = title;
  state.git.error = null;
};

/**
 * There are two states the Sandbox can be in:
 * 1. It has been forked and the SOURCE is the GIT details of the Sandbox it forked from
 * 2. It has been forked and the SOURCE is the PR created
 *
 * To give indication of what file changes has been made, we do the following:
 * 1. First we load the SOURCE sandbox. We need this to indicate what you have changed in your sandbox
 * 2. Every time you make a change to the files we go through modules/directories of the source sandbox and your sandbox to produce a diff
 *
 * The steps that is taken to find "out of sync" and "conflict", is the following:
 * 1. We first want to compare your sandbox with the SOURCE (This being the GIT info on the sandbox you forked from or the PR)
 * 2. We pass the "originalGitCommitSha" and the branch of the SOURCE
 * 3. Now we evaluate the comparison against your files to see if anything is "out of sync" or in "conflict" and if so we break out and tell user
 * 4. If you sandbox has a PR we want to compare your sandbox with the BASE (This being the GIT info your sanbox forked from)
 * 5. We pass the "originalGitCommitSha" and the branch of the BASE
 * 6. Now we evaluate the comparison against your files to see if anything is "out of sync" or in "conflict" and if so we break out and tell user
 */
export const loadGitSource: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  const sandbox = state.editor.currentSandbox!;
  state.git.isFetching = true;
  state.git.isExported = false;
  state.git.pr = null;

  if (!state.user || !state.user.integrations.github) {
    return;
  }

  // We go grab the current version of the source
  try {
    await actions.git._loadSourceSandbox();
  } catch (error) {
    actions.internal.handleError({
      error,
      message:
        'Could not load the source Sandbox for this GitHub sandbox, please refresh or report the issue.',
    });
    return;
  }

  try {
    state.git.permission = await effects.api.getGitRights(sandbox.id);
  } catch (error) {
    actions.internal.handleError({
      error,
      message:
        'Could not get information about your permissions, please refresh or report the issue.',
    });
    return;
  }

  // Now let us compare whatever has changed between our current
  // state and the source
  try {
    await actions.git._compareWithSource();
  } catch (error) {
    actions.internal.handleError({
      error,
      message:
        'We were not able to compare the content with the source, please refresh or report the issue.',
    });
    return;
  }

  if (state.git.gitState === SandboxGitState.SYNCED && sandbox.prNumber) {
    try {
      await actions.git._compareWithBase();
    } catch (error) {
      actions.internal.handleError({
        error,
        message:
          'We were not able to compare the content with the PR, please refresh or report the issue.',
      });
      return;
    }
  }

  actions.git._setGitChanges();
  state.git.isFetching = false;
};

export const createRepoClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  effects.analytics.track('GitHub - Create Repo');
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

  try {
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

    git.commitSha = null;
    state.git.isExported = true;
    state.currentModal = null;

    actions.editor.internal.forkSandbox({
      sandboxId: `github/${git.username}/${git.repo}/tree/${
        git.branch
      }/${git.path || ''}`,
    });
  } catch (error) {
    actions.internal.handleError({
      error,
      message:
        'Unable to create the repo. Please refresh and try again or report issue.',
    });
  }
};

export const importFromGithub: AsyncAction<string> = async (
  { state, effects, actions },
  sandboxUrl
) => {
  actions.modalClosed();
  state.currentModal = 'exportGithub';
  await actions.editor.internal.forkSandbox({
    sandboxId: sandboxUrl.replace('/s/', ''),
  });
  state.currentModal = null;
};

export const openSourceSandbox: Action = ({ state, effects }) => {
  effects.analytics.track('GitHub - Open Source Sandbox');
  const git = state.editor.currentSandbox!.baseGit
    ? state.editor.currentSandbox!.baseGit
    : state.editor.currentSandbox!.originalGit;

  effects.router.updateSandboxUrl({ git });
};

export const createCommitClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  effects.analytics.track('GitHub - Create Commit');
  const sandbox = state.editor.currentSandbox!;
  const git = state.git;

  git.isCommitting = true;

  try {
    if (git.gitState === SandboxGitState.SYNCED) {
      await actions.git._compareWithSource();

      if (sandbox.prNumber && git.gitState === SandboxGitState.SYNCED) {
        await actions.git._compareWithBase();
      }

      if (state.git.gitState !== SandboxGitState.SYNCED) {
        git.isCommitting = false;
        return;
      }
    }

    const changes = actions.git._getGitChanges();
    const commit = await effects.api.createGitCommit(
      sandbox.id,
      `${git.title}\n${git.description}`,
      changes,
      // If we have resolved a conflict and it is a PR source conflict, we need to commit
      // it with a reference to the conflicting sha as well
      git.gitState === SandboxGitState.RESOLVED_PR_BASE && git.baseCommitSha
        ? [git.sourceCommitSha!, git.baseCommitSha]
        : [git.sourceCommitSha!]
    );
    changes.added.forEach(change => {
      git.sourceModulesByPath[change.path] = change.content;
    });
    changes.modified.forEach(change => {
      git.sourceModulesByPath[change.path] = change.content;
    });
    changes.deleted.forEach(path => {
      delete git.sourceModulesByPath[path];
    });
    actions.git._setGitChanges();
    sandbox.originalGit!.commitSha = commit.sha;
    sandbox.originalGitCommitSha = commit.sha;
    state.git.isCommitting = false;
    state.git.title = '';
    state.git.description = '';
    state.git.conflicts = [];
    state.git.gitState = SandboxGitState.SYNCED;

    effects.notificationToast.success('Successfully created your commit');
  } catch (error) {
    state.git.isCommitting = false;
    actions.internal.handleError({
      error,
      message:
        'We were unable to create your commit. Please try again or report the issue.',
    });
  }
};

export const titleChanged: Action<string> = ({ state }, title) => {
  state.git.title = title;
};

export const descriptionChanged: Action<string> = ({ state }, description) => {
  state.git.description = description;
};

export const createPrClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  effects.analytics.track('GitHub - Open PR');
  const git = state.git;
  git.isCreatingPr = true;
  git.pr = null;
  const sandbox = state.editor.currentSandbox!;
  const { id } = sandbox;

  try {
    if (git.gitState === SandboxGitState.SYNCED) {
      await actions.git._compareWithSource();

      if (state.git.gitState !== SandboxGitState.SYNCED) {
        git.isCreatingPr = false;
        return;
      }
    }

    const changes = actions.git._getGitChanges();
    const pr = await effects.api.createGitPr(
      id,
      state.git.title,
      state.git.description,
      changes
    );

    changes.added.forEach(change => {
      git.sourceModulesByPath[change.path] = change.content;
    });
    changes.modified.forEach(change => {
      git.sourceModulesByPath[change.path] = change.content;
    });
    changes.deleted.forEach(path => {
      delete git.sourceModulesByPath[path];
    });
    actions.git._setGitChanges();

    sandbox.baseGit = {
      ...sandbox.originalGit,
    } as GitInfo;
    sandbox.baseGitCommitSha = sandbox.originalGit!.commitSha;
    sandbox.originalGit = {
      branch: pr.branch,
      commitSha: pr.commitSha,
      repo: pr.repo,
      username: pr.username,
      path: '',
    };
    sandbox.originalGitCommitSha = pr.commitSha;
    sandbox.prNumber = pr.number;
    git.pr = pr;
    git.isCreatingPr = false;
    git.title = '';
    git.description = '';
    state.git.conflicts = [];
    state.git.gitState = SandboxGitState.SYNCED;

    effects.notificationToast.add({
      title: 'Successfully created your PR',
      message: '',
      status: convertTypeToStatus('success'),
      actions: {
        primary: {
          label: 'Open PR',
          run: () => {
            effects.browser.openWindow(
              `https://github.com/${sandbox.baseGit!.username}/${
                sandbox.baseGit!.repo
              }/pull/${sandbox.prNumber!}`
            );
          },
        },
      },
    });
  } catch (error) {
    git.isCreatingPr = false;
    actions.internal.handleError({
      error,
      message:
        'We were unable to create your PR. Please try again or report the issue.',
    });
  }
};

export const updateGitChanges: Operator = pipe(
  debounce(500),
  mutate(({ actions }) => actions.git._setGitChanges())
);

export const resolveConflicts: AsyncAction<Module> = async (
  { state, actions, effects },
  module
) => {
  effects.analytics.track('GitHub - Resolve Conflicts');
  const conflict = state.git.conflicts.find(
    conflictItem => module.path === '/' + conflictItem.filename
  );

  if (conflict && module.code.indexOf('<<<<<<< Codesandbox') === -1) {
    state.git.conflicts.splice(state.git.conflicts.indexOf(conflict), 1);

    await actions.editor.codeSaved({
      moduleShortid: module.shortid,
      code: module.code,
      cbID: null,
    });

    actions.git._tryResolveConflict();
  }
};

export const addConflictedFile: AsyncAction<GitFileCompare> = async (
  { state, actions },
  conflict
) => {
  state.git.conflictsResolving.push(conflict.filename);
  await actions.files.createModulesByPath({
    files: {
      [conflict.filename]: { content: conflict.content!, isBinary: false },
    },
  });
  state.git.sourceModulesByPath['/' + conflict.filename] = conflict.content!;

  state.git.conflictsResolving.splice(
    state.git.conflictsResolving.indexOf(conflict.filename),
    1
  );
  state.git.conflicts.splice(state.git.conflicts.indexOf(conflict), 1);

  actions.git._tryResolveConflict();
};

export const ignoreConflict: Action<GitFileCompare> = (
  { state, actions },
  conflict
) => {
  state.git.conflicts.splice(state.git.conflicts.indexOf(conflict), 1);

  actions.git._tryResolveConflict();
};

export const deleteConflictedFile: AsyncAction<GitFileCompare> = async (
  { state, actions },
  conflict
) => {
  state.git.conflictsResolving.push(conflict.filename);
  const module = state.editor.modulesByPath['/' + conflict.filename];

  await actions.files.moduleDeleted({ moduleShortid: module.shortid });
  delete state.git.sourceModulesByPath['/' + conflict.filename];

  state.git.conflictsResolving.splice(
    state.git.conflictsResolving.indexOf(conflict.filename),
    1
  );
  state.git.conflicts.splice(state.git.conflicts.indexOf(conflict), 1);

  actions.git._tryResolveConflict();
};

export const diffConflictedFile: Action<GitFileCompare> = (
  { state, actions },
  conflict
) => {
  const module = state.editor.modulesByPath['/' + conflict.filename] as Module;

  actions.editor.setCode({
    moduleShortid: module.shortid,
    code: createDiff(module.code, conflict.content),
  });
};

export const resolveOutOfSync: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  effects.analytics.track('GitHub - Resolve out of sync');
  const git = state.git;
  const { added, deleted, modified } = git.outOfSyncUpdates;
  git.isResolving = true;
  if (added.length) {
    await actions.files.createModulesByPath({
      files: added.reduce((aggr, change) => {
        aggr[change.filename] = { content: change.content };

        return aggr;
      }, {}),
    });
    // We optimistically keep source in sync
    added.forEach(change => {
      git.sourceModulesByPath['/' + change.filename] = change.content!;
    });
  }

  if (deleted.length) {
    await Promise.all(
      deleted.map(change => {
        const module = state.editor.modulesByPath['/' + change.filename];

        return actions.files.moduleDeleted({ moduleShortid: module.shortid });
      })
    );
    // We optimistically keep source in sync
    deleted.forEach(change => {
      delete git.sourceModulesByPath['/' + change.filename];
    });
  }
  if (modified.length) {
    await Promise.all(
      modified.map(change => {
        const module = state.editor.modulesByPath['/' + change.filename];

        actions.editor.setCode({
          moduleShortid: module.shortid,
          code: change.content!,
        });
        return actions.editor.codeSaved({
          moduleShortid: module.shortid,
          code: change.content!,
          cbID: null,
        });
      })
    );
    // We optimistically keep source in sync
    modified.forEach(change => {
      git.sourceModulesByPath['/' + change.filename] = change.content!;
    });
  }

  const sandbox = state.editor.currentSandbox!;

  // When we have a PR and the source is out of sync with base, we need to create a commit to update it
  if (git.gitState === SandboxGitState.OUT_OF_SYNC_PR_BASE) {
    const changes: GitChanges = {
      added: added.map(change => ({
        path: change.filename,
        content: change.content!,
        encoding: 'utf-8',
      })),
      deleted: deleted.map(change => change.filename),
      modified: modified.map(change => ({
        path: change.filename,
        content: change.content!,
        encoding: 'utf-8',
      })),
    };
    const commit = await effects.api.createGitCommit(
      sandbox.id,
      `Update from ${sandbox.baseGit!.branch}`,
      changes,
      [git.sourceCommitSha!]
    );
    actions.git._setGitChanges();
    sandbox.originalGit!.commitSha = commit.sha;
    sandbox.originalGitCommitSha = commit.sha;

    // If working directly we just need to update the commitSha, as
    // we are already in sync now
  } else {
    await effects.api.saveGitOriginalCommitSha(
      sandbox.id,
      git.sourceCommitSha!
    );
    sandbox.originalGit!.commitSha = git.sourceCommitSha;
    sandbox.originalGitCommitSha = git.sourceCommitSha;
  }

  git.outOfSyncUpdates.added = [];
  git.outOfSyncUpdates.deleted = [];
  git.outOfSyncUpdates.modified = [];
  git.gitState = SandboxGitState.SYNCED;
  git.isResolving = false;
};

export const _setGitChanges: Action = ({ state }) => {
  const changes: {
    added: string[];
    deleted: string[];
    modified: string[];
  } = {
    added: [],
    deleted: [],
    modified: [],
  };

  state.editor.currentSandbox!.modules.forEach(module => {
    if (!(module.path in state.git.sourceModulesByPath)) {
      changes.added.push(module.path);
    } else if (
      !module.isBinary &&
      state.git.sourceModulesByPath[module.path] !== module.code
    ) {
      changes.modified.push(module.path);
    }
  });
  Object.keys(state.git.sourceModulesByPath).forEach(path => {
    if (!state.editor.modulesByPath[path]) {
      changes.deleted.push(path);
    }
  });
  state.git.gitChanges = changes;
};

export const _evaluateGitChanges: AsyncAction<
  GitFileCompare[],
  {
    changesCount: number;
    conflicts: GitFileCompare[];
  }
> = async ({ state }, changes) => {
  const conflicts = changes.reduce<GitFileCompare[]>((aggr, change) => {
    const path = '/' + change.filename;

    // We are in conflict if a file has been removed and it is still present
    // in the sandbox
    if (change.status === 'removed' && state.editor.modulesByPath[path]) {
      return aggr.concat(change);
    }

    // We are in conflict if a file has been deleted in the sandbox, but
    // is still present in the source
    if (
      (change.status === 'modified' || change.status === 'added') &&
      !state.editor.modulesByPath[path]
    ) {
      return aggr.concat(change);
    }

    // We are in conflict if the file exists in the sandbox, but
    // the contents is different than both the change and the
    if (
      (change.status === 'added' || change.status === 'modified') &&
      (state.editor.modulesByPath[path] as Module).code !== change.content &&
      (state.editor.modulesByPath[path] as Module).code !==
        state.git.sourceModulesByPath[path]
    ) {
      return aggr.concat(change);
    }

    return aggr;
  }, []);
  const toUpdate: {
    added: GitFileCompare[];
    deleted: GitFileCompare[];
    modified: GitFileCompare[];
  } = { added: [], deleted: [], modified: [] };

  if (changes.length) {
    state.git.outOfSyncUpdates = changes.reduce((aggr, change) => {
      // If the change is a conflict, we do not set it up for a Sandbox update, we need
      // to handle the conflict explicitly
      if (conflicts.includes(change)) {
        return aggr;
      }

      // When not a conflict we check if the changes differs from the Sandbox. Any changes
      // will update the Sandbox
      if (
        (change.status === 'added' &&
          !state.editor.modulesByPath['/' + change.filename]) ||
        (change.status === 'removed' &&
          state.editor.modulesByPath['/' + change.filename]) ||
        (change.status === 'modified' &&
          (state.editor.modulesByPath['/' + change.filename] as Module).code !==
            change.content)
      ) {
        aggr[change.status].push(change);
      }

      return aggr;
    }, toUpdate);
  }

  return {
    changesCount:
      toUpdate.added.length +
      toUpdate.modified.length +
      toUpdate.deleted.length,
    conflicts,
  };
};

export const _loadSourceSandbox: AsyncAction = async ({ state, effects }) => {
  const sandbox = state.editor.currentSandbox!;
  const sourceSandbox = await effects.api.getSandbox(
    `github/${sandbox.originalGit!.username}/${
      sandbox.originalGit!.repo
    }/tree/${sandbox.originalGitCommitSha!}/${sandbox.originalGit!.path}`
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
        aggr[path] = module.code;
      }

      return aggr;
    },
    {}
  );
};

export const _compareWithSource: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox!;
  const originalGitCommitSha = sandbox.originalGitCommitSha;
  const originalChanges = await effects.api.compareGit(
    sandbox.id,
    sandbox.originalGitCommitSha!,
    sandbox.originalGit!.branch,
    true
  );

  const updates = await actions.git._evaluateGitChanges(originalChanges.files);

  state.git.sourceCommitSha = originalChanges.headCommitSha;
  state.git.conflicts = updates.conflicts;

  if (updates.changesCount || updates.conflicts.length) {
    effects.notificationToast.add({
      message: `The sandbox is out of sync with "${
        sandbox.originalGit!.branch
      }" ${updates.conflicts.length ? 'and there are conflicts' : ''}`,
      title: 'Out of sync',
      status: convertTypeToStatus('notice'),
      sticky: false,
      actions: {
        primary: {
          label: 'Resolve',
          run: () => {
            actions.workspace.setWorkspaceItem({ item: 'github' });
          },
        },
        secondary: {
          label: 'See changes',
          run: () => {
            effects.browser.openWindow(
              `https://github.com/${sandbox.originalGit!.username}/${
                sandbox.originalGit!.repo
              }/compare/${originalGitCommitSha}...${
                sandbox.originalGit!.branch
              }`
            );
          },
        },
      },
    });
    effects.preview.refresh();
    state.git.gitState = updates.conflicts.length
      ? SandboxGitState.CONFLICT_SOURCE
      : SandboxGitState.OUT_OF_SYNC_SOURCE;
  } else {
    state.git.gitState = SandboxGitState.SYNCED;
  }
};

export const _compareWithBase: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox!;

  state.git.pr = await effects.api.getGitPr(sandbox.id, sandbox.prNumber!);
  state.git.sourceCommitSha = state.git.pr.commitSha;
  state.git.baseCommitSha = state.git.pr.baseCommitSha;

  const baseChanges = await effects.api.compareGit(
    sandbox.id,
    sandbox.originalGitCommitSha!,
    sandbox.baseGit!.branch,
    true
  );

  const updates = await actions.git._evaluateGitChanges(baseChanges.files);

  state.git.baseCommitSha = baseChanges.headCommitSha;
  state.git.conflicts = updates.conflicts;

  if (updates.changesCount || updates.conflicts.length) {
    effects.notificationToast.add({
      message: `The sandbox is out of sync with "${sandbox.baseGit!.branch}" ${
        updates.conflicts.length ? 'and there are conflicts' : ''
      }`,
      title: 'Out of sync',
      status: convertTypeToStatus('notice'),
      sticky: false,
      actions: {
        primary: {
          label: 'Resolve',
          run: () => {
            actions.workspace.setWorkspaceItem({ item: 'github' });
          },
        },
        secondary: {
          label: 'See changes',
          run: () => {
            effects.browser.openWindow(
              `https://github.com/${sandbox.originalGit!.username}/${
                sandbox.originalGit!.repo
              }/compare/${sandbox.baseGit!.branch}...${
                sandbox.originalGit!.branch
              }`
            );
          },
        },
      },
    });
    effects.preview.refresh();
    state.git.gitState = updates.conflicts.length
      ? SandboxGitState.CONFLICT_PR_BASE
      : SandboxGitState.OUT_OF_SYNC_PR_BASE;
  } else {
    state.git.gitState = SandboxGitState.SYNCED;
  }
};

export const _getGitChanges: Action<void, GitChanges> = ({ state }) => {
  const git = state.git;
  const sandbox = state.editor.currentSandbox!;

  return {
    added: git.gitChanges.added.map(path => {
      const module = sandbox.modules.find(
        moduleItem => moduleItem.path === path
      );

      return {
        path,
        content: module!.code,
        encoding: 'utf-8',
      };
    }),
    deleted: git.gitChanges.deleted,
    modified: git.gitChanges.modified.map(path => {
      const module = sandbox.modules.find(
        moduleItem => moduleItem.path === path
      );

      return {
        path,
        content: module!.code,
        encoding: 'utf-8',
      };
    }),
  };
};

export const _tryResolveConflict: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const git = state.git;
  actions.git._setGitChanges();

  if (git.conflicts.length === 0) {
    git.gitState =
      git.gitState === SandboxGitState.CONFLICT_PR_BASE
        ? SandboxGitState.RESOLVED_PR_BASE
        : SandboxGitState.RESOLVED_SOURCE;
  }

  // When the conflict is from a PR base and we just override it, we still have to create a commit to update the PR
  if (
    git.gitState === SandboxGitState.RESOLVED_PR_BASE &&
    !git.gitChanges.added.length &&
    !git.gitChanges.deleted.length &&
    !git.gitChanges.modified.length
  ) {
    state.git.isCommitting = true;
    const sandbox = state.editor.currentSandbox!;
    const changes = actions.git._getGitChanges();
    state.git.title = 'Resolve conflict';
    const commit = await effects.api.createGitCommit(
      sandbox.id,
      'Resolved conflict',
      changes,
      git.baseCommitSha
        ? [git.sourceCommitSha!, git.baseCommitSha]
        : [git.sourceCommitSha!]
    );
    sandbox.originalGit!.commitSha = commit.sha;
    sandbox.originalGitCommitSha = commit.sha;
    git.isCommitting = false;
    git.title = '';
    git.description = '';
    git.gitState = SandboxGitState.SYNCED;
  }
};
