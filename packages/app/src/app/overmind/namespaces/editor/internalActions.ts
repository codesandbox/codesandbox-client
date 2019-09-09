import { mapValues } from 'lodash-es';
import { Action, AsyncAction } from 'app/overmind';
import {
  Module,
  ModuleTab,
  TabType,
  ServerContainerStatus,
} from '@codesandbox/common/lib/types';
import getTemplate from '@codesandbox/common/lib/templates';
import { getTemplate as computeTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import slugify from '@codesandbox/common/lib/utils/slugify';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import {
  sandboxUrl,
  editorUrl,
} from '@codesandbox/common/lib/utils/url-generator';

export const ensureSandboxId: Action<string, string> = ({ state }, id) => {
  if (state.editor.sandboxes[id]) {
    return id;
  }

  const sandboxes = state.editor.sandboxes;
  const matchingSandboxId = Object.keys(sandboxes).find(
    idItem => sandboxUrl(sandboxes[idItem]) === `${editorUrl()}${id}`
  );

  return matchingSandboxId || id;
};

export const setModuleSavedCode: Action<{
  moduleShortid: string;
  savedCode: string;
}> = ({ state }, { moduleShortid, savedCode }) => {
  const sandbox = state.editor.currentSandbox;

  const moduleIndex = sandbox.modules.findIndex(
    m => m.shortid === moduleShortid
  );

  if (moduleIndex > -1) {
    state.editor.sandboxes[sandbox.id].modules[
      moduleIndex
    ].savedCode = savedCode;
  }
};

export const saveCode: AsyncAction<{
  code: string;
  moduleShortid: string;
  cbID: string;
}> = async ({ state, effects, actions }, { code, moduleShortid, cbID }) => {
  effects.analytics.track('Save Code');

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );

  if (state.preferences.settings.experimentVSCode) {
    await actions.editor.codeChanged({
      code,
      moduleShortid,
    });
  } else if (state.preferences.settings.prettifyOnSaveEnabled) {
    try {
      effects.analytics.track('Prettify Code');
      code = await effects.prettyfier.prettify(module.id, module.title, code);
    } catch (error) {
      effects.notificationToast.error(
        'Could not prettify code, probably invalid JSON in sandbox .prettierrc file'
      );
    }
  }

  try {
    const updatedModule = await effects.api.saveModuleCode(sandbox.id, module);

    module.insertedAt = updatedModule.insertedAt;
    module.updatedAt = updatedModule.updatedAt;
    module.savedCode =
      updatedModule.code === module.code ? null : updatedModule.code;

    effects.moduleRecover.remove(sandbox.id, module);

    state.editor.changedModuleShortids.splice(
      state.editor.changedModuleShortids.indexOf(module.shortid),
      1
    );

    effects.vscode.callCallback(cbID);

    if (
      state.editor.currentSandbox.originalGit &&
      state.workspace.openedWorkspaceItem === 'github'
    ) {
      state.git.isFetching = true;
      state.git.originalGitChanges = await effects.api.getGitChanges(
        sandbox.id
      );
      state.git.isFetching = false;
    }

    if (state.live.isLive && state.live.isCurrentEditor) {
      effects.live.sendModuleUpdate(module.shortid, module);
    }

    await actions.editor.internal.updateCurrentTemplate();

    if (state.preferences.settings.experimentVSCode) {
      effects.vscode.runCommand('workbench.action.keepEditor');
    }

    const tabs = state.editor.tabs as ModuleTab[];
    const tab = tabs.find(
      tabItem => tabItem.moduleShortid === updatedModule.shortid
    );

    if (tab) {
      tab.dirty = false;
    }
  } catch (error) {
    effects.notificationToast.warning(error.message);
    effects.vscode.callCallbackError(cbID);
  }
};

export const updateCurrentTemplate: Action = ({ state, effects }) => {
  try {
    const currentTemplate = state.editor.currentSandbox.template;
    const templateDefinition = getTemplate(currentTemplate);

    // We always want to be able to update server template based on its detection.
    // We only want to update the client template when it's explicitly specified
    // in the sandbox configuration.
    if (
      templateDefinition.isServer ||
      state.editor.parsedConfigurations.sandbox.parsed.template
    ) {
      const { parsed } = state.editor.parsedConfigurations.package;

      const modulesByPath = mapValues(state.editor.modulesByPath, module => ({
        content: module.code,
        isBinary: module.isBinary,
      }));

      // TODO: What is a templat really? Two different kinds of templates here, need to fix the types
      // Talk to Ives and Bogdan
      const newTemplate =
        computeTemplate(parsed, modulesByPath) || ('node' as any);

      if (
        newTemplate !== currentTemplate &&
        templateDefinition.isServer === getTemplate(newTemplate).isServer
      ) {
        state.editor.currentSandbox.template = newTemplate;
        effects.api.saveTemplate(state.editor.currentId, newTemplate);
      }
    }
  } catch (e) {
    // We don't want this to be blocking at all, it's low prio
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
  }
};

