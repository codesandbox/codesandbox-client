import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import { withLoadApp } from 'app/overmind/factories';
import { json } from 'overmind';
import { clearCorrectionsFromAction } from 'app/utils/corrections';
import {
  WindowOrientation,
  TabType,
  EnvironmentVariable,
} from '@codesandbox/common/lib/types';

export const internal = internalActions;

export const addNpmDependency: AsyncAction<{
  name: string;
  version?: string;
  isDev?: boolean;
}> = async ({ effects, actions, state }, { name, version, isDev }) => {
  effects.analytics.track('Add NPM Dependency');
  state.currentModal = null;

  await actions.editor.internal.ensureSandboxIsOwned();

  if (!version) {
    const dependency = await effects.api.getDependency(name);
    version = dependency.version;
  }

  await actions.editor.internal.addNpmDependencyToPackageJson({
    name,
    version,
    isDev,
  });
};

export const npmDependencyRemoved: AsyncAction<{ name: string }> = async (
  { state, effects, actions },
  { name }
) => {
  effects.analytics.track('Remove NPM Dependency');
  await actions.editor.internal.ensureSandboxIsOwned();
  const { parsed } = state.editor.parsedConfigurations.package;

  delete parsed.dependencies[name];
  parsed.dependencies = sortObjectByKeys(parsed.dependencies);

  await actions.editor.internal.saveCode({
    code: JSON.stringify(parsed, null, 2),
    moduleShortid: state.editor.currentPackageJSON.shortid,
  });
};

export const sandboxChanged: AsyncAction<{ id: string }> = withLoadApp<{
  id: string;
}>(async ({ state, actions, effects }, { id }) => {
  state.editor.error = null;

  id = actions.editor.internal.ensureSandboxId(id);

  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }

  state.editor.isLoading = true;
  state.editor.notFound = false;

  // Only reset changed modules if sandbox wasn't in memory, otherwise a fork
  // can mark real changed modules as unchanged
  state.editor.changedModuleShortids = [];

  try {
    const sandbox = await effects.api.getSandbox(id);

    if (state.editor.sandboxes[id]) {
      actions.internal.updateCurrentSandbox(sandbox);
    } else {
      actions.internal.setCurrentSandbox(sandbox);
    }
  } catch (error) {
    state.editor.notFound = true;
    state.editor.error = error.message;
  }

  const sandbox = state.editor.currentSandbox;

  actions.internal.ensurePackageJSON();

  if (sandbox.owned && sandbox.roomId) {
    if (sandbox.team) {
      state.live.isTeam = true;
    }

    state.live.isLoading = true;
    await actions.live.internal.initialize();
    state.live.isLoading = false;
  } else if (sandbox.owned) {
    actions.files.internal.recoverFiles();
  }

  state.editor.isLoading = false;
});

