import preferenceActions from './actions';
import { preferencesSelector } from './selectors';
import sandboxActions from '../entities/sandboxes/actions';
import viewActions from '../view/actions';
import {
  devToolsOpenSelector,
  workspaceHiddenSelector,
} from '../view/selectors';

export const KEYBINDINGS = {
  'editor.workspace': {
    title: 'Toggle Sidebar',
    bindings: [['Shift'], ['Shift']],
    action: () => (dispatch: Function, getState: Function) => {
      const workspaceHidden = workspaceHiddenSelector(getState());
      dispatch(viewActions.setWorkspaceHidden(!workspaceHidden));
    },
  },

  'editor.editor-mode': {
    title: 'Editor View',
    bindings: [['Meta', 'K', 'E']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, true, false));
    },
  },

  'editor.preview-mode': {
    title: 'Preview View',
    bindings: [['Meta', 'K', 'P']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, false, true));
    },
  },

  'editor.split-mode': {
    title: 'Split View',
    bindings: [['Meta', 'K', 'S']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, true, true));
    },
  },

  'editor.zen-mode': {
    title: 'Zen Mode',
    bindings: [['Meta', 'K', 'Z']],
    action: () => (dispatch: Function, getState: Function) => {
      const currentZenMode = preferencesSelector(getState()).zenMode;
      dispatch(
        preferenceActions.setPreference({
          zenMode: !currentZenMode,
        })
      );
    },
  },

  'editor.toggle-console': {
    title: 'Toggle Console',
    bindings: [['Meta', 'K', 'D']],
    action: () => (dispatch: Function, getState: Function) => {
      const devToolsOpen = devToolsOpenSelector(getState());
      dispatch(viewActions.setDevToolsOpen(!devToolsOpen));
    },
  },
};
