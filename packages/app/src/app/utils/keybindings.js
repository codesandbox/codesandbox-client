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
    action: signals => {
      signals.editor.preferences.quickActionsOpened();
    },
  },

  'editor.workspace': {
    title: 'Toggle Sidebar',
    type: 'View',
    bindings: [[metaKey], ['Shift']],
    action: signals => {
      signals.editor.workspace.workspaceToggled();
    },
  },

  'editor.editor-mode': {
    title: 'Editor View',
    type: 'View',
    bindings: [[metaKey, 'K', 'E']],
    action: signals => {
      signals.editor.preferences.viewModeChanged({
        showEditor: true,
        showPreview: false,
      });
    },
  },

  'editor.preview-mode': {
    title: 'Preview View',
    type: 'View',
    bindings: [[metaKey, 'K', 'P']],
    action: signals => {
      signals.editor.preferences.viewModeChanged({
        showEditor: false,
        showPreview: true,
      });
    },
  },

  'editor.split-mode': {
    title: 'Split View',
    type: 'View',
    bindings: [[metaKey, 'K', 'S']],
    action: signals => {
      signals.editor.preferences.viewModeChanged({
        showEditor: true,
        showPreview: true,
      });
    },
  },

  'editor.zen-mode': {
    title: 'Toggle Zen Mode',
    type: 'View',
    bindings: [[metaKey, 'K', 'Z']],
    action: signals => {
      signals.editor.preferences.zenModeToggled();
    },
  },

  'editor.toggle-console': {
    title: 'Toggle Console',
    type: 'View',
    bindings: [[metaKey, 'K', 'D']],
    action: signals => {
      signals.editor.preferences.devtoolsToggled();
    },
  },

  'editor.open-preferences': {
    title: 'Open Preferences',
    type: 'View',
    bindings: [[metaKey, ',']],
    action: signals => {
      signals.modalOpened({ name: 'preferences' });
    },
  },

  'source.dependencies.open': {
    title: 'Add Dependency',
    type: 'Source',
    bindings: [],
    action: signals => {
      signals.modalOpened({ name: 'searchDependencies' });
    },
  },

  'source.modules.prettify': {
    title: 'Prettify Current File',
    type: 'Source',
    bindings: [],
    action: signals => {
      signals.editor.prettifyClicked();
    },
  },
};
