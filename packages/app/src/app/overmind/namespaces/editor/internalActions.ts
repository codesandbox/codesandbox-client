import getTemplateDefinition, {
  TemplateType,
} from '@codesandbox/common/lib/templates';
import {
  Module,
  ModuleTab,
  Sandbox,
  ServerContainerStatus,
  TabType,
} from '@codesandbox/common/lib/types';
import {
  captureException,
  logBreadcrumb,
} from '@codesandbox/common/lib/utils/analytics/sentry';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import slugify from '@codesandbox/common/lib/utils/slugify';
import {
  editorUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Action, AsyncAction } from 'app/overmind';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import { getTemplate as computeTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';
import { mapValues } from 'lodash-es';

export const ensureSandboxId: Action<string, string> = ({ state }, id) => {
  if (state.editor.sandboxes[id]) {
    return id;
  }

  const { sandboxes } = state.editor;
  const matchingSandboxId = Object.keys(sandboxes).find(
    // @ts-ignore
    idItem => sandboxUrl(sandboxes[idItem]) === `${editorUrl()}${id}`
  );

  return matchingSandboxId || id;
};

export const initializeSandbox: AsyncAction<Sandbox> = async (
  { actions, effects },
  sandbox
) => {
  await Promise.all([
    actions.editor.internal.initializeLiveSandbox(sandbox),
    actions.editor.loadCollaborators({ sandboxId: sandbox.id }),
    actions.editor.listenToSandboxChanges({ sandboxId: sandbox.id }),
  ]);
};

export const initializeLiveSandbox: AsyncAction<Sandbox> = async (
  { state, actions },
  sandbox
) => {
  state.live.isTeam = Boolean(sandbox.team);

  if (state.live.isLive && state.live.roomInfo) {
    const roomChanged = state.live.roomInfo.roomId !== sandbox.roomId;

    if (!roomChanged) {
      // In this case we don't need to initialize new live session, we reuse the existing one
      return;
    }

    if (
      // If the joinSource is /live/ and the user is only a viewer,
      // we won't get the roomId and the user will disconnect automatically,
      // we want to prevent this by only re-initializing the live session on joinSource === 'sandbox'. Because
      // for joinSource === 'sandbox' we know for sure that the user will get a roomId if they have permissions
      // to join
      state.live.joinSource === 'sandbox'
    ) {
      actions.live.internal.disconnect();
    }
  }

  if (sandbox.roomId) {
    await actions.live.internal.initialize(sandbox.roomId);
  }
};

export const updateSelectionsOfModule: AsyncAction<{ module: Module }> = async (
  { actions, effects },
  { module }
) => {
  effects.vscode.updateUserSelections(
    module,
    actions.live.internal.getSelectionsForModule(module)
  );
};

export const setModuleSavedCode: Action<{
  moduleShortid: string;
  savedCode: string | null;
}> = ({ state }, { moduleShortid, savedCode }) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  const moduleIndex = sandbox.modules.findIndex(
    m => m.shortid === moduleShortid
  );

  if (moduleIndex > -1) {
    const module = state.editor.sandboxes[sandbox.id].modules[moduleIndex];

    if (savedCode === undefined) {
      logBreadcrumb({
        type: 'error',
        message: `SETTING UNDEFINED SAVEDCODE FOR CODE: ${module.code}`,
      });
      captureException(new Error('SETTING UNDEFINED SAVEDCODE'));
    }

    module.savedCode = module.code === savedCode ? null : savedCode;
  }
};

export const saveCode: AsyncAction<{
  code: string;
  moduleShortid: string;
  cbID?: string | null;
}> = async ({ state, effects, actions }, { code, moduleShortid, cbID }) => {
  effects.analytics.track('Save Code');

  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  const module = sandbox.modules.find(m => m.shortid === moduleShortid);

  if (!module) {
    return;
  }

  try {
    await effects.live.saveModule(module.shortid);
    const updatedModule = await effects.api.saveModuleCode(
      sandbox.id,
      module.shortid,
      code
    );

    module.insertedAt = updatedModule.insertedAt;
    module.updatedAt = updatedModule.updatedAt;

    const savedCode =
      updatedModule.code === module.code ? null : updatedModule.code;

    module.savedCode = savedCode;

    effects.vscode.sandboxFsSync.writeFile(state.editor.modulesByPath, {
      ...module,
      code,
    });
    effects.moduleRecover.remove(sandbox.id, module);

    if (cbID) {
      effects.vscode.callCallback(cbID);
    }

    if (
      sandbox.originalGit &&
      state.workspace.openedWorkspaceItem === 'github'
    ) {
      state.git.isFetching = true;
      state.git.originalGitChanges = await effects.api.getGitChanges(
        sandbox.id
      );
      state.git.isFetching = false;
    }

    // If the executor is a server we only should send updates if the sandbox has been
    // started already
    if (
      !effects.executor.isServer() ||
      state.server.containerStatus === ServerContainerStatus.SANDBOX_STARTED
    ) {
      effects.executor.updateFiles(sandbox);
    }

    await actions.editor.internal.updateCurrentTemplate();

    effects.vscode.runCommand('workbench.action.keepEditor');

    const tabs = state.editor.tabs as ModuleTab[];
    const tab = tabs.find(
      tabItem => tabItem.moduleShortid === updatedModule.shortid
    );

    if (tab) {
      tab.dirty = false;
    }
  } catch (error) {
    actions.internal.handleError({
      message: 'There was a problem with saving the code, please try again',
      error,
    });

    if (cbID) {
      effects.vscode.callCallbackError(cbID, error.message);
    }
  }
};

