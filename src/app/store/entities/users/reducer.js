import { FETCH_USER_SANDBOXES_ACTIONS } from './actions';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_SANDBOXES_ACTIONS.SUCCESS: {
      const { username } = action.meta;
      if (username && state[username]) {
        return {
          ...state,
          [username]: { ...state[username], sandboxes: action.data.data },
        };
      }
      return state;
    }
    default:
      return state;
  }
}
