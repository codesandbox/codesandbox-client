import { isMac, isIOS } from './platform';

const metaKey = isMac ? (isIOS ? 'Alt' : 'Meta') : 'Alt';
const metaOrCtrlKey = isMac ? (isIOS ? 'Alt' : 'Meta') : 'Control';
const ctrlOrAltKey = isIOS ? 'Alt' : 'Control';

// String.fromCharCode receives UTF-16 code units, but the keyCode represents the actual
// "physical" key on the keyboard. For this reason it's sketchy (some do match) to
// String.fromCharCode(e.keyCode) so we have this table with the correct mapping.
// KeyCode is a weird spec (it is a key event api after all) but it's defined in a way that
// it's i18n safe: In the US keyboard "," and "<" are on the same physical key so they
// both have keyCode 188. One might expect this will break in non-US keyboards since
// these characters are in different physical keys, however, the spec is defined in a way
// that no matter which physical key the "," and the "<" are in, they'll always be keyCode 188.
// http://www.javascripter.net/faq/keycodes.htm
const keyCodeMapping = {
  '188': ',',
};

export function normalizeKey(e: KeyboardEvent) {
  if (e.key) {
    if (e.key.split('').length === 1) {
      let key;
      if (Object.prototype.hasOwnProperty.call(keyCodeMapping, e.keyCode)) {
        key = keyCodeMapping[e.keyCode];
      } else {
        key = String.fromCharCode(e.keyCode).toUpperCase();
      }
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
    bindings: [[metaOrCtrlKey, 'B']],
    signal: 'workspace.toggleCurrentWorkspaceItem',
  },

  'editor.close-tab': {
    title: 'Close Current Tab',
    type: 'View',
    bindings: [[ctrlOrAltKey, 'W']],
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
