import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import {
  GitChanges,
  GitFileCompare,
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

export const loadGitSource: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  const sandbox = state.editor.currentSandbox;
  state.git.isFetching = true;
  // We go grab the current version of the source
  await actions.git._loadSourceSandbox();

  state.git.permission = await effects.api.getGitRights(sandbox.id);

  // Now let us compare whatever has changed between our current
  // state and the source
  await actions.git._compareWithSource();

  if (state.git.gitState === SandboxGitState.SYNCED && sandbox.prNumber) {
    await actions.git._compareWithBase();
  }

  actions.git._setGitChanges();
  state.git.isFetching = false;
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

  git.commitSha = null;
  state.git.isExported = true;
  state.currentModal = null;
  effects.router.updateSandboxUrl({ git });
};

export const createCommitClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;
  const git = state.git;

  git.isCommitting = true;

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
    [git.sourceCommitSha]
  );
  changes.added.forEach(change => {
    git.sourceModulesByPath['/' + change.path] = change.content;
  });
  changes.modified.forEach(change => {
    git.sourceModulesByPath['/' + change.path] = change.content;
  });
  changes.deleted.forEach(path => {
    delete git.sourceModulesByPath['/' + path];
  });
  actions.git._setGitChanges();
  sandbox.originalGit.commitSha = commit.sha;
  sandbox.originalGitCommitSha = commit.sha;
  state.git.isCommitting = false;
  state.git.title = '';
  state.git.description = '';
  state.git.conflicts = [];
  state.git.gitState = SandboxGitState.SYNCED;
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
  const git = state.git;
  git.isCreatingPr = true;
  git.pr = null;
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  const { id } = sandbox;

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
    git.sourceModulesByPath['/' + change.path] = change.content;
  });
  changes.modified.forEach(change => {
    git.sourceModulesByPath['/' + change.path] = change.content;
  });
  changes.deleted.forEach(path => {
    delete git.sourceModulesByPath['/' + path];
  });
  actions.git._setGitChanges();

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
};

export const updateGitChanges: Operator = pipe(
  debounce(500),
  mutate(({ actions }) => actions.git._setGitChanges())
);

export const resolveConflicts: Action<Module> = (
  { state, actions },
  module
) => {
  const conflict = state.git.conflicts.find(
    conflictItem => module.path === '/' + conflictItem.filename
  );

  if (conflict && module.code.indexOf('<<<<<<< Codesandbox') === -1) {
    state.git.conflicts.splice(state.git.conflicts.indexOf(conflict), 1);

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
      [conflict.filename]: { content: conflict.content, isBinary: false },
    },
  });
  state.git.sourceModulesByPath['/' + conflict.filename] = conflict.content;

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
      git.sourceModulesByPath['/' + change.filename] = change.content;
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
        // TODO: This one needs to trigger a LIVE code change as well, better way to do it?
        actions.editor.codeChanged({
          moduleShortid: module.shortid,
          code: change.content,
        });
        return actions.editor.codeSaved({
          moduleShortid: module.shortid,
          code: change.content,
          cbID: null,
        });
      })
    );
    // We optimistically keep source in sync
    modified.forEach(change => {
      git.sourceModulesByPath['/' + change.filename] = change.content;
    });
  }

  // When we have a PR and the source is out of sync, we need to create a PR to update it
  if (git.pr && git.gitState === SandboxGitState.OUT_OF_SYNC_SOURCE) {
    const sandbox = state.editor.currentSandbox;
    const changes: GitChanges = {
      added: added.map(change => ({
        path: change.filename,
        content: change.content,
        encoding: 'utf-8',
      })),
      deleted: deleted.map(change => change.filename),
      modified: modified.map(change => ({
        path: change.filename,
        content: change.content,
        encoding: 'utf-8',
      })),
    };
    const commit = await effects.api.createGitCommit(
      sandbox.id,
      `Update from ${sandbox.baseGit.branch}`,
      changes,
      [git.sourceCommitSha]
    );
    actions.git._setGitChanges();
    sandbox.originalGit.commitSha = commit.sha;
    sandbox.originalGitCommitSha = commit.sha;

    // If working directly we just need to update the commitSha, as
    // we are already in sync now
  } else {
    // Make call to server to update commitSha
  }

  git.outOfSyncUpdates.added = [];
  git.outOfSyncUpdates.deleted = [];
  git.outOfSyncUpdates.modified = [];
  git.gitState = SandboxGitState.SYNCED;
  git.isResolving = false;
};

