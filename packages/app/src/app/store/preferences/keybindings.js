import preferenceActions from './actions';
import { preferencesSelector } from './selectors';
import sandboxActions from '../entities/sandboxes/actions';
import viewActions from '../view/actions';
import modalActions from '../modal/actions';
import {
  devToolsOpenSelector,
  workspaceHiddenSelector,
  quickActionsOpenSelector,
} from '../view/selectors';

const isMac = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
const metaKey = isMac ? 'Meta' : 'Alt';

export function normalizeKey(e: KeyboardEvent) {
  if (e.code.startsWith('Key')) {
    const key = String.fromCharCode(e.keyCode).toUpperCase();
    if (key === ' ') {
      return 'Space';
    }
    return key;
  }

  return e.key;
}

export function formatKey(key: string) {
  switch (key) {
    case 'Meta': {
      if (isMac) {
        return '⌘';
      }
      return 'Win';
    }
    case 'Control':
      return 'Ctrl';
    case ' ':
      return 'Space';
    case 'Shift':
      return '⇧';
    default:
      if (key.split('').length === 1) {
        return key.toUpperCase();
      }
      return key;
  }
}

export const KEYBINDINGS = {
  'editor.open-quick-actions': {
    title: 'Open Quick Actions',
    type: 'View',
    bindings: [[metaKey, 'Shift', 'P']],
    action: () => (dispatch: Function, getState: Function) => {
      const quickActionsOpen = quickActionsOpenSelector(getState());
      dispatch(viewActions.setQuickActionsOpen(!quickActionsOpen));
    },
  },

  'editor.workspace': {
    title: 'Toggle Sidebar',
    type: 'View',
    bindings: [[metaKey], ['Shift']],
    action: () => (dispatch: Function, getState: Function) => {
      const workspaceHidden = workspaceHiddenSelector(getState());
      dispatch(viewActions.setWorkspaceHidden(!workspaceHidden));
    },
  },

  'editor.editor-mode': {
    title: 'Editor View',
    type: 'View',
    bindings: [[metaKey, 'K', 'E']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, true, false));
    },
  },

  'editor.preview-mode': {
    title: 'Preview View',
    type: 'View',
    bindings: [[metaKey, 'K', 'P']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, false, true));
    },
  },

  'editor.split-mode': {
    title: 'Split View',
    type: 'View',
    bindings: [[metaKey, 'K', 'S']],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(sandboxActions.setViewMode(id, true, true));
    },
  },

  'editor.zen-mode': {
    title: 'Toggle Zen Mode',
    type: 'View',
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
    type: 'View',
    bindings: [[metaKey, 'K', 'D']],
    action: () => (dispatch: Function, getState: Function) => {
      const devToolsOpen = devToolsOpenSelector(getState());
      dispatch(viewActions.setDevToolsOpen(!devToolsOpen));
    },
  },

  'editor.open-preferences': {
    title: 'Open Preferences',
    type: 'View',
    bindings: [[metaKey, ',']],
    action: () => (dispatch: Function) => {
      dispatch(modalActions.openPreferences());
    },
  },

  'source.dependencies.open': {
    title: 'Add Dependency',
    type: 'Source',
    bindings: [],
    action: ({ id }) => (dispatch: Function) => {
      dispatch(modalActions.openSearchDependencies(id));
    },
  },
};