export const contentMounted: Action = ({ state, effects }) => {
  effects.browser.onUnload(event => {
    if (!state.editor.isAllModulesSynced) {
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
}> = async ({ actions }, { code, moduleShortid }) => {
  actions.editor.internal.saveCode({
    code,
    moduleShortid,
  });
};

export const codeChanged: Action<{
  code: string;
  moduleShortid: string;
  ignoreLive?: boolean;
}> = ({ effects, state, actions }, { code, moduleShortid, ignoreLive }) => {
  effects.analytics.trackOnce('Change Code');

  const module = state.editor.currentSandbox.modules.find(
    module => module.shortid === moduleShortid
  );

  if (state.live.isLive && !ignoreLive) {
    state.live.receivingCode = true;
    effects.live.sendCodeUpdate(moduleShortid, module.code, code);
    state.live.receivingCode = false;
  }

  actions.editor.internal.setModuleCode({
    module,
    code,
  });

  if (!state.editor.changedModuleShortids.includes(moduleShortid)) {
    state.editor.changedModuleShortids.push(moduleShortid);
  }

  state.editor.tabs.forEach(tab => {
    if (tab.type === TabType.MODULE && tab.moduleShortid === moduleShortid) {
      tab.dirty = false;
    }
  });
};

export const saveClicked: AsyncAction = async ({ state, effects, actions }) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const currentlyChangedModuleShortids = state.editor.changedModuleShortids.slice();

  try {
    const changedModules = sandbox.modules.filter(module =>
      state.editor.changedModuleShortids.includes(module.shortid)
    );

    state.editor.changedModuleShortids = [];

    await effects.api.saveModules(sandbox.id, changedModules);
    effects.moduleRecover.clearSandbox(sandbox.id);

    if (
      state.editor.currentSandbox.originalGit &&
      state.workspace.openedWorkspaceItem === 'github'
    ) {
      actions.git.fetchGitChanges();
    }
  } catch (error) {
    // Put back any unsaved modules taking into account that you
    // might have changed some modules waiting for saving
    currentlyChangedModuleShortids.forEach(moduleShortid => {
      if (!state.editor.changedModuleShortids.includes(moduleShortid)) {
        state.editor.changedModuleShortids.push(moduleShortid);
      }
    });
    effects.notificationToast.error(
      'Sorry, was not able to save, please try again'
    );
  }
};

export const createZipClicked: Action = ({ state, effects }) => {
  effects.zip.download(state.editor.currentSandbox);
};

export const forkSandboxClicked: AsyncAction<string> = async (
  { state, effects, actions },
  id
) => {
  if (
    state.editor.currentSandbox.owned &&
    !effects.browser.confirm('Do you want to fork your own sandbox?')
  ) {
    return;
  }

  await actions.editor.internal.forkSandbox(id);
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
    await effects.api.unlikeSandbox(id);
  }

  state.editor.sandboxes[id].userLiked = !state.editor.sandboxes[id].userLiked;
};

export const moduleSelected: Action<string> = (
  { state, effects, actions },
  modulePath
) => {
  effects.analytics.track('Open File');

  const sandbox = state.editor.currentSandbox;

  try {
    const module = effects.utils.resolveModule(
      modulePath.replace(/^\//, ''),
      sandbox.modules,
      sandbox.directories
    );

    actions.editor.internal.setCurrentModule(module);

    if (state.live.isLive) {
      state.editor.pendingUserSelections = actions.live.internal.getSelectionsForModule(
        module
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
          state.live.followingUserId = null;
        }
      }

      effects.live.sendUserCurrentModule(module.shortid);
    }
  } catch (error) {
    state.editor.currentModuleShortid = null;
  }
};

export const clearModuleSelected: Action = ({ state }) => {
  state.editor.currentModuleShortid = null;
};

export const moduleDoubleClicked: Action<string> = (
  { state },
  moduleShortid
) => {
  state.editor.tabs.forEach(tab => {
    if (tab.type === TabType.MODULE && tab.moduleShortid === moduleShortid) {
      tab.dirty = false;
    }
  });
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
  const tabs = state.editor.tabs;
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
  const newCode = await effects.prettyfier.prettify(
    module.id,
    module.title,
    module.code
  );

  actions.editor.codeChanged({
    code: newCode,
    moduleShortid: module.shortid,
  });
};

export const errorsCleared: Action = ({ state }) => {
  state.editor.errors = [];
};

export const projectViewToggled: Action = ({ state }) => {
  state.editor.isInProjectView = !state.editor.isInProjectView;
};

export const privacyUpdated: AsyncAction<0 | 1 | 2> = async (
  { state, effects },
  privacy
) => {
  state.editor.isUpdatingPrivacy = true;

  await effects.api.savePrivacy(state.editor.currentId, privacy);

  state.editor.isUpdatingPrivacy = false;
};

export const frozenUpdated: AsyncAction<boolean> = async (
  { state, effects },
  isFrozen
) => {
  state.editor.currentSandbox.isFrozen = isFrozen;

  await effects.api.saveFrozen(state.editor.currentId, isFrozen);
};

export const quickActionsOpened: Action = ({ state }) => {
  state.editor.quickActionsOpen = true;
};

export const quickActionsClosed: Action = ({ state }) => {
  state.editor.quickActionsOpen = false;
};

export const setPreviewContent: Action = () => {};

export const togglePreviewContent: Action = ({ state }) => {
  state.editor.previewWindowVisible = !state.editor.previewWindowVisible;
};

export const currentTabChanged: Action<string> = ({ state }, tabId) => {
  state.editor.currentTabId = tabId;
};

export const discardModuleChanges: Action<string> = (
  { state, effects, actions },
  moduleShortid
) => {
  effects.analytics.track('Code Discarded');

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );

  actions.editor.codeChanged({
    code: module.savedCode || module.code,
    moduleShortid,
  });

  module.updatedAt = new Date().toString();
};

