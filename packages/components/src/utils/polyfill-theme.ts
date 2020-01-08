/**
 * Our interface does not map 1-1 with vscode
 * To add styles that remain themeable, we add
 * some _polyfills_ to the theme tokens.
 * These are mapped to existing variables from the vscode theme
 * that always exists - editor, sidebar.
 */

import deepmerge from 'deepmerge';
import designLanguage from '@codesandbox/common/lib/design-language';

// TODO: these polyfills are built for codesandbox Black and need to
// checked for other themes as well.

// TODO: For themes that we officially support, we have the option
// to modify the theme and add our custom keys
// which we can use when the polyfill is a bad alternate.
// In that case, we should check if it exists before overriding it
const polyfillTheme = vsCodeTheme =>
  deepmerge(vsCodeTheme, {
    mutedForeground: vsCodeTheme.foreground,
    sideBar: {
      hoverBackground: vsCodeTheme.sideBar.border,
    },
    switch: {
      background: designLanguage.colors.grays[800],
      foregroundOff: designLanguage.colors.white,
      foregroundOn: designLanguage.colors.green,
    },
  });

export default polyfillTheme;
