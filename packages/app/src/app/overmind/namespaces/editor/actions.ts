import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { sortObjectByKeys } from 'app/overmind/utils/common';
import { withLoadApp } from 'app/overmind/factories';

export const internal = internalActions;

export const addNpmDependency: AsyncAction<{
  name: string;
  version?: string;
  isDev?: boolean;
}> = async ({ effects, actions, state }, { name, version, isDev }) => {
  effects.analytics.track('Add NPM Dependency');
  actions.internal.closeModals(false);

  await actions.editor.internal.ensureOwnedEditable();

  if (!version) {
    version = await actions.editor.internal.getLatestVersion(name);
  }

  const { code } = actions.editor.internal.addNpmDependencyToPackage({
    name,
    version,
    isDev,
  });

  actions.editor.internal.saveCode({
    code,
    moduleShortid: state.editor.currentModuleShortid,
  });
};

export const sandboxChanged: AsyncAction<string> = withLoadApp(
  async ({ state, actions }, id) => {
    state.editor.error = null;

    id = actions.editor.internal.setIdFromAlias(id);

    if (state.editor.sandboxes[id] && !state.editor.sandboxes[id].team) {
      actions.internal.setSandbox(state.editor.sandboxes[id]);
      actions.internal.refetchSandboxInfo();
    } else {
      state.editor.isLoading = true;
      state.editor.notFound = false;
      // Only reset changed modules if sandbox wasn't in memory, otherwise a fork
      // can mark real changed modules as unchanged
      state.editor.changedModuleShortids = [];

      try {
        const sandbox = await actions.internal.getSandbox(id);
        actions.internal.joinLiveSessionIfAvailable(sandbox);
        actions.internal.ensurePackageJSON({
          sandbox,
          newCode: null,
        });
      } catch (error) {
        state.editor.notFound = true;
        state.editor.error = error.message;
      }

      state.editor.isLoading = false;
    }
  }
);

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

export const npmDependencyRemoved: AsyncAction<string> = async (
  { state, effects, actions },
  name
) => {
  effects.analytics.track('Remove NPM Dependency');
  await actions.editor.internal.ensureOwnedEditable();
  const { parsed } = state.editor.parsedConfigurations.package;

  delete parsed.dependencies[name];
  parsed.dependencies = sortObjectByKeys(parsed.dependencies);

  await actions.editor.internal.saveCode({
    code: JSON.stringify(parsed, null, 2),
    moduleShortid: state.editor.currentPackageJSON.shortid,
  });
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
  } else {
  }
};

export const codeChanged: Action<{
  code: string;
  moduleShortid: string;
  ignoreLive?: boolean;
}> = ({ effects, state, actions }, { code, moduleShortid, ignoreLive }) => {
  effects.analytics.track('Change Code', null, { trackOnce: true });

  if (state.live.isLive && !ignoreLive) {
    state.live.receivingCode = true;
    const operation = actions.live.internal.getCodeOperation({
      moduleShortid,
      code,
    });

    actions.live.internal.sendTransform({
      operation,
      moduleShortid,
    });

    actions.editor.internal.setCode({
      moduleShortid,
      code,
    });

    state.live.receivingCode = false;
  } else {
    actions.editor.internal.setCode({
      moduleShortid,
      code,
    });
  }

  actions.editor.internal.addChangedModule(moduleShortid);
  actions.editor.internal.unsetDirtyTab();
};

export const saveClicked: AsyncAction = async ({ state, actions }) => {
  await actions.editor.internal.ensureOwnedEditable();
  const changedModules = actions.editor.internal.outputChangedModules();
  await actions.editor.internal.saveChangedModules(changedModules);
  actions.editor.internal.removeChangedModules(changedModules);

  if (
    state.editor.currentSandbox.originalGit &&
    state.workspace.openedWorkspaceItem === 'github'
  ) {
    actions.git.internal.fetchGitChanges();
  }
};
