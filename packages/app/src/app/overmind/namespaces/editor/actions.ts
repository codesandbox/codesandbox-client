import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import getTemplate from '@codesandbox/common/lib/templates';
import {
  EnvironmentVariable,
  Module,
  ModuleCorrection,
  ModuleError,
  ModuleTab,
  UserSelection,
  WindowOrientation,
  ForkSandboxBody,
} from '@codesandbox/common/lib/types';
import {
  captureException,
  logBreadcrumb,
} from '@codesandbox/common/lib/utils/analytics/sentry';
import { isAbsoluteVersion } from '@codesandbox/common/lib/utils/dependencies';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import { convertTypeToStatus } from '@codesandbox/common/lib/utils/notifications';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import {
  sandboxUrl,
  signInPageUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import {
  Authorization,
  CollaboratorFragment,
  InvitationFragment,
} from 'app/graphql/types';
import { Context } from 'app/overmind';
import { withLoadApp, withOwnedSandbox } from 'app/overmind/factories';
import { getSavedCode } from 'app/overmind/utils/sandbox';
import {
  addDevToolsTab as addDevToolsTabUtil,
  closeDevToolsTab as closeDevToolsTabUtil,
  moveDevToolsTab as moveDevToolsTabUtil,
} from 'app/pages/Sandbox/Editor/Content/utils';
import { convertAuthorizationToPermissionType } from 'app/utils/authorization';
import { clearCorrectionsFromAction } from 'app/utils/corrections';
import history from 'app/utils/history';
import { isPrivateScope } from 'app/utils/private-registry';
import { debounce } from 'lodash-es';
import { TextOperation } from 'ot';
import { json } from 'overmind';

import eventToTransform from '../../utils/event-to-transform';
import { SERVER } from '../../utils/items';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const onNavigateAway = () => {};

export const persistCursorToUrl = debounce(
  (
    { effects }: Context,
    {
      module,
      selection,
    }: {
      module: Module;
      selection?: UserSelection;
    }
  ) => {
    let parameter = module.path;

    if (!parameter) {
      return;
    }

    if (selection?.primary?.selection?.length) {
      const [head, anchor] = selection.primary.selection;
      const serializedSelection = head + '-' + anchor;
      parameter += `:${serializedSelection}`;
    }

    const newUrl = new URL(document.location.href);
    newUrl.searchParams.set('file', parameter);

    // Restore the URI encoded parts to their original values. Our server handles this well
    // and all the browsers do too.
    if (newUrl) {
      effects.router.replace(
        newUrl.toString().replace(/%2F/g, '/').replace('%3A', ':')
      );
    }
  },
  500
);

export const loadCursorFromUrl = async ({
  effects,
  actions,
  state,
}: Context) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const parameter = effects.router.getParameter('file');
  if (!parameter) {
    return;
  }
  const [path, selection] = parameter.split(':');

  const module = state.editor.currentSandbox.modules.find(m => m.path === path);
  if (!module) {
    return;
  }

  await actions.editor.moduleSelected({ id: module.id });

  if (!selection) {
    return;
  }

  const [parsedHead, parsedAnchor] = selection.split('-').map(Number);
  if (!isNaN(parsedHead) && !isNaN(parsedAnchor)) {
    effects.vscode.setSelection(parsedHead, parsedAnchor);
  }
};

export const refreshPreview = ({ effects }: Context) => {
  effects.preview.refresh();
};

