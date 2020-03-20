import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import getTemplate from '@codesandbox/common/lib/templates';
import {
  CommentsFilterOption,
  EnvironmentVariable,
  ModuleCorrection,
  ModuleError,
  ModuleTab,
  WindowOrientation,
} from '@codesandbox/common/lib/types';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import { COMMENTS } from '@codesandbox/common/lib/utils/feature-flags';
import { convertTypeToStatus } from '@codesandbox/common/lib/utils/notifications';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import {
  Authorization,
  CollaboratorFragment,
  Comment,
  CommentThread,
  InvitationFragment,
} from 'app/graphql/types';
import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp, withOwnedSandbox } from 'app/overmind/factories';
import {
  addDevToolsTab as addDevToolsTabUtil,
  closeDevToolsTab as closeDevToolsTabUtil,
  moveDevToolsTab as moveDevToolsTabUtil,
} from 'app/pages/Sandbox/Editor/Content/utils';
import { convertAuthorizationToPermissionType } from 'app/utils/authorization';
import { clearCorrectionsFromAction } from 'app/utils/corrections';
import history from 'app/utils/history';
import { Selection, TextOperation } from 'ot';
import { json } from 'overmind';

import eventToTransform from '../../utils/event-to-transform';
import { SERVER } from '../../utils/items';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const onNavigateAway: Action = () => {};

export const addNpmDependency: AsyncAction<{
  name: string;
  version?: string;
  isDev?: boolean;
}> = withOwnedSandbox(
  async ({ actions, effects, state }, { name, version, isDev }) => {
    effects.analytics.track('Add NPM Dependency');
    state.currentModal = null;
    let newVersion = version;

    if (!newVersion) {
      const dependency = await effects.api.getDependency(name);
      newVersion = dependency.version;
    }

    await actions.editor.internal.addNpmDependencyToPackageJson({
      name,
      version: newVersion,
      isDev: Boolean(isDev),
    });

    effects.preview.executeCodeImmediately();
  }
);

export const npmDependencyRemoved: AsyncAction<string> = withOwnedSandbox(
  async ({ actions, effects }, name) => {
    effects.analytics.track('Remove NPM Dependency');

    await actions.editor.internal.removeNpmDependencyFromPackageJson(name);

    effects.preview.executeCodeImmediately();
  }
);

export const sandboxChanged: AsyncAction<{ id: string }> = withLoadApp<{
  id: string;
}>(async ({ state, actions, effects }, { id }) => {
  // This happens when we fork. This can be avoided with state first routing
  if (state.editor.isForkingSandbox && state.editor.currentSandbox) {
    effects.vscode.openModule(state.editor.currentModule);

    await actions.editor.internal.initializeSandbox(
      state.editor.currentSandbox
    );

    state.editor.isForkingSandbox = false;
    return;
  }

  await effects.vscode.closeAllTabs();

  state.editor.error = null;

  let newId = id;

  newId = actions.editor.internal.ensureSandboxId(newId);

  effects.browser.storage.set('currentSandboxId', newId);

  const hasExistingSandbox = Boolean(state.editor.currentId);

  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }

  state.editor.isLoading = !hasExistingSandbox;
  state.editor.notFound = false;

  const url = new URL(document.location.href);
  const invitationToken = url.searchParams.get('ts');

  if (invitationToken) {
    // This user came here with an invitation token, which can be sent to the email to make
    // the user a collaborator
    if (!state.hasLogIn) {
      // Redirect to sign in URL, which then redirects back to this after
      history.push(signInPageUrl(document.location.href));
      return;
    }

    try {
      await effects.gql.mutations.redeemSandboxInvitation({
        sandboxId: newId,
        invitationToken,
      });

      // Timeout to prevent that we load the whole sandbox twice at the same time
      setTimeout(() => {
        // Remove the invite from the url
        url.searchParams.delete('ts');
        history.replace(url.pathname);
      }, 3000);
    } catch (error) {
      if (
        !error.message.includes('Cannot redeem token, invitation not found')
      ) {
        actions.internal.handleError({
          error,
          message: 'Something went wrong with redeeming invitation token',
        });
      }
    }
  }

  try {
    const sandbox = await effects.api.getSandbox(newId);

    actions.internal.setCurrentSandbox(sandbox);
    actions.workspace.openDefaultItem();
  } catch (error) {
    state.editor.notFound = true;
    let detail = error.response?.data?.errors?.detail;
    if (Array.isArray(detail)) {
      detail = detail[0];
    }
    state.editor.error = detail || error.message;
    state.editor.isLoading = false;
    return;
  }

  const sandbox = state.editor.currentSandbox!;

  await effects.vscode.changeSandbox(sandbox, fs => {
    state.editor.modulesByPath = fs;
  });

  if (sandbox.featureFlags?.containerLsp && !sandbox.owned) {
    effects.vscode.setReadOnly(true);
    effects.notificationToast.add({
      message:
        'This Sandbox is running an experiment. You have to fork it before you can make any changes',
      title: 'Experimental Sandbox',
      status: convertTypeToStatus('notice'),
      sticky: true,
      actions: {
        primary: [
          {
            label: 'Fork',
            run: () => {
              actions.editor.forkSandboxClicked();
            },
          },
        ],
      },
    });
  }

  actions.internal.ensurePackageJSON();

  await actions.editor.internal.initializeSandbox(sandbox);

  if (
    hasPermission(sandbox.authorization, 'write_code') &&
    !state.live.isLive
  ) {
    actions.files.internal.recoverFiles();
  } else if (state.live.isLive) {
    await effects.live.sendModuleStateSyncRequest();
  }

  effects.vscode.openModule(state.editor.currentModule);

  if (COMMENTS) {
    try {
      const {
        sandbox: sandboxComments,
      } = await effects.gql.queries.commentThreads({
        sandboxId: sandbox.id,
      });

      if (!sandboxComments || !sandboxComments.commentThreads) {
        return;
      }

      state.editor.commentThreads[
        sandbox.id
      ] = sandboxComments.commentThreads.reduce<{
        [id: string]: CommentThread;
      }>((aggr, commentThread, index) => {
        aggr[commentThread.id] = commentThread;
        if (index === 0) {
          aggr[commentThread.id].reference = {
            id: '123',
            resource: '/src/App.js',
            type: 'code',
            meta: {
              code: '<div>hello world</div>',
              range: [40, 60],
            },
          };
        }

        return aggr;
      }, {});
    } catch (e) {
      state.editor.commentThreads[sandbox.id] = {};
      effects.notificationToast.add({
        status: NotificationStatus.NOTICE,
        message: `There as a problem getting the sandbox comments`,
      });
    }
  }

  state.editor.isLoading = false;
});

