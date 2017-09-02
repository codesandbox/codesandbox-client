// @flow
import * as actions from './actions';

type State = {
  connected: boolean,
};

const initialState = {
  connected: false,
};

export default function reducer(
  state: State = initialState,
  action: Object
): State {
  switch (action.type) {
    case actions.SET_CONNECTION_STATUS:
      return {
        ...state,
        connected: action.connected,
      };
    default:
      return state;
  }
}
