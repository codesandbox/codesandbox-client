import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import getTemplateDefinition from '@codesandbox/common/lib/templates';

export const internal = internalActions;

export const addNpmDependency: AsyncAction<{
  name: string;
  version?: string;
  isDev?: boolean;
}> = async ({ effects, actions, state }, { name, version, isDev }) => {
  effects.analytics.track('Add NPM Dependency');
  actions.internal.closeModals(false);

  await actions.internal.ensureOwnedEditable();

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
