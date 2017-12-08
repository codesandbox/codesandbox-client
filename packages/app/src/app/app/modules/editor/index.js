import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { isAllModulesSynced, currentSandbox, currentModule } from './getters';
import { isModuleSynced } from './computed';

import workspace from './modules/workspace';
import preferences from './modules/preferences';

export default Module({
  model,
  state: {
    sandboxes: {},
    currentId: null,
    currentModuleShortid: null,
    isLoading: true,
    notFound: false,
    error: null,
    isResizing: false,
    changedModuleShortids: [],
  },
  getters: {
    isAllModulesSynced,
    currentSandbox,
    currentModule,
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
  },
  modules: { workspace, preferences },
});
