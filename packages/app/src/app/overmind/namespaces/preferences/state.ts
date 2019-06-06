import { Preferences } from '@codesandbox/common/lib/types';

type State = {
  settings: Preferences;
};

export const state: State = {
  settings: {
    autoCompleteEnabled: false,
    vimMode: false,
    livePreviewEnabled: false,
    prettifyOnSaveEnabled: false,
    lintEnabled: false,
    instantPreviewEnabled: false,
    fontSize: 12,
    fontFamily: 'Arial',
    clearConsoleEnabled: true,
    prettierConfig: {
      fluid: false,
      printWidth: 12,
      tabWidth: 123,
      useTabs: false,
      semi: false,
      singleQuote: false,
      trailingComma: ',',
      bracketSpacing: false,
      jsxBracketSameLine: false,
    },
    autoDownloadTypes: false,
    newPackagerExperiment: false,
    zenMode: false,
    keybindings: [],
  },
};
