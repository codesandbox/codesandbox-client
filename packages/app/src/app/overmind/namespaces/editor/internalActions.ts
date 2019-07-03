import { mapValues } from 'lodash-es';
import { Action, AsyncAction } from 'app/overmind';
import { Sandbox, Module } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import getTemplate from '@codesandbox/common/lib/templates';
import { getTemplate as computeTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import {
  sandboxUrl,
  editorUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { parseConfigurations } from '../../utils/parse-configurations';
import { mainModule, defaultOpenedModule } from '../../utils/main-module';

export const setIdFromAlias: Action<string, string> = ({ state }, id) => {
  if (state.editor.sandboxes[id]) {
    return id;
  }

  const sandboxes = state.editor.sandboxes;
  const matchingSandbox = Object.keys(sandboxes).find(
    id => sandboxUrl(sandboxes[id]) === `${editorUrl()}${id}`
  );

  return matchingSandbox || id;
};

export const setCurrentModuleShortid: Action<Sandbox> = (
  { state },
  sandbox
) => {
  const currentModuleShortid = state.editor.currentModuleShortid;

  // Only change the module shortid if it doesn't exist in the new sandbox
  if (
    sandbox.modules.map(m => m.shortid).indexOf(currentModuleShortid) === -1
  ) {
    const parsedConfigs = parseConfigurations(sandbox);
    const module = defaultOpenedModule(sandbox, parsedConfigs);

    state.editor.currentModuleShortid = module.shortid;
  }
};

export const setMainModuleShortid: Action<Sandbox> = ({ state }, sandbox) => {
  const parsedConfigs = parseConfigurations(sandbox);
  const module = mainModule(sandbox, parsedConfigs);

  state.editor.mainModuleShortid = module.shortid;
};

export const setInitialTab: Action = ({ state }) => {
  const currentModule = state.editor.currentModule;
  const newTab = {
    type: 'MODULE',
    moduleShortid: currentModule.shortid,
    dirty: true,
  };

  state.editor.tabs = [newTab];
};

export const setUrlOptions: Action = ({ state, effects }) => {
  const options = effects.router.getSandboxOptions();

  if (options.currentModule) {
    const sandbox = state.editor.currentSandbox;

    try {
      const module = effects.utils.resolveModule(
        options.currentModule,
        sandbox.modules,
        sandbox.directories,
        options.currentModule.directoryShortid
      );

      if (module) {
        state.editor.tabs.push({
          type: 'MODULE',
          moduleShortid: module.shortid,
          dirty: false,
        });
        state.editor.currentModuleShortid = module.shortid;
      }
    } catch (err) {
      const now = Date.now();
      const title = `Could not find the module ${options.currentModule}`;

      state.notifications.push({
        title,
        id: now,
        notificationType: 'warning',
        endTime: now + 2000,
        buttons: [],
      });
    }
  }

  state.preferences.showPreview =
    options.isPreviewScreen || options.isSplitScreen;

  state.preferences.showEditor =
    options.isEditorScreen || options.isSplitScreen;

  if (options.initialPath) state.editor.initialPath = options.initialPath;
  if (options.fontSize) state.preferences.settings.fontSize = options.fontSize;
  if (options.highlightedLines)
    state.editor.highlightedLines = options.highlightedLines;
  if (options.hideNavigation)
    state.preferences.hideNavigation = options.hideNavigation;
  if (options.isInProjectView)
    state.editor.isInProjectView = options.isInProjectView;
  if (options.autoResize)
    state.preferences.settings.autoResize = options.autoResize;
  if (options.useCodeMirror)
    state.preferences.settings.useCodeMirror = options.useCodeMirror;
  if (options.enableEslint)
    state.preferences.settings.enableEslint = options.enableEslint;
  if (options.forceRefresh)
    state.preferences.settings.forceRefresh = options.forceRefresh;
  if (options.expandDevTools)
    state.preferences.showDevtools = options.expandDevTools;
  if (options.runOnClick) state.preferences.runOnClick = options.runOnClick;
};

export const prettifyCode: AsyncAction<
  {
    code: string;
    moduleShortid: string;
  },
  string
> = async ({ state, effects }, { code, moduleShortid }) => {
  effects.analytics.track('Prettify Code');

  const sandbox = state.editor.currentSandbox;
  const moduleToPrettify = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );
  let config = state.preferences.settings.prettierConfig;
  const configFromSandbox = sandbox.modules.find(
    module => module.directoryShortid == null && module.title === '.prettierrc'
  );

  if (configFromSandbox) {
    try {
      config = JSON.parse(configFromSandbox.code);
    } catch (e) {
      effects.notificationToast.add({
        message: 'Invalid JSON in sandbox .prettierrc file',
        status: NotificationStatus.ERROR,
      });
      return code;
    }
  }

  return effects.utils.prettify(
    moduleToPrettify.title,
    moduleToPrettify ? moduleToPrettify.code : '',
    config,
    () =>
      moduleToPrettify
        ? moduleToPrettify.id === state.editor.currentModule.id
        : false
  );
};

export const saveCode: AsyncAction<{
  code: string;
  moduleShortid: string;
}> = async ({ state, effects, actions }, { code, moduleShortid }) => {
  effects.analytics.track('Save Code');
  await actions.editor.internal.ensureOwnedEditable();

  if (state.preferences.settings.prettifyOnSaveEnabled) {
    code = await actions.editor.internal.prettifyCode({
      code,
      moduleShortid,
    });
  }

  try {
    const module = await actions.editor.internal.saveModuleCode(moduleShortid);

    actions.editor.internal.setModuleSaved(module.shortid);

    // Where does the ID come from?
    // effects.vscode.callCallback()

    if (
      state.editor.currentSandbox.originalGit &&
      state.workspace.openedWorkspaceItem === 'github'
    ) {
      await actions.git.internal.fetchGitChanges();
    }

    actions.live.internal.sendModuleSaved(module.shortid);
  } catch (error) {
    effects.notificationToast.add({
      message: error.message,
      status: NotificationStatus.WARNING,
    });
    // Where does the ID come from?
    // effects.vscode.callCallbackError()
  }
};

export const updateTemplateIfSSE: Action = ({ state, effects }) => {
  try {
    const currentTemplate = state.editor.currentSandbox.template;
    const templateDefinition = getTemplate(currentTemplate);

    const shouldUpdateTemplate = (() => {
      // We always want to be able to update server template based on its detection.
      // We only want to update the client template when it's explicitly specified
      // in the sandbox configuration.

      if (templateDefinition.isServer) {
        return true;
      }

      const sandboxConfig = state.editor.parsedConfigurations.sandbox;

      if (sandboxConfig.parsed.template) {
        return true;
      }

      return false;
    })();

    if (shouldUpdateTemplate) {
      const { parsed } = state.editor.parsedConfigurations.package;

      const modulesByPath = mapValues(state.editor.modulesByPath, m => ({
        content: m.code,
        isBinary: m.isBinary,
      }));

      const newTemplate = computeTemplate(parsed, modulesByPath) || 'node';

      if (
        newTemplate !== currentTemplate &&
        templateDefinition.isServer === getTemplate(newTemplate).isServer
      ) {
        state.editor.currentSandbox.template = newTemplate;
        effects.api.put(`/sandboxes/${state.editor.currentSandbox.id}/`, {
          sandbox: { template: newTemplate },
        });
      }
    }
  } catch (e) {
    // We don't want this to be blocking at all, it's low prio
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
  }
};

export const setModuleSaved: Action<string> = ({ state }, shortid) => {
  const changedModuleShortids = state.editor.changedModuleShortids;
  const newChangedModuleShortids = changedModuleShortids.filter(
    x => x !== shortid
  );

  state.editor.changedModuleShortids = newChangedModuleShortids;
};

export const saveModuleCode: AsyncAction<string, Module> = async (
  { state, effects },
  moduleShortid
) => {
  const sandbox = state.editor.currentSandbox;
  const moduleToSave = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );

  const codeToSave = moduleToSave.code;
  const title = moduleToSave.title;

  return effects.api
    .put<Module>(`/sandboxes/${sandbox.id}/modules/${moduleToSave.shortid}`, {
      module: { code: codeToSave },
    })
    .then(x => {
      const newSandbox = state.editor.currentSandbox;
      const newModuleToSave = sandbox.modules.find(
        module => module.shortid === moduleShortid
      );

      const index = newSandbox.modules.findIndex(
        m => m.id === newModuleToSave.id
      );

      if (index > -1) {
        state.editor.sandboxes[newSandbox.id].modules[index].insertedAt =
          x.insertedAt;
        state.editor.sandboxes[newSandbox.id].modules[index].updatedAt =
          x.updatedAt;

        if (newModuleToSave.code === codeToSave) {
          state.editor.sandboxes[newSandbox.id].modules[
            index
          ].savedCode = undefined;
          effects.moduleRecover.remove(sandbox.id, moduleToSave);
        } else {
          state.editor.sandboxes[newSandbox.id].modules[index].savedCode =
            x.code;

          throw new Error(
            `The code of '${title}' changed while saving. Please try again with saving.`
          );
        }
      }

      return x;
    });
};

