// @flow

import type { Preferences } from 'common/types';
import store from 'store/dist/store.modern';

import {
  SET_PREFERENCE_AUTOCOMPLETE,
  SET_PREFERENCE_VIM_MODE,
  SET_PREFERENCE_LIVE_PREVIEW,
  SET_PREFERENCE_PRETTIFY_ON_SAVE,
  SET_PREFERENCE_LINT,
  SET_INSTANT_PREVIEW,
  SET_PREFERENCE_FONT_SIZE,
  SET_CLEAR_CONSOLE,
} from './actions';
import {
  AUTO_COMPLETE,
  VIM_MODE,
  LIVE_PREVIEW,
  PRETTIFY_ON_SAVE,
  LINT_ENABLED,
  INSTANT_PREVIEW,
  FONT_SIZE,
  CLEAR_CONSOLE,
} from './keys';

function getKey<D: any>(key: string, defaultVal: D): ?D {
  try {
    const result = store.get(key);
    return result === undefined ? defaultVal : result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

const initialState: Preferences = {
  autoCompleteEnabled: getKey(AUTO_COMPLETE, true),
  vimMode: getKey(VIM_MODE, false),
  livePreviewEnabled: getKey(LIVE_PREVIEW, true),
  prettifyOnSaveEnabled: getKey(PRETTIFY_ON_SAVE, false),
  lintEnabled: getKey(LINT_ENABLED, false),
  instantPreviewEnabled: getKey(INSTANT_PREVIEW, false),
  fontSize: getKey(FONT_SIZE, 14),
  clearConsoleEnabled: getKey(CLEAR_CONSOLE, false),
};

export default (state: Preferences = initialState, action): Preferences => {
  switch (action.type) {
    case SET_PREFERENCE_AUTOCOMPLETE:
      return { ...state, autoCompleteEnabled: action.option };
    case SET_PREFERENCE_VIM_MODE:
      return { ...state, vimMode: action.option };
    case SET_PREFERENCE_LIVE_PREVIEW:
      return { ...state, livePreviewEnabled: action.option };
    case SET_PREFERENCE_PRETTIFY_ON_SAVE:
      return { ...state, prettifyOnSaveEnabled: action.option };
    case SET_PREFERENCE_LINT:
      return { ...state, lintEnabled: action.option };
    case SET_INSTANT_PREVIEW:
      return { ...state, instantPreviewEnabled: action.option };
    case SET_PREFERENCE_FONT_SIZE:
      return { ...state, fontSize: action.option };
    case SET_CLEAR_CONSOLE:
      return { ...state, clearConsoleEnabled: action.option };
    default: {
      return state;
    }
  }
};
