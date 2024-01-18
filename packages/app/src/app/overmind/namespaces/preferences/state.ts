import { Settings } from '@codesandbox/common/lib/types';
import { KEYBINDINGS } from '@codesandbox/common/lib/utils/keybindings';
import { isIOS } from '@codesandbox/common/lib/utils/platform';
import { derived } from 'overmind';

export type SettingSync = {
  id: string;
  insertedAt: string;
  name: string;
  settings: string;
  updatedAt: string;
};

type State = {
  settings: Settings;
  hideNavigation: boolean;
  itemId: string | null;
  showEditor: boolean;
  showModal: boolean;
  showPreview: boolean;
  showDevtools: boolean;
  runOnClick: boolean;
  keybindings: any;
  settingsSync: {
    syncing: boolean;
    applying: boolean;
    fetching: boolean;
    settings: SettingSync[] | null;
  };
};

export const state: State = {
  settings: {
    autoResize: true,
    enableEslint: true,
    forceRefresh: false,
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
    codeMirror: isIOS,
    keybindings: [],
    newPackagerExperiment: false,
    prettierConfig: {
      fluid: false,
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
    // TODO: Should these be her?
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

    customVSCodeTheme: null,
    manualCustomVSCodeTheme: null,
  },
  hideNavigation: false,
  showModal: false,
  itemId: null,
  showEditor: true,
  showPreview: true,
  showDevtools: false,
  runOnClick: false,
  settingsSync: {
    syncing: false,
    applying: false,
    fetching: false,
    settings: null,
  },
  keybindings: derived((currentState: State) => {
    const userBindings = currentState.settings.keybindings || [];
    const userBindingsMap = userBindings.reduce(
      (bindings, binding) => ({
        ...bindings,
        [binding.key]: binding.bindings,
      }),
      {}
    );

    return Object.keys(KEYBINDINGS).reduce(
      (currentBindings, key) => ({
        ...currentBindings,
        [key]: {
          ...KEYBINDINGS[key],
          ...(key in userBindingsMap ? { bindings: userBindingsMap[key] } : {}),
        },
      }),
      {}
    );
  }),
};