export const contentMounted: Action = ({ state, effects }) => {
  effects.browser.onUnload(event => {
    if (!state.editor.isAllModulesSynced && !state.editor.isForkingSandbox) {
      const returnMessage =
        'You have not saved all your modules, are you sure you want to close this tab?';

      event.returnValue = returnMessage; // eslint-disable-line

      return returnMessage;
    }

    return null;
  });
};

export const resizingStarted: Action = ({ state }) => {
  state.editor.isResizing = true;
};

export const resizingStopped: Action = ({ state }) => {
  state.editor.isResizing = false;
};

export const codeSaved: AsyncAction<{
  code: string;
  moduleShortid: string;
  cbID: string | null;
}> = withOwnedSandbox(
  async ({ actions }, { code, moduleShortid, cbID }) => {
    actions.editor.internal.saveCode({
      code,
      moduleShortid,
      cbID,
    });
  },
  async ({ effects }, { cbID }) => {
    if (cbID) {
      effects.vscode.callCallbackError(cbID);
    }
  },
  'write_code'
);

export const onOperationApplied: Action<{
  moduleShortid: string;
  code: string;
}> = ({ state, effects, actions }, { code, moduleShortid }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  actions.editor.internal.setStateModuleCode({
    module,
    code,
  });

  actions.editor.internal.updatePreviewCode();

  if (module.savedCode !== null && module.code === module.savedCode) {
    effects.vscode.revertModule(module);
  }
};

export const codeChanged: Action<{
  moduleShortid: string;
  code: string;
  event?: any;
}> = ({ effects, state, actions }, { code, event, moduleShortid }) => {
  effects.analytics.trackOnce('Change Code');

  if (!state.editor.currentSandbox) {
    return;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  // module.code !== code check is there to make sure that we don't end up sending
  // duplicate updates to live. module.code === code only when VSCode detected a change
  // from the filesystem (fs changed, vscode sees it, sends update). If this happens we
  // never want to send that code update, since this actual code change goes through this
  // specific code flow already.
  if (state.live.isLive && module.code !== code) {
    let operation: TextOperation;
    if (event) {
      operation = eventToTransform(event, module.code).operation;
    } else {
      operation = getTextOperation(module.code, code);
    }

    effects.live.sendCodeUpdate(moduleShortid, operation);

    const comments = state.editor.fileComments[module.path] || [];
    comments.forEach(comment => {
      const range = new Selection.Range(...comment.range);
      const newRange = range.transform(operation);
      const commentThread =
        state.editor.commentThreads[state.editor.currentSandbox.id][
          comment.commentThreadId
        ];
      if (commentThread.reference) {
        commentThread.reference.meta.range = [newRange.anchor, newRange.head];
      }
    });
  }

  actions.editor.internal.setStateModuleCode({
    module,
    code,
  });
  if (module.savedCode !== null && module.code === module.savedCode) {
    effects.vscode.revertModule(module);
  }

  const { isServer } = getTemplate(state.editor.currentSandbox.template);

  if (!isServer && state.preferences.settings.livePreviewEnabled) {
    actions.editor.internal.updatePreviewCode();
  }
};

export const saveClicked: AsyncAction = withOwnedSandbox(
  async ({ state, effects, actions }) => {
    const sandbox = state.editor.currentSandbox;

    if (!sandbox) {
      return;
    }

    try {
      const changedModules = sandbox.modules.filter(module =>
        state.editor.changedModuleShortids.includes(module.shortid)
      );

      const updatedModules = await effects.api.saveModules(
        sandbox.id,
        changedModules
      );

      updatedModules.forEach(updatedModule => {
        const module = sandbox.modules.find(
          moduleItem => moduleItem.shortid === updatedModule.shortid
        );

        if (module) {
          module.insertedAt = updatedModule.insertedAt;
          module.updatedAt = updatedModule.updatedAt;

          module.savedCode =
            updatedModule.code === module.code ? null : updatedModule.code;

          effects.vscode.sandboxFsSync.writeFile(
            state.editor.modulesByPath,
            module
          );
          effects.moduleRecover.remove(sandbox.id, module);
        } else {
          // We might not have the module, as it was created by the server. In
          // this case we put it in. There is an edge case here where the user
          // might delete the module while it is being updated, but it will very
          // likely not happen
          sandbox.modules.push(updatedModule);
        }
      });

      if (
        sandbox.originalGit &&
        state.workspace.openedWorkspaceItem === 'github'
      ) {
        actions.git.internal.fetchGitChanges();
      }

      effects.preview.executeCodeImmediately();
    } catch (error) {
      actions.internal.handleError({
        message: 'There was a problem with saving the files, please try again',
        error,
      });
    }
  }
);

export const createZipClicked: Action = ({ state, effects }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  effects.zip.download(state.editor.currentSandbox);
};

export const forkExternalSandbox: AsyncAction<{
  sandboxId: string;
  openInNewWindow?: boolean;
  body?: { collectionId: string };
}> = async ({ effects, state }, { sandboxId, openInNewWindow, body }) => {
  effects.analytics.track('Fork Sandbox', { type: 'external' });

  const forkedSandbox = await effects.api.forkSandbox(sandboxId, body);

  state.editor.sandboxes[forkedSandbox.id] = forkedSandbox;
  effects.router.updateSandboxUrl(forkedSandbox, { openInNewWindow });
};

export const forkSandboxClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  await actions.editor.internal.forkSandbox({
    sandboxId: state.editor.currentSandbox.id,
  });
};

