import store from 'store/dist/store.modern';

import {
  SET_PREFERENCE_AUTOCOMPLETE,
  SET_PREFERENCE_VIM_MODE,
} from './actions';
import { AUTO_COMPLETE, VIM_MODE } from './keys';

const getKey = (key, defaultVal) => {
  try {
    const result = store.get(key);
    return result === undefined ? !!defaultVal : result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const initialState = {
  autoCompleteEnabled: getKey(AUTO_COMPLETE, true),
  vimMode: getKey(VIM_MODE, false),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PREFERENCE_AUTOCOMPLETE:
      return { ...state, autoCompleteEnabled: action.option };
    case SET_PREFERENCE_VIM_MODE:
      return { ...state, vimMode: action.option };
    default: {
      return state;
    }
  }
};
