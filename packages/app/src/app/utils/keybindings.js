const isMac = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
const metaKey = isMac ? 'Meta' : 'Alt';

export function normalizeKey(e: KeyboardEvent) {
  if (e.key.split('').length === 1) {
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
    signal: 'editor.quickActionsOpened',
  },

  workspace: {
    title: 'Toggle Sidebar',
    type: 'View',
    bindings: [[metaKey], ['Shift']],
    signal: 'workspace.clearCurentWorkspaceItem',
  },

  'editor.editor-mode': {
    title: 'Editor View',
    type: 'View',
    bindings: [[metaKey, 'K', 'E']],
    signal: 'preferences.viewModeChanged',
    payload: {
      showEditor: true,
      showPreview: false,
    },
  },

  'editor.preview-mode': {
    title: 'Preview View',
    type: 'View',
    bindings: [[metaKey, 'K', 'P']],
    signal: 'preferences.viewModeChanged',
    payload: {
      showEditor: false,
      showPreview: true,
    },
  },

  'editor.split-mode': {
    title: 'Split View',
    type: 'View',
    bindings: [[metaKey, 'K', 'S']],
    signal: 'preferences.viewModeChanged',
    payload: {
      showEditor: true,
      showPreview: true,
    },
  },

  'editor.zen-mode': {
    title: 'Toggle Zen Mode',
    type: 'View',
    bindings: [[metaKey, 'K', 'Z']],
    signal: 'preferences.zenModeToggled',
  },

  'editor.toggle-console': {
    title: 'Toggle Console',
    type: 'View',
    bindings: [[metaKey, 'K', 'D']],
    signal: 'preferences.devtoolsToggled',
  },

  'editor.open-preferences': {
    title: 'Open Preferences',
    type: 'View',
    bindings: [[metaKey, ',']],
    signal: 'preferences.modalOpened',
  },

  'source.dependencies.open': {
    title: 'Add Dependency',
    type: 'Source',
    bindings: [],
    signal: 'workspace.searchDependenciesModalOpened',
  },

  'source.modules.prettify': {
    title: 'Prettify Current File',
    type: 'Source',
    bindings: [],
    signal: 'editor.prettifyClicked',
  },
};
