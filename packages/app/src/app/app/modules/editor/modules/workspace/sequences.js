import { set, toggle, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { ensureOwnedSandbox } from '../../sequences';

export const changeValue = [
  set(state`editor.workspace.project.${props`field`}`, props`value`),
];

export const updateSandboxInfo = [
  ensureOwnedSandbox,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.title`,
    state`editor.workspace.project.title`
  ),
  set(
    state`editor.sandboxes.${state`editor.currentId`}.description`,
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

export const deleteModule = [
  ensureOwnedSandbox,
  actions.deleteModule,
  actions.removeModule,
];

export const createModule = [
  ensureOwnedSandbox,
  actions.saveNewModule,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.modules`,
    props`newModule`
  ),
  set(state`editor.currentModuleShortid`, props`newModule.shortid`),
];

export const renameModule = [
  ensureOwnedSandbox,
  actions.saveNewModuleName,
  actions.renameModule,
];

export const createDirectory = [
  ensureOwnedSandbox,
  actions.saveDirectory,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.directories`,
    props`newDirectory`
  ),
];

export const renameDirectory = [
  ensureOwnedSandbox,
  actions.saveNewDirectoryName,
  actions.renameDirectory,
];

export const deleteDirectory = [
  ensureOwnedSandbox,
  actions.whenDeleteDirectory,
  {
    confirmed: [actions.deleteDirectory, actions.removeDirectory],
    cancelled: [],
  },
];

export const moveDirectoryToDirectory = actions.moveDirectoryToDirectory;

export const moveModuleToDirectory = actions.moveModuleToDirectory;

export const updateTag = [
  set(state`editor.workspace.tags.tagName`, props`tagName`),
];
export const addTag = [
  ensureOwnedSandbox,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.tags`,
    state`editor.workspace.tags.tagName`
  ),
  actions.addTag,
  set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`data`),
  set(state`editor.workspace.tags.tagName`, ''),
];
export const removeTag = [
  ensureOwnedSandbox,
  actions.removeTagFromState,
  actions.removeTag,
  set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`tags`),
];
