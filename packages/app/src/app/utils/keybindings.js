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
    signal: 'editor.quickActionsOpened',
  },

  'editor.workspace': {
    title: 'Toggle Sidebar',
    type: 'View',
    bindings: [[metaKey], ['Shift']],
    signal: 'editor.workspace.workspaceToggled',
  },

  'editor.editor-mode': {
    title: 'Editor View',
    type: 'View',
    bindings: [[metaKey, 'K', 'E']],
    signal: 'editor.preferences.viewModeChanged',
    payload: {
      showEditor: true,
      showPreview: false,
    },
  },

  'editor.preview-mode': {
    title: 'Preview View',
    type: 'View',
    bindings: [[metaKey, 'K', 'P']],
    signal: 'editor.preferences.viewModeChanged',
    payload: {
      showEditor: false,
      showPreview: true,
    },
  },

  'editor.split-mode': {
    title: 'Split View',
    type: 'View',
    bindings: [[metaKey, 'K', 'S']],
    signal: 'editor.preferences.viewModeChanged',
    payload: {
      showEditor: true,
      showPreview: true,
    },
  },

  'editor.zen-mode': {
    title: 'Toggle Zen Mode',
    type: 'View',
    bindings: [[metaKey, 'K', 'Z']],
    signal: 'editor.preferences.zenModeToggled',
  },

  'editor.toggle-console': {
    title: 'Toggle Console',
    type: 'View',
    bindings: [[metaKey, 'K', 'D']],
    signal: 'editor.preferences.devtoolsToggled',
  },

  'editor.open-preferences': {
    title: 'Open Preferences',
    type: 'View',
    bindings: [[metaKey, ',']],
    signal: 'editor.preferences.modalOpened',
  },

  'source.dependencies.open': {
    title: 'Add Dependency',
    type: 'Source',
    bindings: [],
    signal: 'editor.workspace.searchDependenciesModalOpened',
  },

  'source.modules.prettify': {
    title: 'Prettify Current File',
    type: 'Source',
    bindings: [],
    signal: 'editor.prettifyClicked',
  },
};