export const fetchEnvironmentVariables: AsyncAction = async ({
  state,
  effects,
}) => {
  state.editor.currentSandbox.environmentVariables = await effects.api.getEnvironmentVariables(
    state.editor.currentId
  );
};

export const updateEnvironmentVariables: AsyncAction<
  EnvironmentVariable
> = async ({ state, effects }, environmentVariable) => {
  state.editor.currentSandbox.environmentVariables = await effects.api.saveEnvironmentVariable(
    state.editor.currentId,
    environmentVariable
  );

  effects.codesandboxApi.restartSandbox();
};

export const deleteEnvironmentVariable: AsyncAction<string> = async (
  { state, effects },
  name
) => {
  const id = state.editor.currentId;

  state.editor.currentSandbox.environmentVariables = await effects.api.deleteEnvironmentVariable(
    state.editor.currentId,
    name
  );
  effects.codesandboxApi.restartSandbox();
};

export const toggleEditorPreviewLayout: Action = ({ state }) => {
  const currentOrientation = state.editor.previewWindowOrientation;

  state.editor.previewWindowOrientation =
    currentOrientation === WindowOrientation.VERTICAL
      ? WindowOrientation.HORIZONTAL
      : WindowOrientation.VERTICAL;
};

export const previewActionReceived: Action<any> = (
  { state, effects, actions },
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
    case 'show-error':
      const error = {
        moduleId: action.module ? action.module.id : undefined,
        column: action.column,
        line: action.line,
        columnEnd: action.columnEnd,
        lineEnd: action.lineEnd,
        message: action.message,
        title: action.title,
        path: action.path,
        source: action.source,
      };

      state.editor.errors.push(error);
      break;
    case 'show-correction':
      const correction = {
        path: action.path,
        column: action.column,
        line: action.line,
        columnEnd: action.columnEnd,
        lineEnd: action.lineEnd,
        message: action.message,
        source: action.source,
        severity: action.severity,
      };

      state.editor.corrections.push(correction);
      break;
    case 'clear-errors':
      const currentErrors = state.editor.errors;

      const newErrors = clearCorrectionsFromAction(currentErrors, action);

      if (newErrors.length !== currentErrors.length) {
        state.editor.errors = newErrors;
      }
      break;
    case 'clear-corrections':
      const currentCorrections = state.editor.corrections;

      const newCorrections = clearCorrectionsFromAction(
        currentCorrections,
        action
      );

      if (newCorrections.length !== currentCorrections.length) {
        state.editor.corrections = newCorrections;
      }
      break;
    case 'source.module.rename':
      const sandbox = state.editor.currentSandbox;
      const module = effects.utils.resolveModule(
        action.path.replace(/^\//, ''),
        sandbox.modules,
        sandbox.directories
      );

      if (module) {
        const sandboxModule = sandbox.modules.find(
          moduleEntry => moduleEntry.shortid === module.shortid
        );

        sandboxModule.title = action.title;
      }
      break;
    case 'source.dependencies.add':
      const name = action.dependency;
      actions.editor.addNpmDependency({
        name,
      });
      actions.forceRender();
      break;
  }
};

export const renameModule: AsyncAction<{
  title: string;
  moduleShortid: string;
}> = async ({ state, effects, actions }, { title, moduleShortid }) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );
  const oldTitle = module.title;

  module.title = title;

  try {
    await effects.api.saveModuleTitle(
      state.editor.currentId,
      moduleShortid,
      title
    );

    if (state.live.isCurrentEditor) {
      effects.live.sendModuleUpdate(moduleShortid);
    }
  } catch (error) {
    module.title = oldTitle;
    effects.notificationToast.error('Could not rename file');
  }
};
