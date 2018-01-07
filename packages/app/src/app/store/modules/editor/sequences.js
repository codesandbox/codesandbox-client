import { set, when, equals, toggle, increment } from 'cerebral/operators';
import { state, props, string } from 'cerebral/tags';
import * as actions from './actions';
import { closeTabByIndex } from '../../actions';
import {
  getZeitUserDetails,
  ensureOwnedSandbox,
  forkSandbox,
  fetchGitChanges,
  addNpmDependency,
} from '../../sequences';

import { setCurrentModule, addNotification } from '../../factories';

export const openQuickActions = set(state`editor.quickActionsOpen`, true);

export const closeQuickActions = set(state`editor.quickActionsOpen`, false);

export const openDeploymentModal = [
  set(state`editor.showDeploymentModal`, true),
  getZeitUserDetails,
];

export const closeDeploymentModal = set(
  state`editor.showDeploymentModal`,
  false
);

export const openShareModal = set(state`editor.showShareModal`, true);

export const closeShareModal = set(state`editor.showShareModal`, false);

export const openNewSandboxModal = set(state`editor.showNewSandboxModal`, true);

export const closeNewSandboxModal = set(
  state`editor.showNewSandboxModal`,
  false
);

export const toggleProjectView = toggle(state`editor.isInProjectView`);

export const closeTab = [closeTabByIndex, actions.setCurrentModuleByTab];

export const clearErrors = set(state`editor.errors`, []);

export const moveTab = actions.moveTab;

export const onUnload = actions.warnUnloadingContent;

export const startResizing = set(state`editor.isResizing`, true);

export const stopResizing = set(state`editor.isResizing`, false);

export const createZip = actions.createZip;

export const prettifyCode = [
  actions.prettifyCode,
  {
    success: actions.setCode,
    invalidPrettierSandboxConfig: addNotification(
      'Invalid JSON in sandbox .prettierrc file',
      'error'
    ),
    error: addNotification(
      string`Something went wrong prettifying the code: "${props`error.message`}"`,
      'error'
    ),
  },
];

export const changeCurrentModule = setCurrentModule(props`id`);

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
  actions.setCode,
  actions.addChangedModule,
  actions.unsetDirtyTab,
];

export const saveChangedModules = [
  ensureOwnedSandbox,
  actions.outputChangedModules,
  actions.saveChangedModules,
  set(state`editor.changedModuleShortids`, []),
  when(state`editor.currentSandbox.forkedFromSandbox.git`),
  {
    true: fetchGitChanges,
    false: [],
  },
];

export const saveCode = [
  ensureOwnedSandbox,
  when(props`code`),
  {
    true: actions.setCode,
    false: [],
  },
  when(state`preferences.settings.prettifyOnSaveEnabled`),
  {
    true: [
      actions.prettifyCode,
      {
        success: actions.setCode,
        error: [],
      },
    ],
    false: [],
  },
  actions.saveModuleCode,
  actions.setModuleSaved,
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
    'source.module.rename': actions.renameModuleFromPreview,
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
