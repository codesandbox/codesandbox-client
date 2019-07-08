import { Action } from 'app/overmind';
import { SandboxOptions } from '@codesandbox/common/lib/url';

export const updatePreferencesFromSandboxOptions: Action<SandboxOptions> = (
  { state },
  sandboxOptions
) => {
  state.preferences.showPreview =
    sandboxOptions.isPreviewScreen || sandboxOptions.isSplitScreen;

  state.preferences.showEditor =
    sandboxOptions.isEditorScreen || sandboxOptions.isSplitScreen;

  if (sandboxOptions.initialPath)
    state.editor.initialPath = sandboxOptions.initialPath;
  if (sandboxOptions.fontSize)
    state.preferences.settings.fontSize = sandboxOptions.fontSize;
  if (sandboxOptions.highlightedLines)
    state.editor.highlightedLines = sandboxOptions.highlightedLines;
  if (sandboxOptions.hideNavigation)
    state.preferences.hideNavigation = sandboxOptions.hideNavigation;
  if (sandboxOptions.isInProjectView)
    state.editor.isInProjectView = sandboxOptions.isInProjectView;
  if (sandboxOptions.autoResize)
    state.preferences.settings.autoResize = sandboxOptions.autoResize;
  if (sandboxOptions.useCodeMirror)
    state.preferences.settings.useCodeMirror = sandboxOptions.useCodeMirror;
  if (sandboxOptions.enableEslint)
    state.preferences.settings.enableEslint = sandboxOptions.enableEslint;
  if (sandboxOptions.forceRefresh)
    state.preferences.settings.forceRefresh = sandboxOptions.forceRefresh;
  if (sandboxOptions.expandDevTools)
    state.preferences.showDevtools = sandboxOptions.expandDevTools;
  if (sandboxOptions.runOnClick)
    state.preferences.runOnClick = sandboxOptions.runOnClick;
};