export const likeSandboxToggled: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  if (state.editor.sandboxes[id].userLiked) {
    state.editor.sandboxes[id].likeCount--;
    await effects.api.unlikeSandbox(id);
  } else {
    state.editor.sandboxes[id].likeCount++;
    await effects.api.likeSandbox(id);
  }

  state.editor.sandboxes[id].userLiked = !state.editor.sandboxes[id].userLiked;
};

export const moduleSelected: Action<
  | {
      // Id means it is coming from Explorer
      id: string;
      path?: undefined;
    }
  | {
      // Path means it is coming from VSCode
      id?: undefined;
      path: string;
    }
> = ({ actions, effects, state }, { id, path }) => {
  effects.analytics.track('Open File');

  state.editor.hasLoadedInitialModule = true;

  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  try {
    const module = path
      ? effects.utils.resolveModule(
          path.replace(/^\/sandbox\//, ''),
          sandbox.modules,
          sandbox.directories
        )
      : sandbox.modules.filter(moduleItem => moduleItem.id === id)[0];

    if (module.shortid === state.editor.currentModuleShortid) {
      return;
    }

    actions.editor.internal.setCurrentModule(module);

    if (state.live.isLive && state.live.liveUser && state.live.roomInfo) {
      effects.vscode.updateUserSelections(
        module,
        actions.live.internal.getSelectionsForModule(module)
      );
      state.live.liveUser.currentModuleShortid = module.shortid;

      if (state.live.followingUserId) {
        const followingUser = state.live.roomInfo.users.find(
          u => u.id === state.live.followingUserId
        );

        if (
          followingUser &&
          followingUser.currentModuleShortid !== module.shortid
        ) {
          // Reset following as this is a user change module action
          actions.live.onStopFollow();
        }
      }

      effects.live.sendUserCurrentModule(module.shortid);

      if (!state.editor.isInProjectView) {
        actions.editor.internal.updatePreviewCode();
      }
    }
  } catch (error) {
    // You jumped to a file not in the Sandbox, for example typings
    state.editor.currentModuleShortid = null;
  }
};

export const clearModuleSelected: Action = ({ state }) => {
  state.editor.currentModuleShortid = null;
};

export const moduleDoubleClicked: Action = ({ state, effects }) => {
  effects.vscode.runCommand('workbench.action.keepEditor');

  const { currentModule } = state.editor;
  const tabs = state.editor.tabs as ModuleTab[];
  const tab = tabs.find(
    tabItem => tabItem.moduleShortid === currentModule.shortid
  );

  if (tab) {
    tab.dirty = false;
  }
};

export const tabClosed: Action<number> = ({ state, actions }, tabIndex) => {
  if (state.editor.tabs.length > 1) {
    actions.internal.closeTabByIndex(tabIndex);
  }
};

export const tabMoved: Action<{
  prevIndex: number;
  nextIndex: number;
}> = ({ state }, { prevIndex, nextIndex }) => {
  const { tabs } = state.editor;
  const tab = json(tabs[prevIndex]);

  state.editor.tabs.splice(prevIndex, 1);
  state.editor.tabs.splice(nextIndex, 0, tab);
};

export const prettifyClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  effects.analytics.track('Prettify Code');
  const module = state.editor.currentModule;
  if (!module.id) {
    return;
  }
  const newCode = await effects.prettyfier.prettify(
    module.id,
    module.title,
    module.code || ''
  );

  actions.editor.codeChanged({
    code: newCode,
    moduleShortid: module.shortid,
  });
};

// TODO(@CompuIves): Look into whether we even want to call this function.
// We can probably call the dispatch from the bundler itself instead.
export const errorsCleared: Action = ({ state, effects }) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }

  if (state.editor.errors.length) {
    state.editor.errors.forEach(error => {
      try {
        const module = resolveModule(
          error.path,
          sandbox.modules,
          sandbox.directories
        );
        module.errors = [];
      } catch (e) {
        // Module is probably somewhere in eg. /node_modules which is not
        // in the store
      }
    });
    state.editor.errors = [];
    effects.vscode.setErrors(state.editor.errors);
  }
};

