// @flow
import * as actions from './actions';
import * as preferenceActions from '../preferences/actions';

type State = {
  devToolsOpen: boolean,
  workspaceHidden: boolean,
};

const initialState = {
  devToolsOpen: false,
  workspaceHidden: false,
};

export default function reducer(
  state: State = initialState,
  action: Object
): State {
  switch (action.type) {
    case actions.SET_DEV_TOOLS_OPEN:
      return {
        ...state,
        devToolsOpen: action.open,
      };
    case actions.SET_WORKSPACE_HIDDEN:
      return {
        ...state,
        workspaceHidden: action.workspaceHidden,
      };
    case preferenceActions.SET_PREFERENCES:
      if (action.preferences.zenMode) {
        return {
          ...state,
          workspaceHidden: true,
        };
      } else if (action.preferences.zenMode === false) {
        return {
          ...state,
          workspaceHidden: false,
        };
      }
      return state;
    default:
      return state;
  }
}