export const getLatestVersion: AsyncAction<string, string> = async (
  { effects },
  name
) => {
  const dependency = await effects.api.get<{ version: string }>(
    `/dependencies/${name}@latest`
  );

  return dependency.version;
};

export const addNpmDependencyToPackage: Action<
  {
    name: string;
    version?: string;
    isDev: boolean;
  },
  {
    oldCode: string;
    code: string;
    moduleShortid: string;
  }
> = ({ state }, { name, isDev, version }) => {
  const { parsed, code: oldCode } = state.editor.parsedConfigurations.package;

  const type = isDev ? 'devDependencies' : 'dependencies';

  parsed[type] = parsed[type] || {};
  parsed[type][name] = version || 'latest';
  parsed[type] = sortObjectByKeys(parsed[type]);

  return {
    oldCode,
    code: JSON.stringify(parsed, null, 2),
    moduleShortid: state.editor.currentPackageJSON.shortid,
  };
};

export const refetchSandboxInfo: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  if (state.editor.currentId) {
    try {
      const sandbox = await effects.api.get<Sandbox>(
        `/sandboxes/${state.editor.currentId}`
      );

      actions.editor.internal.setSandboxData({
        sandbox,
        noOverWriteFiles: true,
      });

      if (state.live.isLive) {
        actions.live.internal.disconnect();
      }

      actions.editor.internal.joinLiveSessionIfAvailable();
    } catch (error) {
      console.error(error.message);
    }
  }
};

