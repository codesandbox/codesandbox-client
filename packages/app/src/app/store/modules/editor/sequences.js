import { set, when, equals, toggle, increment } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { closeTabByIndex, callVSCodeCallback } from '../../actions';
import { renameModule } from '../files/sequences';
import {
  sendModuleSaved,
  getSelectionsForCurrentModule,
  sendChangeCurrentModule,
  setReceivingStatus,
  getCodeOperation,
  sendTransform,
  unSetReceivingStatus,
} from '../live/actions';
import {
  ensureOwnedEditable,
  forkSandbox,
  fetchGitChanges,
  closeModal,
} from '../../sequences';

import { setCurrentModule, addNotification, track } from '../../factories';

export const openQuickActions = set(state`editor.quickActionsOpen`, true);

export const closeQuickActions = set(state`editor.quickActionsOpen`, false);

export const toggleProjectView = toggle(state`editor.isInProjectView`);

const hasEnoughTabs = when(state`editor.tabs`, tabs => tabs.length > 1);

export const closeTab = [
  hasEnoughTabs,
  {
    false: [],
    true: [closeTabByIndex, actions.setCurrentModuleByTab],
  },
];

export const clearErrors = [
  set(state`editor.errors`, []),
  set(state`editor.corrections`, []),
  set(state`editor.glyphs`, []),
];

export const moveTab = actions.moveTab;

export const onUnload = actions.warnUnloadingContent;

export const startResizing = set(state`editor.isResizing`, true);

export const stopResizing = set(state`editor.isResizing`, false);

export const createZip = actions.createZip;

export const clearCurrentModule = [
  set(state`editor.currentModuleShortid`, null),
];

export const changeCurrentModule = [
  track('Open File', {}),
  setReceivingStatus,
  actions.getIdFromModulePath,
  when(props`id`),
  {
    true: [
      setCurrentModule(props`id`),
      equals(state`live.isLive`),
      {
        true: [
          equals(state`live.isCurrentEditor`),
          {
            true: [
              getSelectionsForCurrentModule,
              set(state`editor.pendingUserSelections`, props`selections`),
              sendChangeCurrentModule,
            ],
            false: [],
          },
        ],
        false: [],
      },
    ],
    false: [clearCurrentModule],
  },
];

export const changeCurrentTab = [set(state`editor.currentTabId`, props`tabId`)];

export const unsetDirtyTab = actions.unsetDirtyTab;

export const updatePrivacy = [
  actions.ensureValidPrivacy,
  {
    valid: [
      set(state`editor.isUpdatingPrivacy`, true),
      actions.updatePrivacy,
      set(state`editor.isUpdatingPrivacy`, false),
    ],
    invalid: [],
  },
];

export const updateFrozen = actions.updateFrozen;

export const toggleLikeSandbox = [
  when(state`editor.sandboxes.${props`id`}.userLiked`),
  {
    true: [
      actions.unlikeSandbox,
      increment(state`editor.sandboxes.${props`id`}.likeCount`, -1),
    ],
    false: [
      actions.likeSandbox,
      increment(state`editor.sandboxes.${props`id`}.likeCount`, 1),
    ],
  },
  toggle(state`editor.sandboxes.${props`id`}.userLiked`),
];

export const forceForkSandbox = [
  when(state`editor.currentSandbox.owned`),
  {
    true: [
      actions.confirmForkingOwnSandbox,
      {
        confirmed: forkSandbox,
        cancelled: [],
      },
    ],
    false: forkSandbox,
  },
];

export const changeCode = [
  track('Change Code', {}, { trackOnce: true }),

  when(
    state`live.isLive`,
    props`noLive`,
    (isLive, noLive) => isLive && !noLive
  ),
  {
    true: [
      setReceivingStatus,
      getCodeOperation,
      sendTransform,
      actions.setCode,
      unSetReceivingStatus,
    ],
    false: actions.setCode,
  },

  actions.addChangedModule,
  actions.unsetDirtyTab,
];

export const saveChangedModules = [
  track('Save Modified Modules', {}),
  ensureOwnedEditable,
  actions.outputChangedModules,
  actions.saveChangedModules,
  actions.removeChangedModules,
  when(state`editor.currentSandbox.originalGit`),
  {
    true: [
      when(state`workspace.openedWorkspaceItem`, item => item === 'github'),
      {
        true: fetchGitChanges,
        false: [],
      },
    ],
    false: [],
  },
];

export const prettifyCode = [
  track('Prettify Code', {}),
  actions.prettifyCode,
  {
    success: [changeCode],
    invalidPrettierSandboxConfig: addNotification(
      'Invalid JSON in sandbox .prettierrc file',
      'error'
    ),
    error: [],
  },
];

export const saveCode = [
  track('Save Code', {}),
  ensureOwnedEditable,
  when(state`preferences.settings.experimentVSCode`),
  {
    true: [changeCode],
    false: [
      when(state`preferences.settings.prettifyOnSaveEnabled`),
      {
        true: [prettifyCode],
        false: [],
      },
    ],
  },

  actions.saveModuleCode,
  actions.setModuleSaved,
  callVSCodeCallback,
  when(state`editor.currentSandbox.originalGit`),
  {
    true: [
      when(state`workspace.openedWorkspaceItem`, item => item === 'github'),
      {
        true: fetchGitChanges,
        false: [],
      },
    ],
    false: [],
  },
  sendModuleSaved,

  actions.updateTemplateIfSSE,
];

export const discardModuleChanges = [
  track('Code Discarded', {}),
  actions.getSavedCode,
  when(props`code`),
  {
    true: [changeCode],
    false: [],
  },
];

export const addNpmDependency = [
  track('Add NPM Dependency', {}),
  closeModal,
  ensureOwnedEditable,
  when(props`version`),
  {
    true: [],
    false: [actions.getLatestVersion],
  },
  actions.addNpmDependencyToPackage,
  changeCode,
  saveCode,
];

export const removeNpmDependency = [
  track('Remove NPM Dependency', {}),
  ensureOwnedEditable,
  actions.removeNpmDependencyFromPackage,
  changeCode,
  saveCode,
];

export const updateSandboxPackage = [
  actions.updateSandboxPackage,
  changeCode,
  saveCode,
];

export const handlePreviewAction = [
  equals(props`action.action`),
  {
    notification: addNotification(
      props`action.title`,
      props`action.notificationType`,
      props`action.timeAlive`
    ),
    'show-error': actions.addErrorFromPreview,
    'show-correction': actions.addCorrectionFromPreview,
    'show-glyph': actions.addGlyphFromPreview,
    'source.module.rename': [
      actions.consumeRenameModuleFromPreview,
      renameModule,
    ],
    'source.dependencies.add': [
      set(props`name`, props`action.dependency`),
      addNpmDependency,
      actions.forceRender,
    ],
    'editor.open-module': [
      actions.outputModuleIdFromActionPath,
      when(props`id`),
      {
        true: setCurrentModule(props`id`),
        false: [],
      },
    ],
    otherwise: [],
  },
];

export const setPreviewBounds = [actions.setPreviewBounds];
export const togglePreview = [
  when(state`editor.previewWindow.content`),
  {
    true: [set(state`editor.previewWindow.content`, undefined)],
    false: [set(state`editor.previewWindow.content`, 'browser')],
  },
];

export const setPreviewContent = [
  set(state`editor.previewWindow.content`, props`content`),
];

export const updateEditorSize = [
  set(state`editor.previewWindow.editorSize`, props`editorSize`),
];
