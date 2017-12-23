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
      fontFamily: '',
      lineHeight: 1.15,
      clearConsoleEnabled: false, // TODO: should be true
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
    },
    isLoadingPaymentDetails: true,
    paymentDetailError: null,
    paymentDetails: null,
    itemIndex: 0,
    showEditor: true,
    showPreview: true,
    showDevtools: false,
    showModal: false,
  },
  getters: {
    keybindings,
  },
  signals: {
    viewModeChanged: sequences.changeViewMode,
    devtoolsToggled: sequences.toggleDevtools,
    itemIndexChanged: sequences.changeItemIndex,
    settingChanged: sequences.setSetting,
    badgeVisibilityChanged: sequences.setBadgeVisibility,
    paymentDetailsRequested: sequences.getPaymentDetails,
    paymentDetailsUpdated: sequences.updatePaymentDetails,
    keybindingChanged: sequences.changeKeybinding,
    zenModeToggled: sequences.toggleZenMode,
    modalOpened: sequences.openModal,
    modalClosed: sequences.closeModal,
  },
});
