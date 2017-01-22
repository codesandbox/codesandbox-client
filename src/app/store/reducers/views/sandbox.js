// @flow
import { findIndex } from 'lodash';

import * as actions from '../../actions/views/sandbox';

type CustomTab = {
  icon: ?string;
  title: string;
};

export type ModuleTab = {
  moduleId: string;
  view: 'EditorPreview' | 'FullPreview';
};

export type Tab = {
  id: string;
  view: 'EditorPreview';
} & (CustomTab | ModuleTab);

export type Tabs = Array<Tab>;

export type SandboxState = {
  currentTab: ?string;
  tabs: Tabs;
};

export type State = {
  [sandboxId: string]: SandboxState;
  currentSandboxId: ?string;
};

const initialState = {
  currentSandboxId: null,
};

const initialSandboxState: SandboxState = {
  tabs: [],
  currentTab: null,
};

function singleSandboxReducer(state: SandboxState = initialSandboxState, action: any) {
  switch (action.type) {
    case actions.OPEN_MODULE_TAB: {
      const id = `module${action.moduleId}`;
      if (state.currentTab === id) return state;

      const newState = { ...state, currentTab: id };
      if (!state.tabs.find(t => t.id === id)) {
        // only add tab if it is not yet in the tabs array
        newState.tabs = [
          ...state.tabs,
          { id, moduleId: action.moduleId, view: action.view },
        ];
      }

      return newState;
    }
    case actions.SET_TAB: {
      return {
        ...state,
        currentTab: action.id,
      };
    }
    case actions.CLOSE_TAB: {
      const newTabs = state.tabs.filter(t => t.id !== action.id);
      const newCurrentTab = () => {
        if (state.currentTab === action.id) {
          const oldTabPosition = findIndex(state.tabs, t => t.id === action.id);
          const newCurrentTabPosition = Math.max(0, oldTabPosition - 1);

          if (newTabs[newCurrentTabPosition]) return newTabs[newCurrentTabPosition].id;
          return null;
        }
        return state.currentTab;
      };

      return {
        ...state,
        tabs: newTabs,
        currentTab: newCurrentTab(),
      };
    }
    case actions.RESET_SANDBOX_VIEW:
      return initialState;
    default:
      return initialSandboxState;
  }
}

export default function sandboxReducer(state: State = initialState, action: any) {
  switch (action.type) {
    case actions.OPEN_MODULE_TAB:
    case actions.SET_TAB:
    case actions.CLOSE_TAB:
    case actions.RESET_SANDBOX_VIEW:
      if (state.currentSandboxId == null) {
        return state;
      }
      return {
        ...state,
        [state.currentSandboxId]: singleSandboxReducer(state[state.currentSandboxId], action),
      };
    case actions.SET_CURRENT_SANDBOX:
      return { ...state, currentSandboxId: action.sandboxId };
    default:
      return state;
  }
}
