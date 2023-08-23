import _debug from '../../utils/debug';
import hash from '../hash';

export const ANONYMOUS_UID_KEY = 'codesandbox-anonymous-uid';

export const debug = _debug('cs:analytics');

export const global = (typeof window !== 'undefined' ? window : {}) as any;

export function getHashedUserId(userId: string) {
  return hash(userId);
}

export const WHITELISTED_VSCODE_EVENTS = [
  'codesandbox.preview.toggle',
  'workbench.action.splitEditor',
  'workbench.action.toggleSidebarVisibility',
  'codesandbox.sandbox.new',
  'workbench.action.files.saveAs',
  'editor.action.addCommentLine',
  'codesandbox.sandbox.exportZip',
  'codesandbox.preferences',
  'codesandbox.sandbox.fork',
  'codesandbox.help.documentation',
  'codesandbox.help.github',
  'view.preview.flip',
  'codesandbox.search',
  'workbench.action.splitEditorLeft',
  'codesandbox.dashboard',
  'workbench.action.toggleCenteredLayout',
  'workbench.action.toggleMenuBar',
  'codesandbox.explore',
  'editor.action.toggleTabFocusMode',
  'workbench.action.splitEditorUp',
  'workbench.action.toggleSidebarPosition',
  'workbench.action.toggleActivityBarVisibility',
  'workbench.action.toggleStatusbarVisibility',
  'codesandbox.dependencies.add',
  'codesandbox.help.open-issue',
  'codesandbox.action.search',
  'workbench.action.editorLayoutThreeColumns',
  'breadcrumbs.toggleToOn',
  'workbench.action.openSettings2',
  'workbench.action.globalSettings',
  'workbench.action.editorLayoutTwoRows',
  'workbench.action.editorLayoutTwoByTwoGrid',
  'editor.action.showContextMenu',
  'toggleVim',
  'codesandbox.help.spectrum',
  'codesandbox.help.feedback',
  'workbench.action.webview.openDeveloperTools',
  'workbench.action.editorLayoutThreeRows',
  'codesandbox.help.twitter',
  'workbench.action.editorLayoutTwo',
  'codesandbox.preview.external',
  'notifications.showList',
  'workbench.action.editor.changeEncoding',
  'editor.action.indentationToTabs',
  'workbench.action.maximizeEditor',
  'editor.action.indentationToSpaces',
  'revealFilesInOS',
  'keybindings.editor.searchKeyBindings',
  'notifications.hideList',
  'workbench.action.terminal.focus',
  'workbench.action.console.focus',
  'workbench.action.openRecent',
  'code-runner.run',
];

const isDoNotTrackEnabled = () => {
  try {
    if (typeof window !== 'undefined') {
      let localStorageValue = true;
      try {
        localStorageValue =
          typeof localStorage !== 'undefined' &&
          localStorage.getItem('DO_NOT_TRACK_ENABLED') === 'true';
      } catch (e) {
        /* ignore */
      }

      return Boolean(
        // @ts-ignore
        global.doNotTrack === '1' ||
          // @ts-ignore
          global.navigator.doNotTrack === '1' ||
          // @ts-ignore
          global.navigator.msDoNotTrack === '1' ||
          localStorageValue ||
          process.env.NODE_ENV === 'development' ||
          process.env.STAGING
      );
    }

    return true;
  } catch (e) {
    return false;
  }
};

export const DO_NOT_TRACK_ENABLED = isDoNotTrackEnabled();

export const isAllowedEvent = (eventName, secondArg) => {
  try {
    if (eventName === 'VSCode - workbenchActionExecuted') {
      return WHITELISTED_VSCODE_EVENTS.includes(secondArg.id);
    }
    return true;
  } catch (e) {
    return true;
  }
};
