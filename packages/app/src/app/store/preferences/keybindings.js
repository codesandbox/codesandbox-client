import preferenceActions from './actions';
import { preferencesSelector } from './selectors';
import sandboxActions from '../entities/sandboxes/actions';
import viewActions from '../view/actions';
import {
  devToolsOpenSelector,
  workspaceHiddenSelector,
} from '../view/selectors';

const isMac = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
const metaKey = isMac ? 'Meta' : 'Alt';

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
    bindings: [[metaKey, 'K', 'E']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, true, false));
    },
  },

  'editor.preview-mode': {
    title: 'Preview View',
    bindings: [[metaKey, 'K', 'P']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, false, true));
    },
  },

  'editor.split-mode': {
    title: 'Split View',
    bindings: [[metaKey, 'K', 'S']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, true, true));
    },
  },

  'editor.zen-mode': {
    title: 'Zen Mode',
    bindings: [[metaKey, 'K', 'Z']],
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
    bindings: [[metaKey, 'K', 'D']],
    action: () => (dispatch: Function, getState: Function) => {
      const devToolsOpen = devToolsOpenSelector(getState());
      dispatch(viewActions.setDevToolsOpen(!devToolsOpen));
    },
  },
};