export const updateCurrentTemplate: AsyncAction = async ({
  effects,
  state,
}) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  try {
    const currentTemplate = state.editor.currentSandbox.template;
    const templateDefinition = getTemplateDefinition(currentTemplate);

    // We always want to be able to update server template based on its detection.
    // We only want to update the client template when it's explicitly specified
    // in the sandbox configuration.
    if (
      templateDefinition.isServer ||
      state.editor.parsedConfigurations?.sandbox?.parsed?.template
    ) {
      const { parsed = {} } = state.editor.parsedConfigurations?.package || {};

      const modulesByPath = mapValues(state.editor.modulesByPath, module => ({
        // No idea why this typing fails!
        // @ts-ignore
        content: module.code || '',
        // @ts-ignore
        isBinary: module.isBinary,
      }));

      // TODO: What is a template really? Two different kinds of templates here, need to fix the types
      // Talk to Ives and Bogdan
      const newTemplate = (computeTemplate(parsed, modulesByPath) ||
        'node') as TemplateType;

      if (
        newTemplate !== currentTemplate &&
        templateDefinition.isServer ===
          getTemplateDefinition(newTemplate).isServer
      ) {
        state.editor.currentSandbox.template = newTemplate;
        await effects.api.saveTemplate(
          state.editor.currentSandbox.id,
          newTemplate
        );
      }
    }
  } catch (e) {
    // We don't want this to be blocking at all, it's low prio
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }
  }
};

