// @flow

import type { Preferences } from 'common/types';

import { SET_PREFERENCES } from './actions';
import * as keys from './keys';
import { getKey } from './store';

export const DEFAULT_PRETTIER_CONFIG = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: false,
};

const initialState: Preferences = Object.keys(keys).reduce(
  (res, key) =>
    Object.assign(res, {
      [key]: getKey(keys[key], res[key]),
    }),
  {
    autoCompleteEnabled: true,
    livePreviewEnabled: true,
    prettifyOnSaveEnabled: false,
    lintEnabled: true,
    instantPreviewEnabled: false,
    fontSize: 14,
    tabSize: 2,
    fontFamily: '',
    lineHeight: 1.15,
    clearConsoleEnabled: true,
    prettierConfig: DEFAULT_PRETTIER_CONFIG,
    codeMirror: false,
    autoDownloadTypes: true,
    newPackagerExperiment: false,
    zenMode: false,
    keybindings: {},
  }
);

export default (state: Preferences = initialState, action): Preferences => {
  switch (action.type) {
    case SET_PREFERENCES:
      return {
        ...state,
        ...action.preferences,
      };
    default: {
      return state;
    }
  }
};
