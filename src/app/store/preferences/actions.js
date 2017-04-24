import store from 'store/dist/store.modern';

import {
  VIM_MODE,
  AUTO_COMPLETE,
  LIVE_PREVIEW,
  PRETTIFY_ON_SAVE,
  LINT_ENABLED,
  INSTANT_PREVIEW,
} from './keys';

export const SET_PREFERENCE_AUTOCOMPLETE = 'SET_PREFERENCE_AUTOCOMPLETE';
export const SET_PREFERENCE_VIM_MODE = 'SET_PREFERENCE_VIM_MODE';
export const SET_PREFERENCE_LIVE_PREVIEW = 'SET_PREFERENCE_LIVE_PREVIEW';
export const SET_PREFERENCE_PRETTIFY_ON_SAVE =
  'SET_PREFERENCE_PRETTIFY_ON_SAVE';
export const SET_PREFERENCE_LINT = 'SET_PREFERENCE_LINT';
export const SET_INSTANT_PREVIEW = 'SET_INSTANT_PREVIEW';

const setOption = (key, val) => {
  try {
    store.set(key, val);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default {
  setVimPreference: (vimMode: boolean) => (dispatch: Function) => {
    setOption(VIM_MODE, vimMode);

    dispatch({
      type: SET_PREFERENCE_VIM_MODE,
      option: vimMode,
    });
  },

  setAutoCompletePreference: (autoComplete: boolean) => (
    dispatch: Function,
  ) => {
    setOption(AUTO_COMPLETE, autoComplete);

    dispatch({
      type: SET_PREFERENCE_AUTOCOMPLETE,
      option: autoComplete,
    });
  },

  setLivePreview: (livePreview: boolean) => (dispatch: Function) => {
    setOption(LIVE_PREVIEW, livePreview);

    dispatch({
      type: SET_PREFERENCE_LIVE_PREVIEW,
      option: livePreview,
    });
  },

  setPrettifyOnSavePreference: (prettify: boolean) => (dispatch: Function) => {
    setOption(PRETTIFY_ON_SAVE, prettify);

    dispatch({
      type: SET_PREFERENCE_PRETTIFY_ON_SAVE,
      option: prettify,
    });
  },

  setLintPreference: (lint: boolean) => (dispatch: Function) => {
    setOption(LINT_ENABLED, lint);

    dispatch({
      type: SET_PREFERENCE_LINT,
      option: lint,
    });
  },

  setInstantPreview: (instantPreview: boolean) => (dispatch: Function) => {
    setOption(INSTANT_PREVIEW, instantPreview);

    dispatch({
      type: SET_INSTANT_PREVIEW,
      option: instantPreview,
    });
  },
};
