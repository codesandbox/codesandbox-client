import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import {
  isAllModulesSynced,
  currentSandbox,
  currentModule,
  mainModule,
} from './getters';
import { isModuleSynced } from './computed';

import workspace from './modules/workspace';
import preferences from './modules/preferences';
import deployment from './modules/deployment';

export default Module({
  model,
  state: {
    sandboxes: {},
    currentId: null,
    currentModuleShortid: null,
    mainModuleShortid: null,
    isLoading: true,
    notFound: false,
    error: null,
    isResizing: false,
    changedModuleShortids: [],
    tabs: [],
    errors: [],
    corrections: [],
    isInProjectView: false,
    forceRender: 0,
    initialPath: '/',
    highlightedLines: [],
    isUpdatingPrivacy: false,
    showNewSandboxModal: false,
    showShareModal: false,
    showDeploymentModal: false,
    quickActionsOpen: false,
  },
  getters: {
    isAllModulesSynced,
    currentSandbox,
    currentModule,
    mainModule,
  },
  computed: {
    isModuleSynced,
  },
  signals: {
    sandboxChanged: sequences.loadSandbox,
    contentMounted: sequences.onUnload,
    resizingStarted: sequences.startResizing,
    resizingStopped: sequences.stopResizing,
    codeSaved: sequences.saveCode,
    codeChanged: sequences.changeCode,
    saveClicked: sequences.saveChangedModules,
    createZipClicked: sequences.createZip,
    forkSandboxClicked: sequences.forceForkSandbox,
    likeSandboxToggled: sequences.toggleLikeSandbox,
    moduleSelected: sequences.setCurrentModule,
    moduleDoubleClicked: sequences.unsetDirtyTab,
    tabClosed: sequences.closeTab,
    tabMoved: sequences.moveTab,
    prettifyClicked: sequences.prettifyCode,
    errorsCleared: sequences.clearErrors,
    projectViewToggled: sequences.toggleProjectView,
    previewActionReceived: sequences.handlePreviewAction,
    privacyUpdated: sequences.updatePrivacy,
    newSandboxModalOpened: sequences.openNewSandboxModal,
    newSandboxModalClosed: sequences.closeNewSandboxModal,
    shareModalOpened: sequences.openShareModal,
    shareModalClosed: sequences.closeShareModal,
    deploymentModalOpened: sequences.openDeploymentModal,
    deploymentModalClosed: sequences.closeDeploymentModal,
  },
  modules: { workspace, preferences, deployment },
});
