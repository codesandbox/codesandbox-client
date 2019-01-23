import { set, when, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import getTemplate from 'common/templates';
import * as actions from './actions';
import { ensureOwnedEditable, closeModal, openModal } from '../../sequences';
import { updateSandboxPackage } from './../editor/sequences';
import { addNotification } from '../../factories';

export const changeSandboxPrivacy = [
  when(
    state`editor.currentSandbox.template`,
    props`privacy`,
    (template, privacy) => {
      const templateDefinition = getTemplate(template);

      return templateDefinition.isServer && privacy === 2;
    }
  ),
  {
    true: [set(props`modal`, 'privacyServerWarning'), openModal],
    false: [],
  },

  actions.saveSandboxPrivacy,

  set(
    state`editor.sandboxes.${state`editor.currentId`}.privacy`,
    props`privacy`
  ),
];

export const deleteSandbox = [
  closeModal,
  actions.deleteSandbox,
  set(state`workspace.showDeleteSandboxModal`, false),
  addNotification('Sandbox deleted!', 'success'),
  actions.redirectToSandboxWizard,
];

export const openIntegrations = [
  set(state`preferences.itemId`, 'integrations'),
  set(state`preferences.showModal`, true),
];

export const changeValue = [
  set(state`workspace.project.${props`field`}`, props`value`),
];

export const updateSandboxInfo = [
  ensureOwnedEditable,
  when(
    state`editor.sandboxes.${state`editor.currentId`}.title`,
    state`workspace.project.title`,
    state`editor.sandboxes.${state`editor.currentId`}.description`,
    state`workspace.project.description`,
    (t1, t2, d1, d2) => (t2 && t1 !== t2) || (d2 && d1 !== d2)
  ),
  {
    true: [
      set(
        state`editor.sandboxes.${state`editor.currentId`}.title`,
        state`workspace.project.title`
      ),
      set(
        state`editor.sandboxes.${state`editor.currentId`}.description`,
        state`workspace.project.description`
      ),
      actions.updateSandbox,
      updateSandboxPackage,
    ],
    false: [],
  },
];

export const addExternalResource = [
  ensureOwnedEditable,
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
  ensureOwnedEditable,
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
  ensureOwnedEditable,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.tags`,
    state`workspace.tags.tagName`
  ),
  actions.addTag,
  {
    success: [
      set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`data`),
      updateSandboxPackage,
      set(state`workspace.tags.tagName`, ''),
    ],
    error: [actions.removeTagFromState],
  },
];

export const removeTag = [
  ensureOwnedEditable,
  actions.removeTagFromState,
  actions.removeTag,
  set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`tags`),
  updateSandboxPackage,
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
