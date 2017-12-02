import {
  FETCH_USER_SANDBOXES_ACTIONS,
  FETCH_USER_LIKED_SANDBOXES_ACTIONS,
} from './actions';

const initialState = {};

function singleUserReducer(user, action) {
  switch (action.type) {
    case FETCH_USER_LIKED_SANDBOXES_ACTIONS.SUCCESS: {
      return {
        ...user,
        likedSandboxes: { ...user.liked_sandboxes, ...action.data },
      };
    }
    case FETCH_USER_SANDBOXES_ACTIONS.SUCCESS: {
      return { ...user, sandboxes: { ...user.sandboxes, ...action.data } };
    }

    default: {
      return user;
    }
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_LIKED_SANDBOXES_ACTIONS.SUCCESS:
    case FETCH_USER_SANDBOXES_ACTIONS.SUCCESS: {
      const { username } = action.meta;
      if (username && state[username]) {
        return {
          ...state,
          [username]: singleUserReducer(state[username], action),
        };
      }
      return state;
    }
    default:
      return state;
  }
}