export const toggleStatusBar: Action = ({ state }) => {
  state.editor.statusBar = !state.editor.statusBar;
};

export const projectViewToggled: Action = ({ state, actions }) => {
  state.editor.isInProjectView = !state.editor.isInProjectView;
  actions.editor.internal.updatePreviewCode();
};

export const frozenUpdated: AsyncAction<{ frozen: boolean }> = async (
  { state, effects },
  { frozen }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  state.editor.currentSandbox.isFrozen = frozen;

  await effects.api.saveFrozen(state.editor.currentSandbox.id, frozen);
};

export const quickActionsOpened: Action = ({ state }) => {
  state.editor.quickActionsOpen = true;
};

export const quickActionsClosed: Action = ({ state }) => {
  state.editor.quickActionsOpen = false;
};

export const setPreviewContent: Action = () => {};

export const togglePreviewContent: Action = ({ state, effects }) => {
  state.editor.previewWindowVisible = !state.editor.previewWindowVisible;
  effects.vscode.resetLayout();
};

export const currentTabChanged: Action<{
  tabId: string;
}> = ({ state }, { tabId }) => {
  state.editor.currentTabId = tabId;
};

export const discardModuleChanges: Action<{
  moduleShortid: string;
}> = ({ state, effects, actions }, { moduleShortid }) => {
  effects.analytics.track('Code Discarded');

  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }

  const module = sandbox.modules.find(
    moduleItem => moduleItem.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  module.updatedAt = new Date().toString();
  effects.vscode.revertModule(module);
};

export const fetchEnvironmentVariables: AsyncAction = async ({
  state,
  effects,
}) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  state.editor.currentSandbox.environmentVariables = await effects.api.getEnvironmentVariables(
    state.editor.currentSandbox.id
  );
};

export const updateEnvironmentVariables: AsyncAction<EnvironmentVariable> = async (
  { effects, state },
  environmentVariable
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  state.editor.currentSandbox.environmentVariables = await effects.api.saveEnvironmentVariable(
    state.editor.currentSandbox.id,
    environmentVariable
  );

  effects.codesandboxApi.restartSandbox();
};

export const deleteEnvironmentVariable: AsyncAction<{
  name: string;
}> = async ({ state, effects }, { name }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const { id } = state.editor.currentSandbox;

  state.editor.currentSandbox.environmentVariables = await effects.api.deleteEnvironmentVariable(
    id,
    name
  );
  effects.codesandboxApi.restartSandbox();
};

/**
 * This will let the user know on fork that some secrets need to be set if there are any empty ones
 */
export const showEnvironmentVariablesNotification: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  await actions.editor.fetchEnvironmentVariables();

  const environmentVariables = sandbox.environmentVariables!;
  const emptyVarCount = Object.keys(environmentVariables).filter(
    key => !environmentVariables[key]
  ).length;
  if (emptyVarCount > 0) {
    effects.notificationToast.add({
      status: NotificationStatus.NOTICE,
      title: 'Unset Secrets',
      message: `This sandbox has ${emptyVarCount} secrets that need to be set. You can set them in the server tab.`,
      actions: {
        primary: [
          {
            label: 'Open Server Tab',
            run: () => {
              actions.workspace.setWorkspaceItem({ item: SERVER.id });
            },
          },
        ],
      },
    });
  }
};

export const toggleEditorPreviewLayout: Action = ({ state, effects }) => {
  const currentOrientation = state.editor.previewWindowOrientation;

  state.editor.previewWindowOrientation =
    currentOrientation === WindowOrientation.VERTICAL
      ? WindowOrientation.HORIZONTAL
      : WindowOrientation.VERTICAL;

  effects.vscode.resetLayout();
};

