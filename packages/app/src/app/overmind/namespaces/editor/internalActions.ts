import getTemplateDefinition, {
  TemplateType,
} from '@codesandbox/common/lib/templates';
import { ViewConfig } from '@codesandbox/common/lib/templates/template';
import {
  Module,
  ModuleTab,
  Sandbox,
  ServerContainerStatus,
  TabType,
} from '@codesandbox/common/lib/types';
import { captureException } from '@codesandbox/common/lib/utils/analytics/sentry';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import slugify from '@codesandbox/common/lib/utils/slugify';
import {
  editorUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Context } from 'app/overmind';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import { getTemplate as computeTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';
import { mapValues } from 'lodash-es';

export const ensureSandboxId = ({ state }: Context, id: string) => {
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

export const initializeSandbox = async (
  { actions }: Context,
  sandbox: Sandbox
) => {
  await Promise.all([
    actions.editor.internal.initializeLiveSandbox(sandbox),
    actions.editor.loadCollaborators({ sandboxId: sandbox.id }),
    actions.editor.listenToSandboxChanges({ sandboxId: sandbox.id }),
    actions.internal.switchCurrentWorkspaceBySandbox({ sandbox }),
    actions.getSandboxesLimits(),
  ]);
};

export const initializeLiveSandbox = async (
  { state, actions }: Context,
  sandbox: Sandbox
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

export const updateSelectionsOfModule = async (
  { actions, effects }: Context,
  { module }: { module: Module }
) => {
  effects.vscode.updateUserSelections(
    module,
    actions.live.internal.getSelectionsForModule(module)
  );
};

export const setModuleSavedCode = (
  { state }: Context,
  {
    moduleShortid,
    savedCode,
  }: {
    moduleShortid: string;
    savedCode: string | null;
  }
) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  const moduleIndex = sandbox.modules.findIndex(
    m => m.shortid === moduleShortid
  );

  if (moduleIndex > -1) {
    const module = sandbox.modules[moduleIndex];

    module.savedCode = module.code === savedCode ? null : savedCode;
  }
};

export const saveCode = async (
  { state, effects, actions }: Context,
  {
    code,
    moduleShortid,
    cbID,
  }: {
    code: string;
    moduleShortid: string;
    cbID?: string | null;
  }
) => {
  effects.analytics.track('Save Code');

  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  const module = sandbox.modules.find(m => m.shortid === moduleShortid);

  if (!module) {
    return;
  }

  effects.preview.executeCodeImmediately();

  try {
    let updatedModule: {
      updatedAt: string;
      insertedAt: string;
      code: string;
      isBinary: boolean;
    };
    if (sandbox.featureFlags.comments) {
      await effects.live.waitForLiveReady();
      const {
        saved_code,
        updated_at,
        inserted_at,
      } = await effects.live.saveModule(module);

      updatedModule = {
        code: saved_code,
        updatedAt: updated_at,
        insertedAt: inserted_at,
        isBinary: false,
      };
    } else {
      updatedModule = await effects.api.saveModuleCode(
        sandbox.id,
        module.shortid,
        code
      );
    }

    module.insertedAt = updatedModule.insertedAt;
    module.updatedAt = updatedModule.updatedAt;
    module.isBinary = updatedModule.isBinary;

    if (!effects.vscode.isModuleOpened(module)) {
      module.code = updatedModule.code;
    }
    const savedCode =
      updatedModule.code === module.code ? null : updatedModule.code;

    module.savedCode = savedCode;

    if (savedCode === null) {
      // If the savedCode is also module.code
      effects.moduleRecover.remove(sandbox.id, module);
      effects.vscode.syncModule(module);
    }

    if (
      state.live.isLive &&
      state.live.isCurrentEditor &&
      !sandbox.featureFlags.comments
    ) {
      setTimeout(() => {
        // Send the save event 50ms later so the operation can be sent first (the operation that says the
        // file difference created by VSCode due to the file watch event). If the other client gets the save before the operation,
        // the other client will also send an operation with the same difference resulting in a duplicate event.
        effects.live.sendModuleSaved(module);
      }, 50);
    }

    effects.vscode.sandboxFsSync.writeFile(state.editor.modulesByPath, module);

    if (cbID) {
      effects.vscode.callCallback(cbID);
    }

    // If the executor is a server we only should send updates if the sandbox has been
    // started already
    if (
      !effects.executor.isServer() ||
      state.server.containerStatus === ServerContainerStatus.SANDBOX_STARTED
    ) {
      effects.executor.updateFiles(sandbox);
    }

    if (sandbox.template === 'static') {
      effects.preview.refresh();
    }

    await actions.editor.internal.updateCurrentTemplate();

    effects.vscode.runCommand('workbench.action.keepEditor');
  } catch (error) {
    actions.internal.handleError({
      message: 'There was a problem with saving the code, please try again',
      error,
    });
    captureException(error);

    if (cbID) {
      effects.vscode.callCallbackError(cbID, error.message);
    }
  }
};

export const updateCurrentTemplate = async ({ effects, state }: Context) => {
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

export const removeNpmDependencyFromPackageJson = async (
  { state, actions }: Context,
  name: string
) => {
  if (
    !state.editor.currentSandbox ||
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

  actions.editor.setCode({ moduleShortid, code });

  await actions.editor.codeSaved({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const addNpmDependencyToPackageJson = async (
  { state, actions }: Context,
  {
    name,
    isDev,
    version,
  }: {
    name: string;
    version?: string;
    isDev: boolean;
  }
) => {
  if (
    !state.editor.currentSandbox ||
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

  actions.editor.setCode({ moduleShortid, code });

  await actions.editor.codeSaved({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const updateModuleCode = (
  { state, effects }: Context,
  {
    module,
    code,
  }: {
    module: Module;
    code: string;
  }
) => {
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

  module.code = code;
  // Save the code to localStorage so we can recover in case of a crash
  effects.moduleRecover.save(currentSandbox.id, currentSandbox.version, module);
};

// TODO: We can make this function simpler or we can also make a different convertSandbox
// action for when we don't fork it, but change it to a v2 sandbox.
export const forkSandbox = async (
  { state, effects, actions }: Context,
  {
    sandboxId: id,
    teamId,
    body,
    openInNewWindow = false,
  }: {
    sandboxId: string;
    teamId?: string | null;
    body?: { collectionId: string | undefined };
    openInNewWindow?: boolean;
  }
) => {
  const sandbox = state.editor.currentSandbox;
  const currentSandboxId = state.editor.currentId;

  if (!sandbox || !currentSandboxId) {
    return;
  }

  const templateDefinition = getTemplateDefinition(
    sandbox ? sandbox.template : null
  );

  // If the user is not signed in and the sandbox is exectued in a server container
  // we can't fork.
  if (!state.isLoggedIn && templateDefinition.isServer) {
    // So we track this happens
    effects.analytics.track('Show Server Fork Sign In Modal');
    // And open a modal (alert) to show a sign in button
    actions.modalOpened({ modal: 'forkServerModal' });

    // Throwing an error here ensures that it get's caught in the "withOwnedSandbox" function
    // when it tries to execute forkSandbox. When we just return instead of throwing the error
    // is not caught and "withOwnedSandbox" will run its "continueAction" which, in case of the
    // "codeSaved" function will continue to save code, with all kinds of actions and api calls.
    throw new Error('ERR_ANON_SSE_FORK');
  }

  effects.analytics.track('Fork Sandbox', {
    template: sandbox.customTemplate?.title,
    sandboxId: sandbox.id,
  });

  try {
    state.editor.isForkingSandbox = true;

    const usedBody: {
      collectionId?: string;
      teamId?: string;
    } = body || {};

    if (state.user) {
      if (teamId === undefined && state.activeTeam) {
        usedBody.teamId = state.activeTeam;
      } else if (teamId !== null) {
        usedBody.teamId = teamId;
      }
    }

    const forkedSandbox = await effects.api.forkSandbox(id, usedBody);

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

    effects.vscode.clearComments();
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

    if (sandbox.originalGit) {
      actions.git.loadGitSource();
    }

    actions.internal.currentSandboxChanged();
    await actions.getSandboxesLimits();
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

export const setCurrentModule = async (
  { state, effects }: Context,
  module: Module
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

export const updateSandboxPackageJson = async ({ state, actions }: Context) => {
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

  const module = sandbox.modules.find(m => m.shortid === moduleShortid);

  if (!module) {
    return;
  }

  actions.editor.setCode({ moduleShortid, code });

  await actions.editor.codeSaved({
    code,
    moduleShortid,
    cbID: null,
  });
};

export const updateDevtools = async (
  { state, actions }: Context,
  viewConfig: ViewConfig[]
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  await actions.files.updateWorkspaceConfig({
    preview: viewConfig,
  });
};

export const updatePreviewCode = ({ state, effects }: Context) => {
  if (state.preferences.settings.instantPreviewEnabled) {
    effects.preview.executeCodeImmediately();
  } else {
    effects.preview.executeCode();
  }
};
