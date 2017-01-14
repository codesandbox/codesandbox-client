// @flow
import * as actions from '../../actions/views/sandbox';

type Tab = {
  id: string;
};

type CustomTab = {
  icon: ?string;
  title: string;
} & Tab;

type ModuleTab = {
  moduleId: string;
  view: 'EditorPreview';
} & Tab;

export type Tabs = Array<CustomTab | ModuleTab>;

export type State = {
  currentTab: ?string;
  tabs: Tabs;
};

const initialState = {
  currentTab: null,
  tabs: [],
};

export default function sandboxReducer(state: State = initialState, action: any) {
  switch (action.type) {
    case actions.OPEN_MODULE_TAB: {
      const id = `module${action.moduleId}`;
      if (state.currentTab === id) return state;

      const newState = { ...state, currentTab: id };
      if (!state.tabs.find(t => t.id === id)) {
        // only add tab if it is not yet in the tabs array
        newState.tabs = [
          ...state.tabs,
          { id, moduleId: action.moduleId, view: 'EditorPreview' },
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
      const newCurrentTab = () => {
        if (state.currentTab === action.id) {
          if (state.tabs.length > 0) return state.tabs[0].id;
          return null;
        }
        return state.currentTab;
      };
      return {
        ...state,
        tabs: state.tabs.filter(t => t.id !== action.id),
        currentTab: newCurrentTab(),
      };
    }
    default:
      return state;
  }
}
