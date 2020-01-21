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
import designLanguage from '@codesandbox/common/lib/design-language';

const polyfillTheme = vsCodeTheme =>
  deepmerge(vsCodeTheme, {
    sideBar: {
      hoverBackground: (vsCodeTheme.sideBar || {}).border || 'red',
    },
    // this works for codesandbox-black but I doubt other themes define this
    mutedForeground: vsCodeTheme.input.placeholderForeground,
    // putting this here so that we remember to polyfill it
    input: {
      placeholderForeground: vsCodeTheme.input.placeholderForeground,
    },
    inputOption: {
      activeBorder: vsCodeTheme.input.placeholderForeground,
    },
    avatar: {
      border: (vsCodeTheme.sideBar || {}).border || 'red',
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
    dangerButton: {
      // @ts-ignore: The colors totally exist, our typings are incorrect
      background: designLanguage.colors.reds[300],
      foreground: '#fff',
      // @ts-ignore: The colors totally exist, our typings are incorrect
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${designLanguage.colors.reds[300]}`,
    },
    switch: {
      // @ts-ignore
      background: designLanguage.colors.grays[800],
      // @ts-ignore
      foregroundOff: designLanguage.colors.white,
      // @ts-ignore
      foregroundOn: designLanguage.colors.green,
    },
  });

export default polyfillTheme;
