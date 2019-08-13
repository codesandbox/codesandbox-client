import { mapValues } from 'lodash-es';
import { Action, AsyncAction } from 'app/overmind';
import {
  Sandbox,
  Module,
  ModuleTab,
  TabType,
} from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
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
  const matchingSandbox = Object.keys(sandboxes).find(
    id => sandboxUrl(sandboxes[id]) === `${editorUrl()}${id}`
  );

  return matchingSandbox || id;
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
}> = async ({ state, effects, actions }, { code, moduleShortid }) => {
  effects.analytics.track('Save Code');

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );

  if (state.preferences.settings.prettifyOnSaveEnabled) {
    try {
      effects.analytics.track('Prettify Code');
      code = await effects.prettyfier.prettify(module.id, module.title, code);
    } catch (error) {
      effects.notificationToast.error(
        'Could not prettify code, probably invalid JSON in sandbox .prettierrc file'
      );
    }
  }

  actions.editor.internal.setModuleCode({
    module,
    code,
  });

  try {
    const updatedModule = await effects.api.saveModuleCode(sandbox.id, module);

    // There was some code here related to checking if module has changed
    // code during saving... but is that an issue? It should just indicate
    // that it needs saving as normal?
    module.insertedAt = updatedModule.insertedAt;
    module.updatedAt = updatedModule.updatedAt;
    module.savedCode = null;

    effects.moduleRecover.remove(sandbox.id, module);

    state.editor.changedModuleShortids.splice(
      state.editor.changedModuleShortids.indexOf(module.shortid),
      1
    );

    // Where does the ID come from?
    // effects.vscode.callCallback()

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
      effects.live.sendModuleUpdate(module.shortid);
    }

    await actions.editor.internal.updateCurrentTemplate();
  } catch (error) {
    effects.notificationToast.warning(error.message);
    // Where does the ID come from?
    // effects.vscode.callCallbackError()
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
  });
};

export const ensureSandboxIsOwned: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  if (
    !state.editor.currentSandbox.owned ||
    (state.editor.currentSandbox.owned &&
      state.editor.currentSandbox.isFrozen &&
      effects.browser.confirm(
        'This sandbox is frozen, and will be forked. Do you want to continue?'
      ))
  ) {
    return actions.editor.internal.forkSandbox(state.editor.currentId);
  } else if (
    state.editor.currentSandbox.owned &&
    state.editor.currentSandbox.isFrozen
  ) {
    // Where is the callback ID?
    // effects.vscode.callCallbackError(?, "Can't save a frozen sandbox")
  }
};

export const setModuleCode: Action<{
  module: Module;
  code: string;
}> = ({ state, effects }, { module, code }) => {
  const currentId = state.editor.currentId;
  const currentSandbox = state.editor.currentSandbox;

  if (!module.savedCode) {
    module.savedCode = module.code;
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
};

export const forkSandbox: AsyncAction<string> = async (
  { state, effects, actions },
  id
) => {
  const templateDefinition = getTemplateDefinition(
    state.editor.currentSandbox.template
  );

  if (templateDefinition.isServer) {
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

    actions.internal.setCurrentSandbox(forkedSandbox);

    effects.notificationToast.success('Forked sandbox!');
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
  });
};
