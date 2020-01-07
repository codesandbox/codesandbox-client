/**
 * Our interface does not map 1-1 with vscode
 * To add styles that remain themeable, we add
 * some _polyfills_ to the theme tokens.
 * These are mapped to existing variables from the vscode theme
 * that always exists - editor, sidebar.
 */

import deepmerge from 'deepmerge';

const polyfillTheme = vsCodeTheme =>
  deepmerge(vsCodeTheme, {
    sideBar: {
      hoverBackground: vsCodeTheme.sideBar.border,
    },
  });

export default polyfillTheme;
