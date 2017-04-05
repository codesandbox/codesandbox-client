import store from 'store/dist/store.modern';

import {
  SET_PREFERENCE_AUTOCOMPLETE,
  SET_PREFERENCE_VIM_MODE,
  SET_PREFERENCE_LIVE_PREVIEW,
  SET_PREFERENCE_PRETTIFY_ON_SAVE,
  SET_PREFERENCE_LINT,
} from './actions';
import {
  AUTO_COMPLETE,
  VIM_MODE,
  LIVE_PREVIEW,
  PRETTIFY_ON_SAVE,
  LINT_ENABLED,
} from './keys';

export type Preferences = {
  autoCompleteEnabled: boolean,
  vimMode: boolean,
  livePreviewEnabled: boolean,
  prettifyOnSaveEnabled: boolean,
  lintEnabled: boolean,
};

const getKey = (key, defaultVal) => {
  try {
    const result = store.get(key);
    return result === undefined ? !!defaultVal : result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const initialState: Preferences = {
  autoCompleteEnabled: getKey(AUTO_COMPLETE, true),
  vimMode: getKey(VIM_MODE, false),
  livePreviewEnabled: getKey(LIVE_PREVIEW, true),
  prettifyOnSaveEnabled: getKey(PRETTIFY_ON_SAVE, false),
  lintEnabled: getKey(LINT_ENABLED, false),
};

export default (state = initialState, action) => {
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
    default: {
      return state;
    }
  }
};
