import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import {
  EnvironmentVariable,
  ModuleCorrection,
  ModuleError,
  ModuleTab,
  WindowOrientation,
} from '@codesandbox/common/lib/types';
import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp, withOwnedSandbox } from 'app/overmind/factories';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import {
  addDevToolsTab as addDevToolsTabUtil,
  closeDevToolsTab as closeDevToolsTabUtil,
  moveDevToolsTab as moveDevToolsTabUtil,
} from 'app/pages/Sandbox/Editor/Content/utils';
import { clearCorrectionsFromAction } from 'app/utils/corrections';
import { json } from 'overmind';

import * as internalActions from './internalActions';

export const internal = internalActions;

export const onNavigateAway: Action = () => {};

export const addNpmDependency: AsyncAction<{
  name: string;
  version?: string;
  isDev?: boolean;
}> = withOwnedSandbox(
  async ({ effects, actions, state }, { name, version, isDev }) => {
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
  }
);

export const npmDependencyRemoved: AsyncAction<{
  name: string;
}> = withOwnedSandbox(async ({ state, effects, actions }, { name }) => {
  effects.analytics.track('Remove NPM Dependency');

  const { parsed } = state.editor.parsedConfigurations.package;

  delete parsed.dependencies[name];
  parsed.dependencies = sortObjectByKeys(parsed.dependencies);

  await actions.editor.internal.saveCode({
    code: JSON.stringify(parsed, null, 2),
    moduleShortid: state.editor.currentPackageJSON.shortid,
    cbID: null,
  });
});

export const sandboxChanged: AsyncAction<{ id: string }> = withLoadApp<{
  id: string;
}>(async ({ state, actions, effects }, { id }) => {
  state.editor.error = null;

  let newId = id;

  newId = actions.editor.internal.ensureSandboxId(newId);

  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }

  if (state.editor.sandboxes[newId] && !state.editor.sandboxes[newId].team) {
    const sandbox = await effects.api.getSandbox(newId);

    actions.internal.updateCurrentSandbox(sandbox);
    state.editor.currentId = newId;
    state.editor.isLoading = false;

    await actions.editor.internal.initializeLiveSandbox(sandbox);

    return;
  }

  state.editor.isLoading = true;
  state.editor.notFound = false;

  // Only reset changed modules if sandbox wasn't in memory, otherwise a fork
  // can mark real changed modules as unchanged
  state.editor.changedModuleShortids = [];

  try {
    const sandbox = await effects.api.getSandbox(newId);

    if (state.editor.sandboxes[newId]) {
      actions.internal.updateCurrentSandbox(sandbox);
    } else {
      actions.internal.setCurrentSandbox(sandbox);
    }
  } catch (error) {
    state.editor.notFound = true;
    state.editor.error = error.message;
    state.editor.isLoading = false;
    return;
  }

  const sandbox = state.editor.currentSandbox;

  actions.internal.ensurePackageJSON();

  await actions.editor.internal.initializeLiveSandbox(sandbox);

  if (sandbox.owned && !state.live.isLive) {
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
  cbID: string;
}> = withOwnedSandbox(async ({ actions }, { code, moduleShortid, cbID }) => {
  actions.editor.internal.saveCode({
    code,
    moduleShortid,
    cbID,
  });
});

export const codeChanged: Action<{
  code: string;
  moduleShortid: string;
  noLive?: boolean;
}> = ({ effects, state, actions }, { code, moduleShortid, noLive }) => {
  effects.analytics.trackOnce('Change Code');

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  if (state.live.isLive && !noLive) {
    state.live.receivingCode = true;
    effects.live.sendCodeUpdate(moduleShortid, module.code || '', code);
    state.live.receivingCode = false;
  }

  actions.editor.internal.setModuleCode({
    module,
    code,
  });
};

export const saveClicked: AsyncAction = withOwnedSandbox(
  async ({ state, effects, actions }) => {
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
        actions.git.internal.fetchGitChanges();
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
  }
);

export const createZipClicked: Action = ({ state, effects }) => {
  effects.zip.download(state.editor.currentSandbox);
};

export const forkExternalSandbox: AsyncAction<string> = async (
  { actions },
  sandboxId
) => {
  await actions.editor.internal.forkSandbox({
    sandboxId,
  });
};

export const forkSandboxClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  if (
    state.editor.currentSandbox.owned &&
    !effects.browser.confirm('Do you want to fork your own sandbox?')
  ) {
    return;
  }

  await actions.editor.internal.forkSandbox({
    sandboxId: state.editor.currentId,
  });
};

export const likeSandboxToggled: AsyncAction<{
  id: string;
}> = async ({ state, effects }, { id }) => {
  if (state.editor.sandboxes[id].userLiked) {
    state.editor.sandboxes[id].likeCount--;
    await effects.api.unlikeSandbox(id);
  } else {
    state.editor.sandboxes[id].likeCount++;
    await effects.api.likeSandbox(id);
  }

  state.editor.sandboxes[id].userLiked = !state.editor.sandboxes[id].userLiked;
};

