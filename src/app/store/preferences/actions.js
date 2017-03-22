import store from 'store/dist/store.modern';

import { VIM_MODE, AUTO_COMPLETE } from './keys';

export const SET_PREFERENCE_AUTOCOMPLETE = 'SET_PREFERENCE_AUTOCOMPLETE';
export const SET_PREFERENCE_VIM_MODE = 'SET_PREFERENCE_VIM_MODE';

export default {
  setVimPreference: (vimMode: boolean) =>
    (dispatch: Function) => {
      store.set(VIM_MODE, vimMode);

      dispatch({
        type: SET_PREFERENCE_VIM_MODE,
        option: vimMode,
      });
    },

  setAutoCompletePreference: (autoComplete: boolean) =>
    (dispatch: Function) => {
      store.set(AUTO_COMPLETE, autoComplete);

      dispatch({
        type: SET_PREFERENCE_AUTOCOMPLETE,
        option: autoComplete,
      });
    },
};
