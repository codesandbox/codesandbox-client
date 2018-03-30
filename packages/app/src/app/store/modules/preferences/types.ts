import { ComputedValue } from '@cerebral/fluent';

export type Keybinding = {
    key: string;
    bindings: string[][];
};

export type PrettierConfig = {
    printWidth: number;
    tabWidth: number;
    useTabs: boolean;
    semi: boolean;
    singleQuote: boolean;
    trailingComma: string;
    bracketSpacing: boolean;
    jsxBracketSameLine: boolean;
};

export type Settings = {
    prettifyOnSaveEnabled: boolean;
    autoCompleteEnabled: boolean;
    livePreviewEnabled: boolean;
    lintEnabled: boolean;
    instantPreviewEnabled: boolean;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    clearConsoleEnabled: boolean;
    autoDownloadTypes: boolean;
    codeMirror: boolean;
    keybindings: Keybinding[];
    newPackagerExperiment: boolean;
    prettierConfig: PrettierConfig;
    jsxBracketSameLine: boolean;
    printWidth: number;
    semi: boolean;
    singleQuote: boolean;
    tabWidth: number;
    trailingComma: string;
    useTabs: boolean;
    vimMode: boolean;
    zenMode: boolean;
    forceRefresh: boolean;
};

export type PaymentDetails = {
    brand: string;
    expMonth: number;
    expYear: number;
    last4: string;
    name: string;
};

export type QuickAction = {
    title: string;
    type: string;
    payload: (store: any) => {} | {};
    signal?: string;
    bindings: string[][];
};

export type QuickActions = {
    [key: string]: QuickAction;
};

export type State = {
    settings: Settings;
    isLoadingPaymentDetails: boolean;
    itemId: string;
    showEditor: boolean;
    showPreview: boolean;
    showDevtools: boolean;
    paymentDetailError: string;
    paymentDetails: PaymentDetails;
    keybindings: ComputedValue<QuickActions>;
};
