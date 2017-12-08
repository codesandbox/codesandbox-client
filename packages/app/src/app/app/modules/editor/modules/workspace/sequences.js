import { set, toggle } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { ensureOwnedSandbox } from '../../sequences';

export const changeValue = [
  set(state`editor.workspace.project.${props`field`}`, props`value`),
];

export const updateSandboxInfo = [
  ensureOwnedSandbox,
  set(
    state`editor.sandboxes.${props`sandbox.id`}.title`,
    state`editor.workspace.project.title`
  ),
  set(
    state`editor.sandboxes.${props`sandbox.id`}.description`,
    state`editor.workspace.project.description`
  ),
  actions.updateSandbox,
];

export const toggleWorkspace = toggle(
  state`editor.workspace.isWorkspaceHidden`
);

export const addNpmDependency = [
  ensureOwnedSandbox,
  set(state`editor.workspace.isProcessingDependencies`, true),
  actions.addNpmDependency,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.npmDependencies`,
    props`npmDependencies`
  ),
  set(state`editor.workspace.isProcessingDependencies`, false),
];

export const removeNpmDependency = [
  ensureOwnedSandbox,
  set(state`editor.workspace.isProcessingDependencies`, true),
  actions.removeNpmDependency,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.npmDependencies`,
    props`npmDependencies`
  ),
  set(state`editor.workspace.isProcessingDependencies`, false),
];

export const addExternalResource = [
  ensureOwnedSandbox,
  set(state`editor.workspace.isProcessingDependencies`, true),
  actions.addExternalResource,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.externalResources`,
    props`externalResources`
  ),
  set(state`editor.workspace.isProcessingDependencies`, false),
];

export const removeExternalResource = [
  ensureOwnedSandbox,
  set(state`editor.workspace.isProcessingDependencies`, true),
  actions.removeExternalResource,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.externalResources`,
    props`externalResources`
  ),
  set(state`editor.workspace.isProcessingDependencies`, false),
];
