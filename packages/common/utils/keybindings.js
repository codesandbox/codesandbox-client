const isMac =
  typeof navigator !== 'undefined' &&
  !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
const metaKey = isMac ? 'Meta' : 'Alt';
const metaOrCtrlKey = isMac ? 'Meta' : 'Control';

export function normalizeKey(e: KeyboardEvent) {
  if (e.key) {
    if (e.key.split('').length === 1) {
      const key = String.fromCharCode(e.keyCode).toUpperCase();
      if (key === ' ') {
        return 'Space';
      }
      return key;
    }

    return e.key;
  }

  return undefined;
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
    bindings: [[metaOrCtrlKey, 'Shift', 'P']],
    signal: 'editor.quickActionsOpened',
  },

  workspace: {
    title: 'Toggle Sidebar',
    type: 'View',
    bindings: [],
    signal: 'workspace.toggleCurrentWorkspaceItem',
  },

  'editor.close-tab': {
    title: 'Close Current Tab',
    type: 'View',
    bindings: [['Control', 'W']],
    signal: 'editor.tabClosed',
    payload: state => ({
      tabIndex: state.editor.tabs
        .filter(x => x)
        .findIndex(t => t.moduleId === state.currentModuleId),
    }),
  },

  'editor.zen-mode': {
    title: 'Toggle Zen Mode',
    type: 'View',
    bindings: [[metaKey, 'K', 'Z']],
    signal: 'preferences.settingChanged',
    payload: state => ({
      name: 'zenMode',
      value: !state.preferences.settings.zenMode,
    }),
  },

  'editor.toggle-console': {
    title: 'Toggle Dev Tools',
    type: 'View',
    bindings: [[metaKey, 'K', 'D']],
    signal: 'preferences.devtoolsToggled',
  },

  'editor.open-preferences': {
    title: 'Open Preferences',
    type: 'View',
    bindings: [[metaOrCtrlKey, ',']],
    signal: 'modalOpened',
    payload: {
      modal: 'preferences',
    },
  },

  'source.dependencies.open': {
    title: 'Add Dependency',
    type: 'Source',
    bindings: [],
    signal: 'modalOpened',
    payload: {
      modal: 'searchDependencies',
    },
  },

  'source.modules.prettify': {
    title: 'Prettify Current File',
    type: 'Source',
    bindings: [],
    signal: 'editor.prettifyClicked',
    payload: state => ({
      moduleShortid: state.editor.currentModule.shortid,
    }),
  },

  'source.modules.save': {
    title: 'Save Current File',
    type: 'Source',
    bindings: [[metaOrCtrlKey, 'S']],
    signal: 'editor.codeSaved',
    payload: state => ({
      moduleShortid: state.editor.currentModule.shortid,
    }),
  },

  'source.modules.save-all': {
    title: 'Save All Modified Files',
    type: 'Source',
    bindings: [[metaOrCtrlKey, 'Shift', 'S']],
    signal: 'editor.saveClicked',
  },
};
