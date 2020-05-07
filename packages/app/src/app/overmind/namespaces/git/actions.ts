import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import {
  GitChanges,
  GitFileCompare,
  GitInfo,
  SandboxGitState,
} from '@codesandbox/common/lib/types';
import { convertTypeToStatus } from '@codesandbox/common/lib/utils/notifications';
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

export const loadGitSource: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  const sandbox = state.editor.currentSandbox;

  await actions.git._loadSourceSandbox();

  state.git.permission = await effects.api.getGitRights(sandbox.id);

  actions.git._setGitChanges();

  const originalChanges = await effects.api.compareGit(
    sandbox.id,
    sandbox.originalGitCommitSha,
    sandbox.originalGit.branch,
    true
  );

  const isSourceConflict = actions.git._evaluateGitChanges(originalChanges);

  if (isSourceConflict) {
    state.git.gitState = SandboxGitState.CONFLICT_SOURCE;
  } else if (originalChanges.length) {
    effects.notificationToast.add({
      message: `The sandbox has been synced from "${sandbox.originalGit.branch}"`,
      title: 'Sandbox synced',
      status: convertTypeToStatus('notice'),
      sticky: true,
      actions: {
        primary: [
          {
            label: 'See changes',
            run: () => {
              effects.browser.openWindow(
                `https://github.com/${sandbox.originalGit.username}/${sandbox.originalGit.repo}/compare/${sandbox.originalGitCommitSha}...${sandbox.originalGit.branch}`
              );
            },
          },
        ],
      },
    });
  }

  if (sandbox.prNumber) {
    state.git.pr = await effects.api.getGitPr(sandbox.id, sandbox.prNumber);

    const baseChanges = await effects.api.compareGit(
      sandbox.id,
      sandbox.baseGit.branch,
      sandbox.originalGit.branch
    );

    const isPrConflict = actions.git._evaluateGitChanges(baseChanges);

    if (isPrConflict) {
      state.git.gitState = SandboxGitState.CONFLICT_PR;
    } else if (originalChanges.length) {
      effects.notificationToast.add({
        message: `The sandbox has been synced from "${sandbox.baseGit.branch}"`,
        title: 'Sandbox synced',
        status: convertTypeToStatus('notice'),
        sticky: true,
        actions: {
          primary: [
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
    }
  }

  state.git.gitState = SandboxGitState.SYNCED;
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

export const createCommitClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const { git } = state;
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  const { id } = sandbox;

  git.commit = null;
  git.isCommitting = true;
  state.currentModal = 'commit';

  await actions.editor.saveClicked();

  const changes: GitChanges = {
    added: git.gitChanges.added.map(path => {
      const module = sandbox.modules.find(
        moduleItem => moduleItem.path === path
      );

      return {
        path,
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
        path,
        content: module.code,
        encoding: 'utf-8',
      };
    }),
  };
  const commit = await effects.api.createGitCommit(
    id,
    git.description,
    changes
  );
  state.git.commit = commit;
  await actions.git._loadSourceSandbox();
  actions.git._setGitChanges();
  state.git.isCommitting = false;
  state.git.description = '';
};

export const titleChanged: Action<string> = ({ state }, title) => {
  state.git.title = title;
};

export const descriptionChanged: Action<string> = ({ state }, description) => {
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
    state.git.title,
    state.git.description
  );

  sandbox.originalGit = {
    branch: pr.branch,
    commitSha: pr.commitSha,
    repo: pr.repo,
    username: pr.username,
    path: '',
  };
  state.git.pr = pr;
  state.git.isCreatingPr = false;
  state.git.title = '';
  state.git.description = '';
};

export const updateGitChanges: Operator = pipe(
  debounce(500),
  mutate(({ actions }) => actions.git._setGitChanges())
);

export const updatePrClicked: Action = () => {};

export const _setGitChanges: Action = ({ state }) => {
  const changes = {
    added: [],
    deleted: [],
    modified: [],
  };

  state.editor.currentSandbox.modules.forEach(module => {
    if (!state.git.sourceModulesByPath[module.path]) {
      changes.added.push(module.path);
    } else if (
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
};

export const _evaluateGitChanges: AsyncAction<
  GitFileCompare[],
  boolean
> = async ({ state, actions }, changes) => {
  const sandbox = state.editor.currentSandbox;
  const hasConflict = changes.reduce((aggr, change) => {
    if (aggr) return aggr;

    return (
      state.git.gitChanges.added.includes(change.filename) ||
      state.git.gitChanges.deleted.includes(change.filename) ||
      state.git.gitChanges.modified.includes(change.filename)
    );
  }, false);

  if (hasConflict) {
    return true;
  }

  if (changes.length) {
    const { added, deleted, modified } = changes.reduce<{
      added: GitFileCompare[];
      deleted: GitFileCompare[];
      modified: GitFileCompare[];
    }>(
      (aggr, change) => {
        aggr[change.status].push(change);
        return aggr;
      },
      { added: [], deleted: [], modified: [] }
    );
    if (added.length) {
      await actions.files.createModulesByPath({
        files: added.reduce((aggr, change) => {
          aggr[change.filename] = { content: change.content };

          return aggr;
        }, {}),
      });
    }
    if (deleted.length) {
      await Promise.all(
        deleted.map(change => {
          const moduleShortid = sandbox.modules.find(
            module => module.path === change.filename
          )!.shortid;

          return actions.files.moduleDeleted({ moduleShortid });
        })
      );
    }
    if (modified.length) {
      await Promise.all(
        modified.map(change => {
          const moduleShortid = sandbox.modules.find(
            module => module.path === change.filename
          )!.shortid;

          return actions.editor.codeSaved({
            moduleShortid,
            code: change.content,
            cbID: null,
          });
        })
      );
    }
  }

  return false;
};

export const _loadSourceSandbox: AsyncAction = async ({ state, effects }) => {
  const sandbox = state.editor.currentSandbox;
  const sourceSandbox = await effects.api.getSandbox(
    `github/${sandbox.originalGit.username}/${sandbox.originalGit.repo}/tree/${sandbox.originalGit.branch}`
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
};
