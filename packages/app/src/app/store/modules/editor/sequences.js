import { sequence } from 'cerebral';
import { set, when, equals, toggle, increment } from 'cerebral/operators';
import { state, props, string } from 'cerebral/tags';
import { getZeitUserDetails } from 'app/store/sequences';
import * as actions from './actions';
import * as factories from './factories';

import { addNotification, updateSandboxUrl } from '../../factories';

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

export const closeTab = [actions.closeTab, actions.setCurrentModuleByTab];

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

export const setCurrentModule = factories.setCurrentModule(props`id`);

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

export const forkSandbox = sequence('forkSandbox', [
  set(state`editor.isForkingSandbox`, true),
  actions.forkSandbox,
  actions.moveModuleContent,
  set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
  set(state`editor.currentId`, props`sandbox.id`),
  actions.setCurrentModuleShortid,
  addNotification('Forked sandbox!', 'success'),
  updateSandboxUrl(props`sandbox`),
  set(state`editor.isForkingSandbox`, false),
]);

export const ensureOwnedSandbox = sequence('ensureOwnedSandbox', [
  when(state`editor.currentSandbox.owned`),
  {
    true: [],
    false: forkSandbox,
  },
]);

export const addNpmDependency = [
  set(state`editor.workspace.showSearchDependenciesModal`, false),
  ensureOwnedSandbox,
  set(state`editor.workspace.isProcessingDependencies`, true),
  actions.addNpmDependency,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.npmDependencies`,
    props`npmDependencies`
  ),
  set(state`editor.workspace.isProcessingDependencies`, false),
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

export const changeCode = [actions.setCode, actions.addChangedModule];

export const fetchGitChanges = [
  set(state`editor.git.isFetching`, true),
  actions.getGitChanges,
  set(state`editor.git.originalGitChanges`, props`gitChanges`),
  when(props`gitChanges`),
  {
    true: set(state`editor.git.showFetchButton`, false),
    false: set(state`editor.git.showFetchButton`, true),
  },
  set(state`editor.git.isFetching`, false),
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
  when(state`editor.preferences.settings.prettifyOnSaveEnabled`),
  {
    true: [actions.prettifyCode, actions.setCode],
    false: [],
  },
  actions.saveModuleCode,
];

export const loadSandbox = [
  set(state`editor.error`, null),
  when(state`editor.sandboxes.${props`id`}`),
  {
    true: [
      set(state`editor.currentId`, props`id`),
      set(props`sandbox`, state`editor.sandboxes.${props`id`}`),
      actions.setCurrentModuleShortid,
      actions.setMainModuleShortid,
      actions.setInitialTab,
      actions.setUrlOptions,
      actions.setWorkspace,
    ],
    false: [
      set(state`editor.isLoading`, true),
      set(state`editor.notFound`, false),
      actions.getSandbox,
      {
        success: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
          set(state`editor.currentId`, props`sandbox.id`),
          actions.setCurrentModuleShortid,
          actions.setMainModuleShortid,
          actions.setInitialTab,
          actions.setUrlOptions,
          actions.setWorkspace,
        ],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
      set(state`editor.isLoading`, false),
    ],
  },
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
        true: setCurrentModule,
        false: [],
      },
    ],
    otherwise: [],
  },
];
