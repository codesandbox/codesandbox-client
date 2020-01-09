/**
 * Our interface does not map 1-1 with vscode
 * To add styles that remain themeable, we add
 * some _polyfills_ to the theme tokens.
 * These are mapped to existing variables from the vscode theme
 * that always exists - editor, sidebar.
 *
 * These are our best guesses.
 */

// TODO: For themes that we officially support, we have the option
// to modify the theme and add our custom keys
// which we can use when the polyfill is a bad alternate.
// In that case, we should check if it exists before overriding it

import deepmerge from 'deepmerge';

const polyfillTheme = vsCodeTheme =>
  deepmerge(vsCodeTheme, {
    mutedForeground: vsCodeTheme.foreground, // todo: find a way to fill this value
    sideBar: {
      hoverBackground: vsCodeTheme.sideBar.border,
    },
    avatar: {
      border: vsCodeTheme.sideBar.border,
    },
    button: {
      // this key is can defined by vscode, but not always present
      // we add a 30% overlay on top of the background color using gradient
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${vsCodeTheme.button.background}`,
    },
    secondaryButton: {
      background: vsCodeTheme.input.background,
      foreground: vsCodeTheme.input.foreground,
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${vsCodeTheme.input.background}`,
    },
  });

export default polyfillTheme;
