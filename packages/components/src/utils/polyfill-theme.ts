/**
 * Our interface does not map 1-1 with vscode
 * To add styles that remain themeable, we add
 * some _polyfills_ to the theme tokens.
 * These are mapped to existing variables from the vscode theme
 * that always exists - editor, sidebar.
 */

import deepmerge from 'deepmerge';

// TODO: For themes that we officially support, we have the option
// to modify the theme and add our custom keys
// which we can use when the polyfill is a bad alternate.
// In that case, we should check if it exists before overriding it
const polyfillTheme = vsCodeTheme =>
  deepmerge(vsCodeTheme, {
    sideBar: {
      hoverBackground: vsCodeTheme.sideBar.border,
    },
  });

export default polyfillTheme;