export const addNpmDependency = withOwnedSandbox(
  async (
    { actions, effects, state }: Context,
    {
      name,
      version,
      isDev,
    }: {
      name: string;
      version?: string;
      isDev?: boolean;
    }
  ) => {
    const currentSandbox = state.editor.currentSandbox;
    const isPrivatePackage =
      currentSandbox && isPrivateScope(currentSandbox, name);

    effects.analytics.track('Add NPM Dependency', {
      private: isPrivatePackage,
    });
    state.currentModal = null;
    let newVersion = version || 'latest';

    if (!isAbsoluteVersion(newVersion)) {
      if (isPrivatePackage && currentSandbox) {
        try {
          const manifest = await effects.api.getDependencyManifest(
            currentSandbox.id,
            name
          );
          const distTags = manifest['dist-tags'];
          const absoluteVersion = distTags ? distTags[newVersion] : null;

          if (absoluteVersion) {
            newVersion = absoluteVersion;
          }
        } catch (e) {
          if (currentSandbox.privacy !== 2) {
            effects.notificationToast.add({
              status: NotificationStatus.ERROR,
              title: 'There was a problem adding the private package',
              message:
                'Private packages can only be added to private sandboxes',
              actions: {
                primary: {
                  label: 'Make Sandbox Private',
                  run: async () => {
                    await actions.workspace.sandboxPrivacyChanged({
                      privacy: 2,
                      source: 'Private Package Notification',
                    });
                    actions.editor.addNpmDependency({ name, version });
                  },
                },
                secondary: {
                  label: 'Learn More',
                  run: () => {
                    effects.browser.openWindow(
                      'https://codesandbox.io/docs/learn/sandboxes/custom-npm-registry'
                    );
                  },
                },
              },
            });
          } else {
            captureException(e);
            actions.internal.handleError({
              error: e,
              message: 'There was a problem adding the private package',
            });
          }
          return;
        }
      } else {
        const dependency = await effects.api.getDependency(name, newVersion);
        newVersion = dependency.version;
      }
    }

    await actions.editor.internal.addNpmDependencyToPackageJson({
      name,
      version: newVersion,
      isDev: Boolean(isDev),
    });

    actions.workspace.changeDependencySearch('');
    actions.workspace.clearExplorerDependencies();

    effects.preview.executeCodeImmediately();
  }
);

export const npmDependencyRemoved = withOwnedSandbox(
  async ({ actions, effects }: Context, name: string) => {
    effects.analytics.track('Remove NPM Dependency');

    await actions.editor.internal.removeNpmDependencyFromPackageJson(name);

    effects.preview.executeCodeImmediately();
  }
);

export const sandboxChanged = withLoadApp<{
  id: string;
}>(async ({ state, actions, effects }: Context, { id }: { id: string }) => {
  // This happens when we fork. This can be avoided with state first routing
  if (state.editor.isForkingSandbox && state.editor.currentSandbox) {
    if (state.editor.currentModule.id) {
      effects.vscode.openModule(state.editor.currentModule);
    }

    await actions.editor.internal.initializeSandbox(
      state.editor.currentSandbox
    );

    actions.git.loadGitSource();

    state.editor.isForkingSandbox = false;
    return;
  }

  await effects.vscode.closeAllTabs();

  state.editor.error = null;
  state.git.sourceSandboxId = null;

  let newId = id;

  newId = actions.editor.internal.ensureSandboxId(newId);

  effects.browser.storage.set('currentSandboxId', newId);

  const hasExistingSandbox = Boolean(state.editor.currentId);

  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }

  state.editor.isLoading = !hasExistingSandbox;

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
    const params = state.activeTeam ? { teamId: state.activeTeam } : undefined;
    const sandbox = await effects.api.getSandbox(newId, params);

    // Failsafe, in case someone types in the URL to load a v2 sandbox in v1
    if (sandbox.v2) {
      const sandboxV2Url = sandboxUrl({
        id: sandbox.id,
        alias: sandbox.alias,
        git: sandbox.git,
        isV2: true,
      });

      window.location.href = sandboxV2Url;
    }

    actions.internal.setCurrentSandbox(sandbox);
  } catch (error) {
    const data = error.response?.data;
    const errors = data?.errors;
    let detail = errors?.detail;

    if (Array.isArray(detail)) {
      detail = detail[0];
    } else if (typeof errors === 'object') {
      detail = errors[Object.keys(errors)[0]];
    } else if (data?.error) {
      detail = data?.error;
    }

    state.editor.error = {
      message: detail || error.message,
      status: error.response.status,
    };

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
        primary: {
          label: 'Fork',
          run: () => {
            actions.editor.forkSandboxClicked({});
          },
        },
      },
    });
  }

  await actions.editor.internal.initializeSandbox(sandbox);

  // We only recover files at this point if we are not live. When live we recover them
  // when the module_state is received
  if (
    !state.live.isLive &&
    hasPermission(sandbox.authorization, 'write_code')
  ) {
    actions.files.internal.recoverFiles();
  }

  if (state.editor.currentModule.id) {
    effects.vscode.openModule(state.editor.currentModule);
  } else {
    // This means that there is no current module. Normally we tell that the editor has loaded
    // when the module has loaded (for the skeleton), but in this case we will never load a module.
    // So we need to explicitly mark that the module has been loaded instead.
    state.editor.hasLoadedInitialModule = true;
  }
  try {
    await actions.editor.loadCursorFromUrl();
  } catch (e) {
    /**
     * This is not extremely important logic, if it breaks (which is possible because of user input)
     * we don't want to crash the whole editor. That's why we try...catch this.
     */
  }

  if (
    sandbox.featureFlags.comments &&
    hasPermission(sandbox.authorization, 'comment')
  ) {
    actions.comments.getSandboxComments(sandbox.id);
  }

  actions.git.loadGitSource();

  state.editor.isLoading = false;
});