export const removeNpmDependencyFromPackageJson: AsyncAction<string> = async (
  { state, actions, effects },
  name
) => {
  if (
    !state.editor.currentPackageJSONCode ||
    !state.editor.currentPackageJSON
  ) {
    return;
  }

  const packageJson = JSON.parse(state.editor.currentPackageJSONCode);

  delete packageJson.dependencies[name];

  const code = JSON.stringify(packageJson, null, 2);
  const moduleShortid = state.editor.currentPackageJSON.shortid;
  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  effects.vscode.setModuleCode({ ...module, code }, true);
  module.code = code;

  await actions.editor.codeSaved({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const addNpmDependencyToPackageJson: AsyncAction<{
  name: string;
  version?: string;
  isDev: boolean;
}> = async ({ state, actions, effects }, { name, isDev, version }) => {
  if (
    !state.editor.currentPackageJSONCode ||
    !state.editor.currentPackageJSON
  ) {
    return;
  }

  const packageJson = JSON.parse(state.editor.currentPackageJSONCode);

  const type = isDev ? 'devDependencies' : 'dependencies';

  packageJson[type] = packageJson[type] || {};
  packageJson[type][name] = version || 'latest';
  packageJson[type] = sortObjectByKeys(packageJson[type]);

  const code = JSON.stringify(packageJson, null, 2);
  const moduleShortid = state.editor.currentPackageJSON.shortid;

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  effects.vscode.setModuleCode({ ...module, code }, true);
  module.code = code;

  await actions.editor.codeSaved({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const setStateModuleCode: Action<{
  module: Module;
  code: string;
}> = ({ state, effects }, { module, code }) => {
  const { currentSandbox } = state.editor;

  if (!currentSandbox) {
    return;
  }

  if (module.savedCode === null) {
    module.savedCode = module.code;
  }

  effects.vscode.runCommand('workbench.action.keepEditor');

  const tabs = state.editor.tabs as ModuleTab[];
  const tab = tabs.find(tabItem => tabItem.moduleShortid === module.shortid);

  if (tab) {
    tab.dirty = false;
  }

  // Save the code to localStorage so we can recover in case of a crash
  effects.moduleRecover.save(
    currentSandbox.id,
    currentSandbox.version,
    module,
    code,
    module.savedCode
  );

  module.code = code;
};

export const forkSandbox: AsyncAction<{
  sandboxId: string;
  body?: { collectionId: string | undefined };
  openInNewWindow?: boolean;
}> = async (
  { state, effects, actions },
  { sandboxId: id, body, openInNewWindow = false }
) => {
  const sandbox = state.editor.currentSandbox;
  const currentSandboxId = state.editor.currentId;

  if (!sandbox || !currentSandboxId) {
    return;
  }

  const templateDefinition = getTemplateDefinition(
    sandbox ? sandbox.template : null
  );

  if (!state.isLoggedIn && templateDefinition.isServer) {
    effects.analytics.track('Show Server Fork Sign In Modal');
    actions.modalOpened({ modal: 'forkServerModal' });

    return;
  }

  effects.analytics.track('Fork Sandbox');

  try {
    state.editor.isForkingSandbox = true;

    const forkedSandbox = await effects.api.forkSandbox(id, body);

    // Copy over any unsaved code
    Object.assign(forkedSandbox, {
      modules: forkedSandbox.modules.map(module => {
        const foundEquivalentModule = sandbox.modules.find(
          currentSandboxModule =>
            currentSandboxModule.shortid === module.shortid
        );

        if (!foundEquivalentModule) {
          return module;
        }

        return {
          ...module,
          savedCode: foundEquivalentModule.savedCode,
          code: foundEquivalentModule.code,
        };
      }),
    });

    state.workspace.project.title = forkedSandbox.title || '';
    state.workspace.project.description = forkedSandbox.description || '';
    state.workspace.project.alias = forkedSandbox.alias || '';

    Object.assign(state.editor.sandboxes[currentSandboxId]!, forkedSandbox);
    state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(
      forkedSandbox
    );
    effects.preview.updateAddressbarUrl();

    if (templateDefinition.isServer) {
      effects.preview.refresh();
      actions.server.startContainer(forkedSandbox);
    }

    if (state.workspace.openedWorkspaceItem === 'project-summary') {
      actions.workspace.openDefaultItem();
    }

    effects.notificationToast.success('Forked sandbox!');

    if (templateDefinition.isServer) {
      actions.editor.showEnvironmentVariablesNotification();
    }

    effects.router.updateSandboxUrl(forkedSandbox, { openInNewWindow });
  } catch (error) {
    console.error(error);
    actions.internal.handleError({
      message: 'We were unable to fork the sandbox',
      error,
    });

    state.editor.isForkingSandbox = false;
    throw error;
  }
};

export const setCurrentModule: AsyncAction<Module> = async (
  { state, effects },
  module
) => {
  state.editor.currentTabId = null;

  const tabs = state.editor.tabs as ModuleTab[];
  const tab = tabs.find(tabItem => tabItem.moduleShortid === module.shortid);

  if (!tab) {
    const dirtyTabIndex = tabs.findIndex(tabItem => tabItem.dirty);
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
  await effects.vscode.openModule(module);
  effects.vscode.setErrors(state.editor.errors);
  effects.vscode.setCorrections(state.editor.corrections);
};

export const updateSandboxPackageJson: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;

  if (
    !sandbox ||
    !state.editor.parsedConfigurations?.package?.parsed ||
    !state.editor.currentPackageJSON
  ) {
    return;
  }

  if (!hasPermission(sandbox.authorization, 'write_code')) {
    return;
  }

  const { parsed } = state.editor.parsedConfigurations.package;

  parsed.keywords = sandbox.tags;
  parsed.name = slugify(sandbox.title || sandbox.id);
  parsed.description = sandbox.description;

  const code = JSON.stringify(parsed, null, 2);
  const moduleShortid = state.editor.currentPackageJSON.shortid;

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module) {
    return;
  }

  effects.vscode.setModuleCode({ ...module, code }, true);
  module.code = code;

  await actions.editor.codeSaved({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const updateDevtools: AsyncAction<{
  code: string;
}> = async ({ state, actions }, { code }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  if (state.editor.currentSandbox.owned) {
    const devtoolsModule =
      state.editor.modulesByPath['/.codesandbox/workspace.json'];

    if (devtoolsModule) {
      actions.editor.codeChanged({
        moduleShortid: devtoolsModule.shortid,
        code,
      });
      await actions.editor.codeSaved({
        code,
        moduleShortid: devtoolsModule.shortid,
        cbID: null,
      });
    } else {
      await actions.files.createModulesByPath({
        files: {
          '/.codesandbox/workspace.json': {
            content: code,
            isBinary: false,
          },
        },
      });
    }
  } else {
    state.editor.workspaceConfigCode = code;
  }
};

export const updatePreviewCode: Action = ({ state, effects }) => {
  if (state.preferences.settings.instantPreviewEnabled) {
    effects.preview.executeCodeImmediately();
  } else {
    effects.preview.executeCode();
  }
};