export const moduleSelected: Action<{
  path?: string;
  id?: string;
}> = ({ state, effects, actions }, { path, id }) => {
  effects.analytics.track('Open File');

  const sandbox = state.editor.currentSandbox;

  try {
    let module;

    if (path) {
      module = effects.utils.resolveModule(
        path.replace(/^\//, ''),
        sandbox.modules,
        sandbox.directories
      );
    } else {
      module = state.editor.currentSandbox.modules.find(
        moduleItem => moduleItem.id === id
      );
    }

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

export const moduleDoubleClicked: Action = ({ state, effects }) => {
  if (state.preferences.settings.experimentVSCode) {
    effects.vscode.runCommand('workbench.action.keepEditor');
  }

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

export const errorsCleared: Action = ({ state }) => {
  if (state.editor.errors.length) {
    state.editor.errors.forEach(error => {
      try {
        const module = resolveModule(
          error.path,
          state.editor.currentSandbox.modules,
          state.editor.currentSandbox.directories
        );
        module.errors = [];
      } catch (e) {
        // Module is probably somewhere in eg. /node_modules which is not
        // in the store
      }
    });
    state.editor.errors = [];
  }
};

export const toggleStatusBar: Action = ({ state }) => {
  state.editor.statusBar = !state.editor.statusBar;
};

export const projectViewToggled: Action = ({ state }) => {
  state.editor.isInProjectView = !state.editor.isInProjectView;
};

export const frozenUpdated: AsyncAction<{ frozen: boolean }> = async (
  { state, effects },
  { frozen }
) => {
  state.editor.currentSandbox.isFrozen = frozen;

  await effects.api.saveFrozen(state.editor.currentId, frozen);
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
  const module = sandbox.modules.find(
    moduleItem => moduleItem.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  actions.editor.codeChanged({
    code: module.savedCode || module.code || '',
    moduleShortid,
  });

  module.updatedAt = new Date().toString();

  state.editor.changedModuleShortids.splice(
    state.editor.changedModuleShortids.indexOf(moduleShortid),
    1
  );
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

export const deleteEnvironmentVariable: AsyncAction<{
  name: string;
}> = async ({ state, effects }, { name }) => {
  const id = state.editor.currentId;

  state.editor.currentSandbox.environmentVariables = await effects.api.deleteEnvironmentVariable(
    id,
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

export const previewActionReceived: Action<{
  action: any;
}> = ({ state, effects, actions }, { action }) => {
  switch (action.action) {
    case 'notification':
      effects.notificationToast.add({
        message: action.title,
        status: action.notificationType,
        timeAlive: action.timeAlive,
      });
      break;
    case 'show-error': {
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
      const module = resolveModule(
        error.path,
        state.editor.currentSandbox.modules,
        state.editor.currentSandbox.directories
      );

      module.errors.push(json(error));
      state.editor.errors.push(error);
      break;
    }
    case 'show-correction': {
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
      const module = resolveModule(
        correction.path,
        state.editor.currentSandbox.modules,
        state.editor.currentSandbox.directories
      );

      state.editor.corrections.push(correction);
      module.corrections.push(json(correction));
      break;
    }
    case 'clear-errors': {
      const currentErrors = state.editor.errors;

      const newErrors = clearCorrectionsFromAction(currentErrors, action);

      if (newErrors.length !== currentErrors.length) {
        state.editor.errors.forEach(error => {
          const module = resolveModule(
            error.path,
            state.editor.currentSandbox.modules,
            state.editor.currentSandbox.directories
          );

          module.errors = [];
        });
        state.editor.errors = newErrors;
      }
      break;
    }
    case 'clear-corrections': {
      const currentCorrections = state.editor.corrections;

      const newCorrections = clearCorrectionsFromAction(
        currentCorrections,
        action
      );

      if (newCorrections.length !== currentCorrections.length) {
        state.editor.corrections.forEach(correction => {
          try {
            const module = resolveModule(
              correction.path,
              state.editor.currentSandbox.modules,
              state.editor.currentSandbox.directories
            );

            module.corrections = [];
          } catch (e) {
            // Module is probably in node_modules or something, which is not in
            // our store
          }
        });
        state.editor.corrections = newCorrections;
      }
      break;
    }
    case 'source.module.rename': {
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
      actions.forceRender();
      break;
    }
  }
};

export const renameModule: AsyncAction<{
  title: string;
  moduleShortid: string;
}> = withOwnedSandbox(
  async ({ state, effects, actions }, { title, moduleShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const module = sandbox.modules.find(
      moduleItem => moduleItem.shortid === moduleShortid
    );

    if (!module) {
      return;
    }

    const oldTitle = module.title;

    module.title = title;

    try {
      await effects.api.saveModuleTitle(
        state.editor.currentId,
        moduleShortid,
        title
      );

      if (state.live.isCurrentEditor) {
        effects.live.sendModuleUpdate(module);
      }
    } catch (error) {
      module.title = oldTitle;
      effects.notificationToast.error('Could not rename file');
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
