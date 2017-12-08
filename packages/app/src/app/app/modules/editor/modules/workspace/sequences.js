import { set, toggle } from 'cerebral/operators';
import { state } from 'cerebral/tags';

export const toggleWorkspace = toggle(
  state`editor.workspace.isWorkspaceHidden`
);

export const addNpmDependency = [
  set(state`editor.workspace.isProcessingNpmDependencies`, true),
  actions.addNpmDependency,
];
