import { set, toggle } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions'

export const changeValue = [
  set(state`editor.workspace.project.${props`field`}`, props`value`),
];

export const updateSandboxInfo = [
  set(state`editor.workspace.project.title`, props`title`),
  set(state`editor.workspace.project.description`, props`description`),
]

export const toggleWorkspace = toggle(
  state`editor.workspace.isWorkspaceHidden`
);

export const addNpmDependency = [
  set(state`editor.workspace.isProcessingNpmDependencies`, true),
  actions.addNpmDependency,
];
