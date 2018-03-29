import { Module, Dictionary } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as getters from './getters';
import { loadSandbox } from '../../sequences';
import { State } from './types';

const state: State = {
    sandboxes: Dictionary({}),
    currentId: null,
    isForkingSandbox: false,
    currentModuleShortid: null,
    mainModuleShortid: null,
    isLoading: true,
    notFound: false,
    error: null,
    isResizing: false,
    changedModuleShortids: [],
    tabs: [],
    errors: [],
    glyphs: [],
    corrections: [],
    isInProjectView: false,
    forceRender: 0,
    initialPath: '/',
    highlightedLines: [],
    isUpdatingPrivacy: false,
    quickActionsOpen: false,
    previewWindow: {
        height: undefined,
        width: undefined,
        x: 0,
        y: 0,
        content: 'browser'
    },
    get isAllModulesSynced() {
        return getters.isAllModulesSynced(this);
    },
    get currentSandbox() {
        return getters.currentSandbox(this);
    },
    get currentModule() {
        return getters.currentModule(this);
    },
    get mainModule() {
        return getters.mainModule(this);
    },
    get currentPackageJSON() {
        return getters.currentPackageJSON(this);
    },
    get currentPackageJSONCode() {
        return getters.currentPackageJSONCode(this);
    },
    get parsedConfigurations() {
        return getters.parsedConfigurations(this);
    }
};

const signals = {
    addNpmDependency: sequences.addNpmDependency,
    npmDependencyRemoved: sequences.removeNpmDependency,
    sandboxChanged: loadSandbox,
    contentMounted: sequences.onUnload,
    resizingStarted: sequences.startResizing,
    resizingStopped: sequences.stopResizing,
    codeSaved: sequences.saveCode,
    codeChanged: sequences.changeCode,
    saveClicked: sequences.saveChangedModules,
    createZipClicked: sequences.createZip,
    forkSandboxClicked: sequences.forceForkSandbox,
    likeSandboxToggled: sequences.toggleLikeSandbox,
    moduleSelected: sequences.changeCurrentModule,
    moduleDoubleClicked: sequences.unsetDirtyTab,
    tabClosed: sequences.closeTab,
    tabMoved: sequences.moveTab,
    prettifyClicked: sequences.prettifyCode,
    errorsCleared: sequences.clearErrors,
    projectViewToggled: sequences.toggleProjectView,
    previewActionReceived: sequences.handlePreviewAction,
    privacyUpdated: sequences.updatePrivacy,
    quickActionsOpened: sequences.openQuickActions,
    quickActionsClosed: sequences.closeQuickActions,
    setPreviewBounds: sequences.setPreviewBounds,
    setPreviewContent: sequences.setPreviewContent
};

export default Module<State, typeof signals>({
    state,
    signals
});