export const addNpmDependencyToPackageJson: AsyncAction<{
  name: string;
  version?: string;
  isDev: boolean;
}> = async ({ state, actions }, { name, isDev, version }) => {
  const { parsed } = state.editor.parsedConfigurations.package;

  const type = isDev ? 'devDependencies' : 'dependencies';

  parsed[type] = parsed[type] || {};
  parsed[type][name] = version || 'latest';
  parsed[type] = sortObjectByKeys(parsed[type]);

  await actions.editor.internal.saveCode({
    code: JSON.stringify(parsed, null, 2),
    moduleShortid: state.editor.currentPackageJSON.shortid,
    cbID: null,
  });
};

export const setModuleCode: Action<{
  module: Module;
  code: string;
}> = ({ state, effects }, { module, code }) => {
  const currentId = state.editor.currentId;
  const currentSandbox = state.editor.currentSandbox;
  const hasChangedModuleId = state.editor.changedModuleShortids.includes(
    module.shortid
  );

  if (!module.savedCode) {
    module.savedCode = module.code;
  }

  if (hasChangedModuleId && module.savedCode === code) {
    state.editor.changedModuleShortids.splice(
      state.editor.changedModuleShortids.indexOf(module.shortid),
      1
    );
  } else if (!hasChangedModuleId && module.savedCode !== code) {
    state.editor.changedModuleShortids.push(module.shortid);
  }

  if (state.preferences.settings.experimentVSCode) {
    effects.vscode.runCommand('workbench.action.keepEditor');
  }

  const tabs = state.editor.tabs as ModuleTab[];
  const tab = tabs.find(tabItem => tabItem.moduleShortid === module.shortid);

  if (tab) {
    tab.dirty = false;
  }

  // Save the code to localStorage so we can recover in case of a crash
  effects.moduleRecover.save(
    currentId,
    currentSandbox.version,
    module,
    code,
    module.savedCode
  );

  module.code = code;

  // If the executor is a server we only should send updates if the sandbox has been
  // started already
  if (
    !effects.executor.isServer() ||
    state.server.containerStatus === ServerContainerStatus.SANDBOX_STARTED
  ) {
    effects.executor.updateFiles(currentSandbox);
  }
};

export const forkSandbox: AsyncAction<string> = async (
  { state, effects, actions },
  id
) => {
  const templateDefinition = getTemplateDefinition(
    state.editor.currentSandbox ? state.editor.currentSandbox.template : null
  );

  if (!state.isLoggedIn && templateDefinition.isServer) {
    effects.analytics.track('Show Server Fork Sign In Modal');
    actions.modalOpened({ modal: 'forkServerModal', message: null });

    return;
  }

  effects.analytics.track('Fork Sandbox');

  try {
    state.editor.isForkingSandbox = true;

    const forkedSandbox = await effects.api.forkSandbox(id);

    // Copy over any unsaved code
    if (state.editor.currentSandbox) {
      Object.assign(forkedSandbox, {
        modules: forkedSandbox.modules.map(module => ({
          ...module,
          code: state.editor.currentSandbox.modules.find(
            currentSandboxModule =>
              currentSandboxModule.shortid === module.shortid
          ).code,
        })),
      });
    }

    await actions.internal.setCurrentSandbox(forkedSandbox);
    effects.notificationToast.success('Forked sandbox!');
    effects.router.updateSandboxUrl(forkedSandbox);
  } catch (error) {
    effects.notificationToast.error('Sorry, unable to fork this sandbox');
  }

  state.editor.isForkingSandbox = false;
};

export const setCurrentModule: Action<Module> = ({ state }, module) => {
  state.editor.currentTabId = null;

  const tabs = state.editor.tabs as ModuleTab[];
  const tab = tabs.find(tab => tab.moduleShortid === module.shortid);

  if (!tab) {
    const dirtyTabIndex = tabs.findIndex(tab => tab.dirty);
    const newTab: ModuleTab = {
      type: TabType.MODULE,
      moduleShortid: module.shortid,
      dirty: true,
    };

    if (dirtyTabIndex >= 0) {
      state.editor.tabs.splice(dirtyTabIndex, 1, newTab);
    } else {
      state.editor.tabs.splice(0, 0, newTab);
    }
  }

  state.editor.currentModuleShortid = module.shortid;
};

export const updateSandboxPackageJson: AsyncAction = async ({
  state,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;
  const { parsed } = state.editor.parsedConfigurations.package;

  parsed.keywords = sandbox.tags;
  parsed.name = slugify(sandbox.title || sandbox.id);
  parsed.description = sandbox.description;

  const code = JSON.stringify(parsed, null, 2);
  const moduleShortid = state.editor.currentPackageJSON.shortid;

  await actions.editor.internal.saveCode({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const updateDevtools: AsyncAction<{
  code: string;
}> = async ({ state, actions }, { code }) => {
  if (state.editor.currentSandbox.owned) {
    const devtoolsModule =
      state.editor.modulesByPath['/.codesandbox/workspace.json'];

    if (devtoolsModule) {
      await actions.editor.internal.saveCode({
        code: devtoolsModule.code,
        moduleShortid: devtoolsModule.shortid,
        cbID: null,
      });
    } else {
      await actions.files.createModulesByPath({
        '/.codesandbox/workspace.json': {
          content: code,
          isBinary: false,
        },
      });
    }
  } else {
    state.editor.workspaceConfigCode = code;
  }
};