export const contentMounted = ({ state, effects }: Context) => {
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

export const resizingStarted = ({ state }: Context) => {
  state.editor.isResizing = true;
};

export const resizingStopped = ({ state }: Context) => {
  state.editor.isResizing = false;
};

export const codeSaved = withOwnedSandbox(
  async (
    { state, actions }: Context,
    {
      code,
      moduleShortid,
      cbID,
    }: {
      code: string;
      moduleShortid: string;
      cbID: string | null;
    }
  ) => {
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

export const onOperationApplied = (
  { state, effects, actions }: Context,
  {
    code,
    moduleShortid,
    operation,
  }: {
    moduleShortid: string;
    operation: TextOperation;
    code: string;
  }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  actions.comments.transposeComments({ module, operation });

  actions.editor.internal.updateModuleCode({
    module,
    code,
  });

  if (state.preferences.settings.livePreviewEnabled) {
    actions.editor.internal.updatePreviewCode();
  }

  // If we are in a state of sync, we set "revertModule" to set it as saved
  if (module.savedCode !== null && module.code === module.savedCode) {
    effects.vscode.syncModule(module);
  }

  if (state.editor.currentSandbox.originalGit) {
    actions.git.updateGitChanges();
  }
};

/**
 * Set the code of the module and send it if live is turned on. Keep in mind that this overwrites the editor state,
 * which means that if the user was typing something else in the file, it will get overwritten(!).
 *
 * There is some extra logic to handle files that are opened and not opened. If the file is opened we will set the code
 * within VSCode and let the event that VSCode generates handle the rest, however, if the file is not opened in VSCode,
 * we'll just update it in the state and send a live message based on the diff.
 *
 * The difference between `setCode` and `codeChanged` is small but important to keep in mind. Calling this method will *always*
 * cause `codeChanged` to be called. But from different sources based on whether the file is currently open. I'd recommend to always
 * call this function if you're aiming to manually set code (like updating package.json), while editors shouild call codeChanged.
 *
 * The two cases:
 *
 * ### Already opened in VSCode
 *  1. set code in VSCode
 *  2. which generates an event
 *  3. which triggers codeChanged
 *
 * ### Not opened in VSCode
 *  1. codeChanged called directly
 */
export const setCode = (
  { effects, state, actions }: Context,
  {
    code,
    moduleShortid,
  }: {
    moduleShortid: string;
    code: string;
  }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  // If the code is opened in VSCode, change the code in VSCode and let
  // other clients know via the event triggered by VSCode. Otherwise
  // send a manual event and just change the state.
  if (effects.vscode.isModuleOpened(module)) {
    effects.vscode.setModuleCode({ ...module, code }, true);
  } else {
    actions.editor.codeChanged({ moduleShortid, code });
  }
};

export const codeChanged = (
  { effects, state, actions }: Context,
  {
    code,
    event,
    moduleShortid,
  }: {
    moduleShortid: string;
    code: string;
    event?: any;
  }
) => {
  effects.analytics.trackWithCooldown('Change Code', 30 * 1000);

  if (!state.editor.currentSandbox) {
    return;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  const savedCode = getSavedCode(module.code, module.savedCode);
  const isSavedCode = savedCode === code;
  const isFirstChange =
    !effects.live.hasClient(module.shortid) ||
    (effects.live.getClient(moduleShortid).revision === 0 &&
      effects.live.getClient(moduleShortid).state.name === 'Synchronized');

  // Don't send saved code of a moduke that has not been registered with yet, since the server
  // will take the saved code as base. Which means that the change that would generate the saved code
  // would be applied on the saved code by the server.
  if (state.live.isLive && !(isSavedCode && isFirstChange)) {
    let operation: TextOperation;
    if (event) {
      logBreadcrumb({
        category: 'ot',
        message: `Change Event ${JSON.stringify({
          moduleShortid: module.shortid,
          event,
        })}`,
      });
      operation = eventToTransform(event, module.code).operation;
    } else {
      operation = getTextOperation(module.code, code);
    }

    effects.live.sendCodeUpdate(moduleShortid, operation);

    actions.comments.transposeComments({ module, operation });
  }

  actions.editor.internal.updateModuleCode({
    module,
    code,
  });

  if (module.savedCode !== null && module.code === module.savedCode) {
    effects.vscode.syncModule(module);
  }

  const { isServer } = getTemplate(state.editor.currentSandbox.template);

  if (!isServer && state.preferences.settings.livePreviewEnabled) {
    actions.editor.internal.updatePreviewCode();
  }

  if (state.editor.currentSandbox.originalGit) {
    actions.git.updateGitChanges();
    actions.git.resolveConflicts(module);
  }
};

export const saveClicked = withOwnedSandbox(
  async ({ state, effects, actions }: Context) => {
    const sandbox = state.editor.currentSandbox;

    if (!sandbox) {
      return;
    }

    try {
      const changedModules = sandbox.modules.filter(module =>
        state.editor.changedModuleShortids.includes(module.shortid)
      );

      if (sandbox.featureFlags.comments) {
        const versions = await Promise.all(
          changedModules.map(module =>
            effects.live
              .saveModule(module)
              .then(({ saved_code, updated_at, inserted_at, version }) => {
                module.savedCode = saved_code;
                module.updatedAt = updated_at;
                module.insertedAt = inserted_at;

                return version;
              })
          )
        );
        sandbox.version = Math.max(...versions);
      } else {
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

export const createZipClicked = ({ state, effects }: Context) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  if (state.editor.currentSandbox.permissions.preventSandboxExport) {
    effects.notificationToast.error(
      'You do not permission to export this sandbox'
    );
    return;
  }

  effects.zip.download(state.editor.currentSandbox);

  effects.analytics.track('Editor - Click Menu Item - Export as ZIP');
};

// The forkExternalSandbox only seems to be used inside of the dashboard pages and
// that seems to be the reason why it's called external.
// TODO: Move the fork function to the dashboard namespace.
export const forkExternalSandbox = async (
  { effects, state, actions }: Context,
  {
    sandboxId,
    openInNewWindow,
    body,
  }: {
    sandboxId: string;
    openInNewWindow?: boolean;
    body?: { collectionId: string; alias?: string };
  }
) => {
  effects.analytics.track('Fork Sandbox', { type: 'external' });

  const usedBody: ForkSandboxBody = body || {};

  if (state.activeTeam) {
    usedBody.teamId = state.activeTeam;
  }

  try {
    const forkedSandbox = await effects.api.forkSandbox(sandboxId, usedBody);

    state.editor.sandboxes[forkedSandbox.id] = forkedSandbox;
    effects.router.updateSandboxUrl(forkedSandbox, { openInNewWindow });
  } catch (error) {
    actions.internal.handleError({
      message: 'We were unable to fork the sandbox',
      error,
    });

    throw error;
  }
};

// TODO: Look into
export const forkSandboxClicked = async (
  { state, actions }: Context,
  {
    teamId,
  }: {
    teamId?: string | null;
  }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  await actions.editor.internal.forkSandbox({
    sandboxId: state.editor.currentSandbox.id,
    teamId,
  });
};

export const likeSandboxToggled = async (
  { state, effects }: Context,
  id: string
) => {
  if (state.editor.sandboxes[id].userLiked) {
    state.editor.sandboxes[id].userLiked = false;
    state.editor.sandboxes[id].likeCount--;
    await effects.api.unlikeSandbox(id);
    effects.analytics.track('Sandbox - Like', { place: 'EDITOR' });
  } else {
    state.editor.sandboxes[id].userLiked = true;
    state.editor.sandboxes[id].likeCount++;
    await effects.api.likeSandbox(id);
    effects.analytics.track('Sandbox - Undo Like', { place: 'EDITOR' });
  }
};

export const moduleSelected = async (
  { actions, effects, state }: Context,
  {
    id,
    path,
  }:
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
) => {
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

    if (module.shortid === state.editor.currentModuleShortid && path) {
      // If this comes from VSCode we can return, but if this call comes from CodeSandbox
      // we shouldn't return, since the promise would resolve sooner than VSCode loaded
      // the file
      return;
    }

    await actions.editor.internal.setCurrentModule(module);

    actions.editor.persistCursorToUrl({ module });

    if (state.live.isLive && state.live.liveUser && state.live.roomInfo) {
      actions.editor.internal.updateSelectionsOfModule({ module });
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

export const clearModuleSelected = ({ state }: Context) => {
  state.editor.currentModuleShortid = null;
};

export const moduleDoubleClicked = ({ state, effects }: Context) => {
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

export const tabClosed = ({ state, actions }: Context, tabIndex: number) => {
  if (state.editor.tabs.length > 1) {
    actions.internal.closeTabByIndex(tabIndex);
  }
};

export const tabMoved = (
  { state }: Context,
  {
    prevIndex,
    nextIndex,
  }: {
    prevIndex: number;
    nextIndex: number;
  }
) => {
  const { tabs } = state.editor;
  const tab = json(tabs[prevIndex]);

  state.editor.tabs.splice(prevIndex, 1);
  state.editor.tabs.splice(nextIndex, 0, tab);
};

// TODO(@CompuIves): Look into whether we even want to call this function.
// We can probably call the dispatch from the bundler itself instead.
export const errorsCleared = ({ state, effects }: Context) => {
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

export const toggleStatusBar = ({ state }: Context) => {
  state.editor.statusBar = !state.editor.statusBar;
};

export const projectViewToggled = ({ state, actions }: Context) => {
  state.editor.isInProjectView = !state.editor.isInProjectView;
  actions.editor.internal.updatePreviewCode();
};

export const frozenUpdated = async (
  { effects, state }: Context,
  frozen: boolean
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  state.editor.currentSandbox.isFrozen = frozen;

  await effects.api.saveFrozen(state.editor.currentSandbox.id, frozen);
};

export const quickActionsOpened = ({ state }: Context) => {
  state.editor.quickActionsOpen = true;
};

export const quickActionsClosed = ({ state }: Context) => {
  state.editor.quickActionsOpen = false;
};

export const setPreviewContent = () => {};

export const togglePreviewContent = ({ state, effects }: Context) => {
  state.editor.previewWindowVisible = !state.editor.previewWindowVisible;
  effects.vscode.resetLayout();
};

export const currentTabChanged = (
  { state }: Context,
  {
    tabId,
  }: {
    tabId: string;
  }
) => {
  state.editor.currentTabId = tabId;
};

export const discardModuleChanges = (
  { state, effects, actions }: Context,
  {
    moduleShortid,
  }: {
    moduleShortid: string;
  }
) => {
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
  effects.vscode.syncModule(module);
};

export const fetchEnvironmentVariables = async ({
  state,
  effects,
}: Context) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  state.editor.currentSandbox.environmentVariables = await effects.api.getEnvironmentVariables(
    state.editor.currentSandbox.id
  );
};

export const updateEnvironmentVariables = async (
  { effects, state }: Context,
  environmentVariable: EnvironmentVariable
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

export const deleteEnvironmentVariable = async (
  { effects, state }: Context,
  name: string
) => {
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
export const showEnvironmentVariablesNotification = async ({
  state,
  actions,
  effects,
}: Context) => {
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
        primary: {
          label: 'Open Server Tab',
          run: () => {
            actions.workspace.setWorkspaceItem({ item: SERVER.id });
          },
        },
      },
    });
  }
};

export const onSelectionChanged = (
  { actions, state }: Context,
  selection: UserSelection
) => {
  if (!state.editor.currentModule) {
    return;
  }

  actions.editor.persistCursorToUrl({
    module: state.editor.currentModule,
    selection,
  });
};

export const toggleEditorPreviewLayout = ({ state, effects }: Context) => {
  const currentOrientation = state.editor.previewWindowOrientation;

  state.editor.previewWindowOrientation =
    currentOrientation === WindowOrientation.VERTICAL
      ? WindowOrientation.HORIZONTAL
      : WindowOrientation.VERTICAL;

  effects.vscode.resetLayout();
};

export const previewActionReceived = (
  { actions, effects, state }: Context,
  action: any
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

export const renameModule = withOwnedSandbox(
  async (
    { state, actions, effects }: Context,
    {
      title,
      moduleShortid,
    }: {
      title: string;
      moduleShortid: string;
    }
  ) => {
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

export const onDevToolsTabAdded = (
  { state, actions }: Context,
  {
    tab,
  }: {
    tab: any;
  }
) => {
  const { devToolTabs } = state.editor;
  const { devTools: newDevToolTabs, position } = addDevToolsTabUtil(
    json(devToolTabs),
    tab
  );
  const nextPos = position;

  actions.editor.internal.updateDevtools(newDevToolTabs);

  state.editor.currentDevToolsPosition = nextPos;
};

export const onDevToolsTabMoved = (
  { state, actions }: Context,
  {
    prevPos,
    nextPos,
  }: {
    prevPos: any;
    nextPos: any;
  }
) => {
  const { devToolTabs } = state.editor;
  const newDevToolTabs = moveDevToolsTabUtil(
    json(devToolTabs),
    prevPos,
    nextPos
  );

  actions.editor.internal.updateDevtools(newDevToolTabs);

  state.editor.currentDevToolsPosition = nextPos;
};

export const onDevToolsTabClosed = (
  { state, actions }: Context,
  {
    pos,
  }: {
    pos: any;
  }
) => {
  const { devToolTabs } = state.editor;
  const closePos = pos;
  const newDevToolTabs = closeDevToolsTabUtil(json(devToolTabs), closePos);

  actions.editor.internal.updateDevtools(newDevToolTabs);
};

export const onDevToolsPositionChanged = (
  { state }: Context,
  {
    position,
  }: {
    position: any;
  }
) => {
  state.editor.currentDevToolsPosition = position;
};

export const openDevtoolsTab = (
  { state, actions }: Context,
  {
    tab: tabToFind,
  }: {
    tab: any;
  }
) => {
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

export const sessionFreezeOverride = ({ state }: Context, frozen: boolean) => {
  state.editor.sessionFrozen = frozen;
};

export const listenToSandboxChanges = async (
  { state, actions, effects }: Context,
  {
    sandboxId,
  }: {
    sandboxId: string;
  }
) => {
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

export const loadCollaborators = async (
  { state, effects }: Context,
  { sandboxId }: { sandboxId: string }
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

export const changeCollaboratorAuthorization = async (
  { state, effects }: Context,
  {
    username,
    authorization,
    sandboxId,
  }: {
    username: string;
    authorization: Authorization;
    sandboxId: string;
  }
) => {
  effects.analytics.track('Update Collaborator Authorization', {
    authorization,
  });

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

export const addCollaborator = async (
  { state, effects }: Context,
  {
    username,
    sandboxId,
    authorization,
  }: {
    username: string;
    sandboxId: string;
    authorization: Authorization;
  }
) => {
  effects.analytics.track('Add Collaborator', { authorization });
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

export const removeCollaborator = async (
  { state, effects }: Context,
  {
    username,
    sandboxId,
  }: {
    username: string;
    sandboxId: string;
  }
) => {
  effects.analytics.track('Remove Collaborator');
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

export const inviteCollaborator = async (
  { state, effects }: Context,
  {
    email,
    sandboxId,
    authorization,
  }: {
    email: string;
    sandboxId: string;
    authorization: Authorization;
  }
) => {
  effects.analytics.track('Invite Collaborator (Email)', { authorization });

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

export const revokeSandboxInvitation = async (
  { state, effects }: Context,
  {
    invitationId,
    sandboxId,
  }: {
    invitationId: string;
    sandboxId: string;
  }
) => {
  effects.analytics.track('Cancel Invite Collaborator (Email)');

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

export const changeInvitationAuthorization = async (
  { state, effects }: Context,
  {
    invitationId,
    sandboxId,
    authorization,
  }: {
    invitationId: string;
    authorization: Authorization;
    sandboxId: string;
  }
) => {
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

export const setPreventSandboxLeaving = async (
  { effects, state }: Context,
  preventSandboxLeaving: boolean
) => {
  if (!state.editor.currentSandbox) return;

  // optimistic update
  const oldValue =
    state.editor.currentSandbox.permissions.preventSandboxLeaving;
  state.editor.currentSandbox.permissions.preventSandboxLeaving = preventSandboxLeaving;

  effects.analytics.track(`Editor - Change sandbox permissions`, {
    preventSandboxLeaving,
  });

  try {
    await effects.gql.mutations.setPreventSandboxesLeavingWorkspace({
      sandboxIds: [state.editor.currentSandbox.id],
      preventSandboxLeaving,
    });
  } catch (error) {
    state.editor.currentSandbox.permissions.preventSandboxLeaving = oldValue;
    effects.notificationToast.error(
      'There was a problem updating your sandbox permissions'
    );
  }
};

export const setPreventSandboxExport = async (
  { effects, state }: Context,
  preventSandboxExport: boolean
) => {
  if (!state.editor.currentSandbox) return;

  // optimistic update
  const oldValue = state.editor.currentSandbox.permissions.preventSandboxExport;
  state.editor.currentSandbox.permissions.preventSandboxExport = preventSandboxExport;

  effects.analytics.track(`Editor - Change sandbox permissions`, {
    preventSandboxExport,
  });

  try {
    await effects.gql.mutations.setPreventSandboxesExport({
      sandboxIds: [state.editor.currentSandbox.id],
      preventSandboxExport,
    });
  } catch (error) {
    state.editor.currentSandbox.permissions.preventSandboxExport = oldValue;
    effects.notificationToast.error(
      'There was a problem updating your sandbox permissions'
    );
  }
};