export const setSandboxData: Action<{
  sandbox: Sandbox;
  noOverWriteFiles: boolean;
}> = ({ state }, { sandbox, noOverWriteFiles }) => {
  if (noOverWriteFiles) {
    state.editor.currentSandbox.collection = sandbox.collection;
    state.editor.currentSandbox.owned = sandbox.owned;
    state.editor.currentSandbox.userLiked = sandbox.userLiked;
    state.editor.currentSandbox.title = sandbox.title;
    state.editor.currentSandbox.team = sandbox.team;
  } else {
    state.editor.sandboxes[sandbox.id] = sandbox;
  }
};

export const joinLiveSessionIfAvailable: AsyncAction = async ({
  state,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;

  // Was originally a lot of setting of the sandbox here, but dunno why?
  if (sandbox.owned && sandbox.roomId) {
    if (sandbox.team) {
      state.live.isTeam = true;
    }

    await actions.live.internal.initialize();
  } else if (sandbox.owned) {
    actions.editor.internal.recoverFiles();
  }
};

export const recoverFiles: Action = ({ state, effects, actions }) => {
  const sandbox = state.editor.currentSandbox;

  const recoverList = effects.moduleRecover.getRecoverList(
    sandbox.id,
    sandbox.modules
  );
  effects.moduleRecover.clearSandbox(sandbox.id);

  const recoveredList = recoverList
    .map(({ recoverData, module }) => {
      if (module.code === recoverData.savedCode) {
        const titleA = `saved '${module.title}'`;
        const titleB = `recovered '${module.title}'`;

        state.editor.tabs.push({
          type: 'DIFF',
          codeA: module.code || '',
          codeB: recoverData.code || '',
          titleA,
          titleB,
          fileTitle: module.title,
          id: `${titleA} - ${titleB}`,
        });

        actions.editor.codeChanged({
          code: recoverData.code,
          moduleShortid: module.shortid,
        });

        return true;
      }

      return false;
    })
    .filter(Boolean);

  if (recoveredList.length > 0) {
    effects.analytics.track('Files Recovered', {
      fileCount: recoveredList.length,
    });

    effects.notificationToast.add({
      message: `We recovered ${
        recoveredList.length
      } unsaved files from a previous session`,
      status: NotificationStatus.NOTICE,
    });
  }
};

export const ensureOwnedEditable: AsyncAction = async ({ state, actions }) => {
  if (!state.editor.currentSandbox.owned) {
    return actions.internal.forkSandbox({
      id: state.editor.currentId,
    });
  }

  if (
    state.editor.currentSandbox.owned &&
    state.editor.currentSandbox.isFrozen
  ) {
    return actions.internal.forkFrozenSandbox();
  }
};

export const setCode: Action<{
  moduleShortid: string;
  code: string;
}> = ({ state, effects }, { moduleShortid, code }) => {
  const currentId = state.editor.currentId;
  const currentSandbox = state.editor.currentSandbox;
  const moduleIndex = state.editor.currentSandbox.modules.findIndex(
    module => module.shortid === moduleShortid
  );
  const module = currentSandbox.modules[moduleIndex];

  if (module) {
    if (!module.savedCode) {
      state.editor.sandboxes[currentId].modules[moduleIndex].savedCode =
        module.code;
    }

    if (currentSandbox.owned) {
      const savedCode =
        state.editor.sandboxes[currentId].modules[moduleIndex].savedCode;

      // Save the code to localStorage so we can recover in case of a crash
      effects.moduleRecover.save(
        currentId,
        currentSandbox.version,
        module,
        code,
        savedCode
      );
    }

    state.editor.sandboxes[currentId].modules[moduleIndex].code = code;
  }
};

export const addChangedModule: Action<string> = ({ state }, moduleShortid) => {
  moduleShortid = moduleShortid || state.editor.currentModuleShortid;

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (module) {
    const moduleIndex = state.editor.changedModuleShortids.indexOf(
      moduleShortid
    );

    if (moduleIndex === -1) {
      if (module.savedCode !== module.code) {
        state.editor.changedModuleShortids.push(moduleShortid);
      }
    } else if (module.savedCode === module.code) {
      state.editor.changedModuleShortids = state.editor.changedModuleShortids.filter(
        x => x !== moduleShortid
      );
    }
  }
};

export const unsetDirtyTab: Action = ({ state, effects }) => {
  if (state.preferences.settings.experimentVSCode) {
    effects.vscode.runCommand('workbench.action.keepEditor');
  }

  const currentModule = state.editor.currentModule;
  const tabs = state.editor.tabs;
  const tabIndex = tabs.findIndex(
    tab => tab.moduleShortid === currentModule.shortid
  );

  if (tabIndex !== -1) {
    state.editor.tabs[tabIndex].dirty = false;
  }
};

export const outputChangedModules: Action<void, Module[]> = ({ state }) => {
  const changedModuleShortids = state.editor.changedModuleShortids;
  const sandbox = state.editor.currentSandbox;

  return sandbox.modules.filter(
    module => changedModuleShortids.indexOf(module.shortid) >= 0
  );
};

export const saveChangedModules: AsyncAction<Module[]> = async (
  { state, effects },
  changedModules
) => {
  const sandboxId = state.editor.currentId;

  await effects.api.put(`/sandboxes/${sandboxId}/modules/mupdate`, {
    modules: changedModules,
  });

  effects.moduleRecover.clearSandbox(sandboxId);
};

export const removeChangedModules: Action<Module[]> = (
  { state },
  changedModules
) => {
  changedModules.forEach(module => {
    const sandbox = state.editor.currentSandbox;
    const index = sandbox.modules.findIndex(m => m.id === module.id);

    if (index !== -1) {
      const currentCode =
        state.editor.sandboxes[sandbox.id].modules[index].code;
      // If the code hasn't change between the save call and this action we can just reset
      // the saved code. Otherwise we must set the savedCode to the value of the last save.
      if (currentCode === module.code) {
        state.editor.sandboxes[sandbox.id].modules[index].savedCode = null;
      } else {
        state.editor.sandboxes[sandbox.id].modules[index].savedCode =
          module.code;
      }
    }
  });

  state.editor.changedModuleShortids = state.editor.changedModuleShortids.filter(
    shortid => !changedModules.find(m => m.shortid === shortid)
  );
};

export const getIdFromModulePath: Action<string, string> = (
  { state, effects },
  modulePath
) => {
  if (!modulePath) {
    return null;
  }

  const sandbox = state.editor.currentSandbox;

  try {
    const module = effects.utils.resolveModule(
      modulePath.replace(/^\//, ''),
      sandbox.modules,
      sandbox.directories
    );

    return module.id;
  } catch (e) {
    return null;
  }
};

export const setCurrentModule: Action<string> = ({ state }, id) => {
  state.editor.currentTabId = null;

  const modules = state.editor.currentSandbox.modules;
  const m = modules.find(module => module.id === id);

  if (m) {
    const { shortid } = m;

    const newTab = {
      type: 'MODULE',
      moduleShortid: shortid,
      dirty: true,
    };
    const tabs = state.editor.tabs;

    if (tabs.length === 0) {
      state.editor.tabs.push(newTab);
    } else if (!tabs.some(tab => tab.moduleShortid === shortid)) {
      const dirtyTabIndex = tabs.findIndex(tab => tab.dirty);

      if (dirtyTabIndex >= 0) {
        state.editor.tabs.splice(dirtyTabIndex, 1, newTab);
      } else {
        state.editor.tabs.splice(0, 0, newTab);
      }
    }
  }

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(moduleEntry => moduleEntry.id === id);

  if (module && state.editor.currentModuleShortid !== module.shortid) {
    state.editor.currentModuleShortid = module.shortid;
  }
};
