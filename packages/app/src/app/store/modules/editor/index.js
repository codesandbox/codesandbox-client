import { Module } from 'cerebral';
import themes from '@codesandbox/common/lib/themes';
import model from './model';
import * as sequences from './sequences';
import {
  isAllModulesSynced,
  currentSandbox,
  currentModule,
  mainModule,
  currentPackageJSON,
  currentPackageJSONCode,
  parsedConfigurations,
  currentTab,
  modulesByPath,
  isAdvancedEditor,
  devToolTabs,
} from './getters';
import { isModuleSynced, shouldDirectoryBeOpen } from './computed';
import { loadSandbox } from '../../sequences';

export default Module({
  model,
  state: {
    sessionFrozen: true,
    sandboxes: {},
    currentId: null,
    isForkingSandbox: false,
    currentModuleShortid: null,
    mainModuleShortid: null,
    isLoading: true,
    notFound: false,
    error: null,
    isResizing: false,
    changedModuleShortids: [],
    currentTabId: null,
    tabs: [],
    errors: [],
    corrections: [],
    pendingOperations: {},
    pendingUserSelections: [],
    isInProjectView: false,
    forceRender: 0,
    initialPath: '/',
    highlightedLines: [],
    isUpdatingPrivacy: false,
    quickActionsOpen: false,
    previewWindowVisible: true,
    previewWindowOrientation:
      window.innerHeight / window.innerWidth > 0.9 ? 'horizontal' : 'vertical',
    themes,
    currentDevToolsPosition: {
      devToolIndex: 0,
      tabPosition: 0,
    },

    /**
     * Normally we save this code in a file (.codesandbox/workspace.json), however, when someone
     * doesn't own a sandbox and changes the UI we don't want to fork the sandbox (yet). That's
     * why we introduce this field until we have datasources. When we have datasources we can store
     * the actual content in the localStorage.
     */
    workspaceConfigCode: '',
  },
  getters: {
    isAllModulesSynced,
    currentSandbox,
    currentModule,
    mainModule,
    currentPackageJSON,
    currentPackageJSONCode,
    parsedConfigurations,
    currentTab,
    modulesByPath,
    isAdvancedEditor,
    devToolTabs,
  },
  computed: {
    isModuleSynced,
    shouldDirectoryBeOpen,
  },
  signals: {
    addNpmDependency: sequences.addNpmDependency,
    npmDependencyRemoved: sequences.removeNpmDependency,
    sandboxChanged: loadSandbox,
    contentMounted: sequences.onUnload,
    sessionFreezeOverride: sequences.sessionFreezeOverride,
    resizingStarted: sequences.startResizing,
    resizingStopped: sequences.stopResizing,
    codeSaved: sequences.saveCode,
    codeChanged: sequences.changeCode,
    saveClicked: sequences.saveChangedModules,
    createZipClicked: sequences.createZip,
    forkSandboxClicked: sequences.forceForkSandbox,
    forkSandboxOnDemand: sequences.forkSandboxOnDemand,
    likeSandboxToggled: sequences.toggleLikeSandbox,
    moduleSelected: sequences.changeCurrentModule,
    clearModuleSelected: sequences.clearCurrentModule,
    moduleDoubleClicked: sequences.unsetDirtyTab,
    tabClosed: sequences.closeTab,
    tabMoved: sequences.moveTab,
    prettifyClicked: sequences.prettifyCode,
    errorsCleared: sequences.clearErrors,
    projectViewToggled: sequences.toggleProjectView,
    previewActionReceived: sequences.handlePreviewAction,
    privacyUpdated: sequences.updatePrivacy,
    frozenUpdated: sequences.updateFrozen,
    quickActionsOpened: sequences.openQuickActions,
    quickActionsClosed: sequences.closeQuickActions,
    setPreviewContent: sequences.setPreviewContent,
    togglePreviewContent: sequences.togglePreview,
    currentTabChanged: sequences.changeCurrentTab,
    discardModuleChanges: sequences.discardModuleChanges,
    fetchEnvironmentVariables: sequences.fetchEnvironmentVariables,
    updateEnvironmentVariables: sequences.updateEnvironmentVariables,
    deleteEnvironmentVariable: sequences.deleteEnvironmentVariable,
    toggleEditorPreviewLayout: sequences.toggleEditorPreviewLayout,
    onNavigateAway: sequences.onNavigateAway,
    onDevToolsTabAdded: sequences.addDevToolsTab,
    onDevToolsTabMoved: sequences.moveDevToolsTab,
    onDevToolsTabClosed: sequences.closeDevToolsTab,
    onDevToolsPositionChanged: sequences.setDevToolPosition,
    openDevToolsTab: sequences.openDevToolsTab,
  },
});
