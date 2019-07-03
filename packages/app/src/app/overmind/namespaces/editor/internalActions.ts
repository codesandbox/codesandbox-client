import { fromPairs, toPairs, sortBy, mapValues } from 'lodash-es';
import { Action, AsyncAction } from 'app/overmind';
import { Sandbox, Module } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import getTemplate from '@codesandbox/common/lib/templates';
import { getTemplate as computeTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';

function sortObjectByKeys(object) {
  return fromPairs(sortBy(toPairs(object)));
}

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
  await actions.internal.ensureOwnedEditable();

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
