import React from 'react';
import ZenModeIntroduction from 'app/containers/modals/ZenModeIntroduction';

import * as keys from './keys';
import { setOption, getKey } from './store';

import modalActions from '../modal/actions';

export const SET_PREFERENCES = 'SET_PREFERENCES';

export default {
  setPreference: (preferences: Object) => (dispatch: Function) => {
    Object.keys(preferences).forEach(key => {
      if (key === 'zenMode') {
        if (!getKey('zenModeIntroduced')) {
          // We show an introduction to Zen Mode
          setOption('zenModeIntroduced', true);
          dispatch(modalActions.closeModal());
          dispatch(
            modalActions.openModal({
              Body: <ZenModeIntroduction />,
              width: 600,
            })
          );
        }
      }

      setOption(keys[key], preferences[key]);
    });
    dispatch({
      type: SET_PREFERENCES,
      preferences,
    });
  },
};
