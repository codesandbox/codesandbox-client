import { set, when, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import getTemplate from '@codesandbox/common/lib/templates';
import track from '@codesandbox/common/lib/utils/analytics';
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

export const addTemplate = [
  actions.addTemplate,
  {
    success: [
      set(state`editor.sandboxes.${state`editor.currentId`}.isFrozen`, true),
      closeModal,
      addNotification('template added', 'success'),
    ],
    error: [addNotification('Could not add custom template', 'error')],
  },
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
    state`editor.sandboxes.${state`editor.currentId`}.alias`,
    state`workspace.project.alias`,
    (t1, t2, d1, d2, a1, a2) =>
      (t2 && t1 !== t2) || (d2 && d1 !== d2) || (a2 && a1 !== a2)
  ),
  {
    true: [
      // eslint-disable-next-line
      ({ state }) => {
        if (
          state.get('workspace.project.title') &&
          state.get(
            `editor.sandboxes.${state.get('editor.currentId')}.title`
          ) !== state.get('workspace.project.title')
        ) {
          track('Sandbox - Update Title');
        }

        if (
          state.get('workspace.project.description') &&
          state.get(
            `editor.sandboxes.${state.get('editor.currentId')}.description`
          ) !== state.get('workspace.project.description')
        ) {
          track('Sandbox - Update Description');
        }

        if (
          state.get('workspace.project.alias') &&
          state.get(
            `editor.sandboxes.${state.get('editor.currentId')}.alias`
          ) !== state.get('workspace.project.alias')
        ) {
          track('Sandbox - Update Alias');
        }
      },

      set(
        state`editor.sandboxes.${state`editor.currentId`}.title`,
        state`workspace.project.title`
      ),
      set(
        state`editor.sandboxes.${state`editor.currentId`}.description`,
        state`workspace.project.description`
      ),
      set(
        state`editor.sandboxes.${state`editor.currentId`}.alias`,
        state`workspace.project.alias`
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
  when(state`workspace.workspaceHidden`),
  {
    false: set(state`workspace.workspaceHidden`, true),
    true: set(state`workspace.workspaceHidden`, false),
  },
];

export const setWorkspaceHidden = [
  set(state`workspace.workspaceHidden`, props`hidden`),
];