export const previewActionReceived: Action<any> = (
  { actions, effects, state },
  action
) => {
  switch (action.action) {
    case 'notification':
      effects.notificationToast.add({
        message: action.title,
        status: action.notificationType,
        timeAlive: action.timeAlive,
      });
      break;
    case 'show-error': {
      if (!state.editor.currentSandbox) {
        return;
      }
      const error: ModuleError = {
        column: action.column,
        line: action.line,
        columnEnd: action.columnEnd,
        lineEnd: action.lineEnd,
        message: action.message,
        title: action.title,
        path: action.path,
        source: action.source,
        severity: action.severity,
        type: action.type,
      };
      try {
        const module = resolveModule(
          error.path,
          state.editor.currentSandbox.modules,
          state.editor.currentSandbox.directories
        );

        module.errors.push(json(error));
        state.editor.errors.push(error);
        effects.vscode.setErrors(state.editor.errors);
      } catch (e) {
        /* ignore, this module can be in a node_modules for example */
      }
      break;
    }
    case 'show-correction': {
      if (!state.editor.currentSandbox) {
        return;
      }
      const correction: ModuleCorrection = {
        path: action.path,
        column: action.column,
        line: action.line,
        columnEnd: action.columnEnd,
        lineEnd: action.lineEnd,
        message: action.message,
        source: action.source,
        severity: action.severity,
      };
      try {
        const module = resolveModule(
          correction.path as string,
          state.editor.currentSandbox.modules,
          state.editor.currentSandbox.directories
        );

        state.editor.corrections.push(correction);
        module.corrections.push(json(correction));
        effects.vscode.setCorrections(state.editor.corrections);
      } catch (e) {
        /* ignore, this module can be in a node_modules for example */
      }
      break;
    }
    case 'clear-errors': {
      const sandbox = state.editor.currentSandbox;
      if (!sandbox) {
        return;
      }
      const currentErrors = state.editor.errors;

      const newErrors = clearCorrectionsFromAction(currentErrors, action);

      if (newErrors.length !== currentErrors.length) {
        state.editor.errors.forEach(error => {
          try {
            const module = resolveModule(
              error.path,
              sandbox.modules,
              sandbox.directories
            );

            module.errors = [];
          } catch (e) {
            // Module doesn't exist anymore
          }
        });
        newErrors.forEach(error => {
          const module = resolveModule(
            error.path,
            sandbox.modules,
            sandbox.directories
          );

          module.errors.push(error);
        });
        state.editor.errors = newErrors;
        effects.vscode.setErrors(state.editor.errors);
      }
      break;
    }
    case 'clear-corrections': {
      const sandbox = state.editor.currentSandbox;

      if (!sandbox) {
        return;
      }

      const currentCorrections = state.editor.corrections;

      const newCorrections = clearCorrectionsFromAction(
        currentCorrections,
        action
      );

      if (newCorrections.length !== currentCorrections.length) {
        state.editor.corrections.forEach(correction => {
          try {
            const module = resolveModule(
              correction.path!,
              sandbox.modules,
              sandbox.directories
            );

            module.corrections = [];
          } catch (e) {
            // Module is probably in node_modules or something, which is not in
            // our store
          }
        });
        newCorrections.forEach(correction => {
          const module = resolveModule(
            correction.path!,
            sandbox.modules,
            sandbox.directories
          );

          module.corrections.push(correction);
        });
        state.editor.corrections = newCorrections;
        effects.vscode.setCorrections(state.editor.corrections);
      }
      break;
    }
    case 'source.module.rename': {
      const sandbox = state.editor.currentSandbox;
      if (!sandbox) {
        return;
      }
      const module = effects.utils.resolveModule(
        action.path.replace(/^\//, ''),
        sandbox.modules,
        sandbox.directories
      );

      if (module) {
        const sandboxModule = sandbox.modules.find(
          moduleEntry => moduleEntry.shortid === module.shortid
        );

        if (sandboxModule) {
          sandboxModule.title = action.title;
        }
      }
      break;
    }
    case 'source.dependencies.add': {
      const name = action.dependency;
      actions.editor.addNpmDependency({
        name,
      });
      break;
    }
  }
};

export const renameModule: AsyncAction<{
  title: string;
  moduleShortid: string;
}> = withOwnedSandbox(
  async ({ state, actions, effects }, { title, moduleShortid }) => {
    const sandbox = state.editor.currentSandbox;
    if (!sandbox) {
      return;
    }
    const module = sandbox.modules.find(
      moduleItem => moduleItem.shortid === moduleShortid
    );

    if (!module) {
      return;
    }

    const oldTitle = module.title;

    module.title = title;

    try {
      await effects.api.saveModuleTitle(sandbox.id, moduleShortid, title);

      if (state.live.isCurrentEditor) {
        effects.live.sendModuleUpdate(module);
      }
    } catch (error) {
      module.title = oldTitle;

      actions.internal.handleError({ message: 'Could not rename file', error });
    }
  }
);

export const onDevToolsTabAdded: Action<{
  tab: any;
}> = ({ state, actions }, { tab }) => {
  const { devToolTabs } = state.editor;
  const { devTools: newDevToolTabs, position } = addDevToolsTabUtil(
    json(devToolTabs),
    tab
  );

  const code = JSON.stringify({ preview: newDevToolTabs }, null, 2);
  const nextPos = position;

  actions.editor.internal.updateDevtools({
    code,
  });

  state.editor.currentDevToolsPosition = nextPos;
};

export const onDevToolsTabMoved: Action<{
  prevPos: any;
  nextPos: any;
}> = ({ state, actions }, { prevPos, nextPos }) => {
  const { devToolTabs } = state.editor;
  const newDevToolTabs = moveDevToolsTabUtil(
    json(devToolTabs),
    prevPos,
    nextPos
  );
  const code = JSON.stringify({ preview: newDevToolTabs }, null, 2);

  actions.editor.internal.updateDevtools({
    code,
  });

  state.editor.currentDevToolsPosition = nextPos;
};

export const onDevToolsTabClosed: Action<{
  pos: any;
}> = ({ state, actions }, { pos }) => {
  const { devToolTabs } = state.editor;
  const closePos = pos;
  const newDevToolTabs = closeDevToolsTabUtil(json(devToolTabs), closePos);
  const code = JSON.stringify({ preview: newDevToolTabs }, null, 2);

  actions.editor.internal.updateDevtools({
    code,
  });
};

export const onDevToolsPositionChanged: Action<{
  position: any;
}> = ({ state }, { position }) => {
  state.editor.currentDevToolsPosition = position;
};

export const openDevtoolsTab: Action<{
  tab: any;
}> = ({ state, actions }, { tab: tabToFind }) => {
  const serializedTab = JSON.stringify(tabToFind);
  const { devToolTabs } = state.editor;
  let nextPos;

  for (let i = 0; i < devToolTabs.length; i++) {
    const view = devToolTabs[i];

    for (let j = 0; j < view.views.length; j++) {
      const tab = view.views[j];
      if (JSON.stringify(tab) === serializedTab) {
        nextPos = {
          devToolIndex: i,
          tabPosition: j,
        };
      }
    }
  }

  if (nextPos) {
    state.editor.currentDevToolsPosition = nextPos;
  } else {
    actions.editor.onDevToolsTabAdded({
      tab: tabToFind,
    });
  }
};

export const sessionFreezeOverride: Action<{ frozen: boolean }> = (
  { state },
  { frozen }
) => {
  state.editor.sessionFrozen = frozen;
};

export const listenToSandboxChanges: AsyncAction<{
  sandboxId: string;
}> = async ({ state, actions, effects }, { sandboxId }) => {
  effects.gql.subscriptions.onSandboxChangged.dispose();

  if (!state.isLoggedIn) {
    return;
  }

  effects.gql.subscriptions.onSandboxChangged({ sandboxId }, result => {
    const sandbox = state.editor.sandboxes[sandboxId];

    if (sandbox) {
      const newInfo = result.sandboxChanged;
      sandbox.privacy = newInfo.privacy as 0 | 1 | 2;

      const authorization = convertAuthorizationToPermissionType(
        newInfo.authorization
      );

      if (authorization !== sandbox.authorization) {
        sandbox.authorization = authorization;

        actions.refetchSandboxInfo();
      }
    }
  });
};

export const loadCollaborators: AsyncAction<{ sandboxId: string }> = async (
  { state, effects },
  { sandboxId }
) => {
  if (!state.editor.currentSandbox || !state.isLoggedIn) {
    return;
  }

  effects.gql.subscriptions.onCollaboratorAdded.dispose();
  effects.gql.subscriptions.onCollaboratorRemoved.dispose();
  effects.gql.subscriptions.onCollaboratorChanged.dispose();
  effects.gql.subscriptions.onInvitationCreated.dispose();
  effects.gql.subscriptions.onInvitationRemoved.dispose();
  effects.gql.subscriptions.onInvitationChanged.dispose();

  try {
    const collaboratorResponse = await effects.gql.queries.collaborators({
      sandboxId,
    });
    if (!collaboratorResponse.sandbox) {
      return;
    }

    state.editor.collaborators = collaboratorResponse.sandbox.collaborators;

    effects.gql.subscriptions.onCollaboratorAdded({ sandboxId }, event => {
      const newCollaborator = event.collaboratorAdded;
      state.editor.collaborators = [
        ...state.editor.collaborators.filter(
          c => c.user.username !== event.collaboratorAdded.user.username
        ),
        newCollaborator,
      ];
    });

    effects.gql.subscriptions.onCollaboratorChanged({ sandboxId }, event => {
      const existingCollaborator = state.editor.collaborators.find(
        c => c.user.username === event.collaboratorChanged.user.username
      );
      if (existingCollaborator) {
        existingCollaborator.authorization =
          event.collaboratorChanged.authorization;

        existingCollaborator.warning = event.collaboratorChanged.warning;
        existingCollaborator.lastSeenAt = event.collaboratorChanged.lastSeenAt;
      }
    });

    effects.gql.subscriptions.onCollaboratorRemoved({ sandboxId }, event => {
      state.editor.collaborators = state.editor.collaborators.filter(
        c => c.user.username !== event.collaboratorRemoved.user.username
      );
    });

    if (hasPermission(state.editor.currentSandbox.authorization, 'owner')) {
      const invitationResponse = await effects.gql.queries.invitations({
        sandboxId,
      });
      const sandbox = invitationResponse.sandbox;
      if (!sandbox) {
        return;
      }

      state.editor.invitations = sandbox.invitations;

      effects.gql.subscriptions.onInvitationCreated({ sandboxId }, event => {
        if (event.invitationCreated.id === null) {
          // Ignore this
          return;
        }

        const newInvitation = event.invitationCreated;
        state.editor.invitations = [
          ...state.editor.invitations.filter(
            i => i.id !== event.invitationCreated.id
          ),
          newInvitation,
        ];
      });

      effects.gql.subscriptions.onInvitationChanged({ sandboxId }, event => {
        const existingInvitation = state.editor.invitations.find(
          i => i.id === event.invitationChanged.id
        );
        if (existingInvitation) {
          existingInvitation.authorization =
            event.invitationChanged.authorization;
        }
      });

      effects.gql.subscriptions.onInvitationRemoved({ sandboxId }, event => {
        state.editor.invitations = state.editor.invitations.filter(
          i => i.id !== event.invitationRemoved.id
        );
      });
    }
  } catch {
    // Unable to connect, not sure what to do here
  }
};

export const changeCollaboratorAuthorization: AsyncAction<{
  username: string;
  authorization: Authorization;
  sandboxId: string;
}> = async ({ state, effects }, { username, authorization, sandboxId }) => {
  const existingCollaborator = state.editor.collaborators.find(
    c => c.user.username === username
  );

  let oldAuthorization: Authorization | null = null;
  if (existingCollaborator) {
    oldAuthorization = existingCollaborator.authorization;

    existingCollaborator.authorization = authorization;
  }

  try {
    await effects.gql.mutations.changeCollaboratorAuthorization({
      sandboxId,
      authorization,
      username,
    });
  } catch (e) {
    if (existingCollaborator && oldAuthorization) {
      existingCollaborator.authorization = oldAuthorization;
    }
  }
};

export const addCollaborator: AsyncAction<{
  username: string;
  sandboxId: string;
  authorization: Authorization;
}> = async ({ state, effects }, { username, sandboxId, authorization }) => {
  const newCollaborator: CollaboratorFragment = {
    lastSeenAt: null,
    id: 'OPTIMISTIC_ID',
    authorization,
    user: {
      id: 'OPTIMISTIC_USER_ID',
      username,
      avatarUrl: '',
    },
    warning: null,
  };

  state.editor.collaborators = [...state.editor.collaborators, newCollaborator];

  try {
    const result = await effects.gql.mutations.addCollaborator({
      sandboxId,
      username,
      authorization,
    });
    state.editor.collaborators = [
      ...state.editor.collaborators.filter(c => c.user.username !== username),
      result.addCollaborator,
    ];
  } catch (e) {
    state.editor.collaborators = state.editor.collaborators.filter(
      c => c.id !== 'OPTIMISTIC_ID'
    );
  }
};

export const removeCollaborator: AsyncAction<{
  username: string;
  sandboxId: string;
}> = async ({ state, effects }, { username, sandboxId }) => {
  const existingCollaborator = state.editor.collaborators.find(
    c => c.user.username === username
  );

  state.editor.collaborators = state.editor.collaborators.filter(
    c => c.user.username !== username
  );

  try {
    await effects.gql.mutations.removeCollaborator({
      sandboxId,
      username,
    });
  } catch (e) {
    if (existingCollaborator) {
      state.editor.collaborators = [
        ...state.editor.collaborators,
        existingCollaborator,
      ];
    }
  }
};

export const inviteCollaborator: AsyncAction<{
  email: string;
  sandboxId: string;
  authorization: Authorization;
}> = async ({ state, effects }, { email, sandboxId, authorization }) => {
  const newInvitation: InvitationFragment = {
    id: 'OPTIMISTIC_ID',
    authorization,
    email,
  };

  state.editor.invitations = [...state.editor.invitations, newInvitation];

  try {
    const result = await effects.gql.mutations.inviteCollaborator({
      sandboxId,
      email,
      authorization,
    });

    if (result.createSandboxInvitation.id === null) {
      // When it's null it has already tied the email to a collaborator, and the collaborator
      // has been added via websockets
      state.editor.invitations = state.editor.invitations.filter(
        c => c.id !== 'OPTIMISTIC_ID'
      );
    } else {
      state.editor.invitations = [
        ...state.editor.invitations.filter(
          c =>
            c.id !== 'OPTIMISTIC_ID' &&
            c.id !== result.createSandboxInvitation.id
        ),

        result.createSandboxInvitation,
      ];
    }
  } catch (e) {
    state.editor.invitations = state.editor.invitations.filter(
      c => c.id !== 'OPTIMISTIC_ID'
    );
  }
};

export const revokeSandboxInvitation: AsyncAction<{
  invitationId: string;
  sandboxId: string;
}> = async ({ state, effects }, { invitationId, sandboxId }) => {
  const existingInvitation = state.editor.invitations.find(
    c => c.id === invitationId
  );

  state.editor.invitations = state.editor.invitations.filter(
    c => c.id !== invitationId
  );

  try {
    await effects.gql.mutations.revokeInvitation({
      sandboxId,
      invitationId,
    });
  } catch (e) {
    if (existingInvitation) {
      state.editor.invitations = [
        ...state.editor.invitations,
        existingInvitation,
      ];
    }
  }
};

export const getComments: AsyncAction<{
  id: string;
  sandboxId: string;
}> = async ({ state, effects }, { sandboxId, id }) => {
  try {
    const { sandbox } = await effects.gql.queries.comments({
      sandboxId,
      commentThreadId: id,
    });

    if (!sandbox || !sandbox.commentThread) {
      return;
    }

    state.editor.commentThreads[sandboxId][id].comments =
      sandbox.commentThread.comments;
  } catch (e) {
    effects.notificationToast.error(
      'Unable to get your comment, please try again'
    );
  }
};

export const selectCommentThread: Action<string> = ({ state }, id) => {
  state.editor.currentCommentThreadId = id;
};

export const addCommentThread: AsyncAction<{
  content: string;
  open?: boolean;
}> = async ({ state, effects, actions }, { content, open }) => {
  if (!state.user || !state.editor.currentSandbox) {
    return;
  }

  const id = `${content}-${state.user.username}`;
  const sandboxId = state.editor.currentSandbox.id;
  const now = new Date().toString();
  const comment: Comment = {
    id,
    insertedAt: now,
    updatedAt: now,
    content,
    user: {
      id: state.user.id,
      name: state.user.name,
      username: state.user.username,
      avatarUrl: state.user.avatarUrl,
    },
  };
  const optimisticCommentThread: CommentThread = {
    id,
    insertedAt: now,
    updatedAt: now,
    isResolved: false,
    initialComment: comment,
    comments: [],
  };
  const commentThreads = state.editor.commentThreads;

  commentThreads[sandboxId][id] = optimisticCommentThread;
  state.editor.selectedCommentsFilter = CommentsFilterOption.OPEN;
  try {
    const {
      createCommentThread: commentThread,
    } = await effects.gql.mutations.createCommentThread({
      sandboxId,
      content,
    });

    delete commentThreads[sandboxId][id];
    commentThreads[sandboxId][commentThread.id] = commentThread;
    if (open) {
      actions.editor.getComments({ id: commentThread.id, sandboxId });
    }
  } catch (error) {
    effects.notificationToast.error(
      'Unable to create your comment, please try again'
    );
    delete commentThreads[sandboxId][id];
  }
};

export const deleteComment: AsyncAction<{
  commentId: string;
  threadId: string;
  reply?: boolean;
}> = async ({ state, effects }, { commentId, threadId, reply }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const sandboxId = state.editor.currentSandbox.id;
  const commentThreads = state.editor.commentThreads;
  const deletedComment = commentThreads[sandboxId][threadId];

  if (reply) {
    const index = commentThreads[sandboxId][threadId].comments.findIndex(
      comment => comment.id === commentId
    );
    commentThreads[sandboxId][threadId].comments.splice(index, 1);
  } else {
    delete commentThreads[sandboxId][threadId];
    state.editor.currentCommentThreadId = null;
  }

  try {
    await effects.gql.mutations.deleteComment({
      commentId,
      sandboxId,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to delete your comment, please try again'
    );
    commentThreads[sandboxId][threadId] = deletedComment;
  }
};

export const resolveCommentThread: AsyncAction<{
  commentThreadId: string;
  isResolved: boolean;
}> = async ({ effects, state }, { commentThreadId, isResolved }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const commentThreads = state.editor.commentThreads;
  const sandboxId = state.editor.currentSandbox.id;
  const oldIsResolved = commentThreads[sandboxId][commentThreadId].isResolved;
  const currentCommentThread = state.editor.currentCommentThread;
  const updateIsCurrent =
    currentCommentThread &&
    commentThreads[sandboxId][commentThreadId].id === currentCommentThread.id;

  commentThreads[sandboxId][commentThreadId].isResolved = isResolved;

  if (updateIsCurrent && currentCommentThread) {
    currentCommentThread.isResolved = isResolved;
  }

  try {
    await effects.gql.mutations.toggleCommentThreadResolved({
      commentThreadId,
      isResolved,
      sandboxId,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to update your comment, please try again'
    );
    commentThreads[sandboxId][commentThreadId].isResolved = oldIsResolved;
  }
};

export const updateComment: AsyncAction<{
  commentId: string;
  content: string;
  threadId: string;
  reply?: boolean;
}> = async ({ effects, state }, { commentId, content, threadId, reply }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  const id = threadId;
  const sandboxId = state.editor.currentSandbox.id;
  const commentThread = state.editor.commentThreads[sandboxId][id];
  const commentToUpdate = reply
    ? commentThread.comments.find(comment => comment.id === commentId)
    : commentThread.initialComment;

  if (!commentToUpdate) {
    return;
  }

  commentToUpdate.content = content;

  try {
    await effects.gql.mutations.updateComment({
      commentId,
      content,
      sandboxId,
    });
  } catch (error) {
    effects.notificationToast.error(
      'Unable to update your comment, please try again'
    );
  }
};

export const selectCommentsFilter: Action<CommentsFilterOption> = (
  { state },
  option
) => {
  state.editor.selectedCommentsFilter = option;
};

export const changeInvitationAuthorization: AsyncAction<{
  invitationId: string;
  authorization: Authorization;
  sandboxId: string;
}> = async ({ state, effects }, { invitationId, sandboxId, authorization }) => {
  const existingInvitation = state.editor.invitations.find(
    c => c.id === invitationId
  );

  let oldAuthorization: Authorization | null = null;
  if (existingInvitation) {
    oldAuthorization = existingInvitation.authorization;

    existingInvitation.authorization = authorization;
  }

  try {
    await effects.gql.mutations.changeSandboxInvitationAuthorization({
      sandboxId,
      authorization,
      invitationId,
    });
  } catch (e) {
    if (existingInvitation && oldAuthorization) {
      existingInvitation.authorization = oldAuthorization;
    }
  }
};

export const addComment: AsyncAction<string> = async (
  { state, effects },
  comment
) => {
  const id = state.editor.currentCommentThreadId;

  if (
    !state.editor.currentCommentThread ||
    !id ||
    !state.user ||
    !state.editor.currentSandbox
  ) {
    return;
  }
  const sandboxId = state.editor.currentSandbox.id;
  const fakeId = `${comment}-${state.user.username}`;
  const commentThread = state.editor.commentThreads[sandboxId][id];

  commentThread.comments.push({
    insertedAt: new Date(),
    updatedAt: new Date(),
    id: fakeId,
    content: comment,
    user: {
      id: state.user.id,
      avatarUrl: state.user.avatarUrl,
      name: state.user.name,
      username: state.user.username,
    },
  });

  const optimisticComment =
    commentThread.comments[commentThread.comments.length - 1];

  try {
    const {
      createComment: newComment,
    } = await effects.gql.mutations.createComment({
      commentThreadId: id,
      content: comment,
      sandboxId,
    });

    Object.assign(optimisticComment, newComment);
  } catch (e) {
    commentThread.comments.splice(
      commentThread.comments.indexOf(optimisticComment),
      1
    );
  }
};
