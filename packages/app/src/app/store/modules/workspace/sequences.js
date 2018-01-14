import { set, when, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { loadSandbox, ensureOwnedSandbox } from '../../sequences';
import { addNotification } from '../../factories';

export const changeSandboxPrivacy = [
  actions.saveSandboxPrivacy,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.privacy`,
    props`privacy`
  ),
];

export const deleteSandbox = [
  actions.deleteSandbox,
  set(state`workspace.showDeleteSandboxModal`, false),
  addNotification('Sandbox deleted!', 'success'),
  actions.redirectToNewSandbox,
  set(props`id`, 'new'),
  loadSandbox,
];

export const openIntegrations = [
  set(state`preferences.itemId`, 'integrations'),
  set(state`preferences.showModal`, true),
];

export const changeValue = [
  set(state`workspace.project.${props`field`}`, props`value`),
];

export const updateSandboxInfo = [
  ensureOwnedSandbox,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.title`,
    state`workspace.project.title`
  ),
  set(
    state`editor.sandboxes.${state`editor.currentId`}.description`,
    state`workspace.project.description`
  ),
  actions.updateSandbox,
];

export const removeNpmDependency = [
  ensureOwnedSandbox,
  actions.optimisticallyRemoveNpmDependency,
  actions.removeNpmDependency,
  {
    success: [],
    error: [
      set(
        state`editor.sandboxes.${state`editor.currentId`}.npmDependencies.${props`removedNpmDependency.name`}`,
        props`removedNpmDependency.version`
      ),
      addNotification('Could not remove NPM dependency', 'error'),
    ],
  },
];

export const addExternalResource = [
  ensureOwnedSandbox,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.externalResources`,
    props`resource`
  ),
  actions.addExternalResource,
  {
    success: [],
    error: [
      actions.removeOptimisticExternalResource,
      addNotification('Could not save external resource', 'error'),
    ],
  },
];

export const removeExternalResource = [
  ensureOwnedSandbox,
  actions.removeOptimisticExternalResource,
  actions.removeExternalResource,
  {
    success: [],
    error: [
      push(
        state`editor.sandboxes.${state`editor.currentId`}.externalResources`,
        props`resource`
      ),
      addNotification('Could not save removal of external resource', 'error'),
    ],
  },
];

export const updateTag = [set(state`workspace.tags.tagName`, props`tagName`)];

export const addTag = [
  ensureOwnedSandbox,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.tags`,
    state`workspace.tags.tagName`
  ),
  actions.addTag,
  {
    success: [
      set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`data`),
      set(state`workspace.tags.tagName`, ''),
    ],
    error: [actions.removeTagFromState],
  },
];

export const removeTag = [
  ensureOwnedSandbox,
  actions.removeTagFromState,
  actions.removeTag,
  set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`tags`),
];

export const setWorkspaceItem = [
  set(state`workspace.openedWorkspaceItem`, props`item`),
];

export const toggleCurrentWorkspaceItem = [
  when(state`workspace.openedWorkspaceItem`),
  {
    false: set(state`workspace.openedWorkspaceItem`, 'files'),
    true: set(state`workspace.openedWorkspaceItem`, null),
  },
];
