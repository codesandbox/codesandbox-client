import { Module, Computed } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as computed from './computed';
import { State } from './types';

const state: State = {
    settings: {
        prettifyOnSaveEnabled: true,
        zenMode: false,
        autoCompleteEnabled: true,
        livePreviewEnabled: true,
        lintEnabled: true,
        instantPreviewEnabled: false,
        fontSize: 14,
        fontFamily: '',
        lineHeight: 1.5,
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
            jsxBracketSameLine: false
        },
        jsxBracketSameLine: false,
        printWidth: 80,
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: 'none',
        useTabs: false,
        vimMode: false,
        forceRefresh: false
    },
    isLoadingPaymentDetails: true,
    paymentDetailError: null,
    paymentDetails: null,
    itemId: 'editor',
    showEditor: true,
    showPreview: true,
    showDevtools: false,
    keybindings: Computed(computed.keybindings)
};

const signals = {
    viewModeChanged: sequences.changeViewMode,
    devtoolsToggled: sequences.toggleDevtools,
    setDevtoolsOpen: sequences.setDevtoolsOpen,
    itemIdChanged: sequences.changeItemId,
    settingChanged: sequences.setSetting,
    setBadgeVisibility: sequences.setBadgeVisibility,
    paymentDetailsRequested: sequences.getPaymentDetails,
    paymentDetailsUpdated: sequences.updatePaymentDetails,
    keybindingChanged: sequences.changeKeybinding,
    zenModeToggled: sequences.toggleZenMode
};

export default Module<State, typeof signals>({
    state,
    signals
});
