import dot from 'dot-object';
import deepmerge from 'deepmerge';
import designLanguage from '@codesandbox/common/lib/design-language';
import codesandboxBlack from '../themes/codesandbox-black';
import codesandboxLight from '../themes/codesandbox-light.json';

const polyfillTheme = (vsCodeColors, type = 'dark') => {
  /**
   *
   * In order of importance, this is the value we use:
   * 1. Value from theme
   * 2. or inferred value from theme
   * 3. or value from codesandbox black/light
   *
   * if all 3 things fail (can happen to themes with unconventional colors like purple),
   * we modify the theme and hardcode values that work well.
   *
   */

  let uiColors = {};

  // Step 1: Initialise colors
  const codesandboxColors =
    type === 'dark' ? codesandboxBlack.colors : codesandboxLight.colors;

  // initialise ui colors as codesandbox theme for base
  uiColors = dot.object(codesandboxColors);
  // override with vscode colors that exist in theme
  uiColors = deepmerge(uiColors, vsCodeColors);

  // Step 2: Infer missing colors
  // This includes colors that are not very common
  // or are introduced by us

  const inferredColors = {
    // global text colors

    // foreground: 'red',
    mutedForeground: uiColors.input.placeholderForeground,
    // errorForeground: 'red',

    sideBar: {
      // foreground: 'red',
      // background: 'red',
      // border: 'red',
      hoverBackground: uiColors.sideBar.border,
    },
    avatar: {
      border: uiColors.sideBar.border,
    },
    input: {
      // background: 'red',
      // foreground: 'red',
      // border: 'red',
      // placeholderForeground: 'red',
    },
    inputOption: {
      activeBorder: uiColors.input.placeholderForeground,
    },
    button: {
      // background: 'red',
      // foreground: 'red',
      // 30% overlay on top of the background color using gradient
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${uiColors.button.background}`,
    },
    secondaryButton: {
      background: uiColors.sideBar.border,
      foreground: uiColors.sideBar.foreground,
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${uiColors.sideBar.border}`,
    },
    dangerButton: {
      background: designLanguage.colors.reds[300],
      foreground: 'white',
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${designLanguage.colors.reds[300]}`,
    },
    switch: {
      background: uiColors.sideBar.border,
      foregroundOff: designLanguage.colors.white,
      foregroundOn: designLanguage.colors.green,
    },
  };

  // merge inferred colors into ui colors
  // override with values from theme if they already exist
  uiColors = deepmerge(uiColors, inferredColors);
  uiColors = deepmerge(uiColors, vsCodeColors);

  return uiColors;
};

export default polyfillTheme;
