import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { keybindings } from './getters';

export default Module({
  model,
  state: {
    settings: {
      prettifyOnSaveEnabled: true,
      zenMode: false,
      autoCompleteEnabled: true,
      livePreviewEnabled: true,
      lintEnabled: true,
      instantPreviewEnabled: false,
      fontSize: 14,
      fontFamily: 'Dank Mono',
      lineHeight: 1.5,
      clearConsoleEnabled: true,
      autoDownloadTypes: true,
      codeMirror: false,
      keybindings: [],
      newPackagerExperiment: false,
      prettierConfig: {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        trailingComma: 'none',
        bracketSpacing: true,
        jsxBracketSameLine: false,
      },
      jsxBracketSameLine: false,
      printWidth: 80,
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: 'none',
      useTabs: false,
      vimMode: false,
      // Windows has problems with calculating characters widths when ligatures
      // are disabled, however there is a weird character when you have 'fi' in
      // Menlo. So a temporary fix is to only enable this for Windows.
      enableLigatures: navigator.platform.indexOf('Win') > -1,

      editorTheme: 'CodeSandbox',
      customVSCodeTheme: undefined,
    },
    isLoadingPaymentDetails: true,
    paymentDetailError: null,
    paymentDetails: null,
    itemId: 'appearance',
    showEditor: true,
    showPreview: true,
    showDevtools: false,
    runOnClick: false,
  },
  getters: {
    keybindings,
  },
  signals: {
    viewModeChanged: sequences.changeViewMode,
    devtoolsToggled: sequences.toggleDevtools,
    setDevtoolsOpen: sequences.setDevtoolsOpen,
    itemIdChanged: sequences.changeItemId,
    settingChanged: sequences.setSetting,
    setBadgeVisibility: sequences.setBadgeVisibility,
    paymentDetailsRequested: sequences.getPaymentDetails,
    paymentDetailsUpdated: sequences.updatePaymentDetails,
    keybindingChanged: sequences.changeKeybinding,
    zenModeToggled: sequences.toggleZenMode,
    codeMirrorForced: sequences.forceCodeMirror,
  },
});
