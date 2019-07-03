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

export const codeChanged: Action<{ code: string; moduleShortid: string }> = (
  { state },
  { code, moduleShortid }
) => {};