export const _setGitChanges: Action = ({ state }) => {
  const changes = {
    added: [],
    deleted: [],
    modified: [],
  };

  state.editor.currentSandbox.modules.forEach(module => {
    if (!state.git.sourceModulesByPath[module.path]) {
      changes.added.push(module.path);
    } else if (state.git.sourceModulesByPath[module.path] !== module.code) {
      changes.modified.push(module.path);
    }
  });
  state.editor.sandboxes[state.git.sourceSandboxId].modules.forEach(module => {
    if (!state.editor.modulesByPath[module.path]) {
      changes.deleted.push(module.path);
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
  const conflicts = changes.reduce((aggr, change) => {
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
      // When working directly we do an additional check to avoid getting a conflict
      (!state.git.pr && (state.editor.modulesByPath[path] as Module)).code !==
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
  const sandbox = state.editor.currentSandbox;
  const sourceSandbox = await effects.api.getSandbox(
    `github/${sandbox.originalGit.username}/${sandbox.originalGit.repo}/tree/${sandbox.originalGitCommitSha}`
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
  const sandbox = state.editor.currentSandbox;
  const originalGitCommitSha = sandbox.originalGitCommitSha;
  const originalChanges = await effects.api.compareGit(
    sandbox.id,
    sandbox.originalGitCommitSha,
    sandbox.originalGit.branch,
    true
  );

  const updates = await actions.git._evaluateGitChanges(originalChanges.files);

  state.git.sourceCommitSha = originalChanges.headCommitSha;
  state.git.conflicts = updates.conflicts;

  if (updates.changesCount || updates.conflicts.length) {
    effects.notificationToast.add({
      message: `The sandbox is out of sync with "${sandbox.baseGit.branch}" ${
        updates.conflicts.length ? 'and there are conflicts' : ''
      }`,
      title: 'Out of sync',
      status: convertTypeToStatus('notice'),
      sticky: false,
      actions: {
        primary: [
          {
            label: 'Resolve',
            run: () => {
              actions.workspace.setWorkspaceItem({ item: 'github' });
            },
          },
          {
            label: 'See changes',
            run: () => {
              effects.browser.openWindow(
                `https://github.com/${sandbox.originalGit.username}/${sandbox.originalGit.repo}/compare/${originalGitCommitSha}...${sandbox.originalGit.branch}`
              );
            },
          },
        ],
      },
    });
    effects.preview.refresh();
    if (sandbox.prNumber) {
      state.git.gitState = updates.conflicts.length
        ? SandboxGitState.CONFLICT_PR
        : SandboxGitState.OUT_OF_SYNC_PR;
    } else {
      state.git.gitState = updates.conflicts.length
        ? SandboxGitState.CONFLICT_SOURCE
        : SandboxGitState.OUT_OF_SYNC_SOURCE;
    }
  } else {
    state.git.gitState = SandboxGitState.SYNCED;
  }
};

export const _compareWithBase: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;

  state.git.pr = await effects.api.getGitPr(sandbox.id, sandbox.prNumber);

  if (state.git.pr.mergeableState === 'clean') {
    return;
  }

  const baseChanges = await effects.api.compareGit(
    sandbox.id,
    sandbox.originalGitCommitSha,
    sandbox.baseGit.branch,
    true
  );

  const updates = await actions.git._evaluateGitChanges(baseChanges.files);

  state.git.baseCommitSha = baseChanges.headCommitSha;
  state.git.conflicts = updates.conflicts;

  if (updates.changesCount || updates.conflicts.length) {
    effects.notificationToast.add({
      message: `The sandbox is out of sync with "${sandbox.baseGit.branch}" ${
        updates.conflicts.length ? 'and there are conflicts' : ''
      }`,
      title: 'Out of sync',
      status: convertTypeToStatus('notice'),
      sticky: false,
      actions: {
        primary: [
          {
            label: 'Resolve',
            run: () => {
              actions.workspace.setWorkspaceItem({ item: 'github' });
            },
          },
          {
            label: 'See changes',
            run: () => {
              effects.browser.openWindow(
                `https://github.com/${sandbox.originalGit.username}/${sandbox.originalGit.repo}/compare/${sandbox.baseGit.branch}...${sandbox.originalGit.branch}`
              );
            },
          },
        ],
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

export const _getGitChanges: Action<void, GitChanges> = ({ state }) => {
  const git = state.git;
  const sandbox = state.editor.currentSandbox;

  return {
    added: git.gitChanges.added.map(path => {
      const module = sandbox.modules.find(
        moduleItem => moduleItem.path === path
      );

      return {
        path: path.substr(1),
        content: module.code,
        encoding: 'utf-8',
      };
    }),
    deleted: git.gitChanges.deleted,
    modified: git.gitChanges.modified.map(path => {
      const module = sandbox.modules.find(
        moduleItem => moduleItem.path === path
      );

      return {
        path: path.substr(1),
        content: module.code,
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
    state.git.isCommitting = true;
    const sandbox = state.editor.currentSandbox;
    const changes = actions.git._getGitChanges();
    const commit = await effects.api.createGitCommit(
      sandbox.id,
      'Resolved conflict',
      changes,
      [git.sourceCommitSha].concat(git.baseCommitSha || [])
    );
    changes.added.forEach(change => {
      git.sourceModulesByPath['/' + change.path] = change.content;
    });
    changes.modified.forEach(change => {
      git.sourceModulesByPath['/' + change.path] = change.content;
    });
    changes.deleted.forEach(path => {
      delete git.sourceModulesByPath['/' + path];
    });
    actions.git._setGitChanges();
    sandbox.originalGit.commitSha = commit.sha;
    sandbox.originalGitCommitSha = commit.sha;
    git.isCommitting = false;
    git.title = '';
    git.description = '';
    git.gitState = SandboxGitState.SYNCED;
  }
};
