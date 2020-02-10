/**
 *
 * switch color for light theme
 * secondary button color
 * collapsible icon
 *
 */
import dot from 'dot-object';
import deepmerge from 'deepmerge';
import Color from 'color';
import designLanguage from '@codesandbox/common/lib/design-language/theme';
import codesandboxBlack from '../themes/codesandbox-black';
import codesandboxLight from '../themes/codesandbox-light.json';

const polyfillTheme = vsCodeTheme => {
  /**
   *
   * In order of importance, this is the value we use:
   * 1. Value from theme
   * 2. or inferred value from theme
   * 3. or value from codesandbox black/light
   *
   * The steps required to get there are -
   * 1. Take vscode theme
   * 2. Fill missing values based on existing values or codesandbox dark/light
   * 3. Infer values that are not defined by vscode theme
   *
   */
  let uiColors: any = {
    // initialise objects to avoid null checks later
    editor: {},
    button: {},
    input: {},
    inputOption: {},
    list: {},
    sideBar: {},
    activityBar: {},
  };

  const type = vsCodeTheme.type || guessType(vsCodeTheme);

  //  Step 1: Initialise with vscode theme
  const vsCodeColors = dot.object(vsCodeTheme.colors || {});
  uiColors = deepmerge(uiColors, vsCodeColors);

  // Step 2: Fill missing values from existing values or codesandbox dark/light

  const codesandboxColors = ['dark', 'lc'].includes(type)
    ? dot.object(codesandboxBlack.colors)
    : dot.object(codesandboxLight.colors);

  // 2.1 First, lets fill in core values that are used to infer other values

  uiColors.foreground = uiColors.foreground || codesandboxColors.foreground;
  uiColors.errorForeground =
    uiColors.errorForeground || codesandboxColors.errorForeground;

  uiColors.sideBar = {
    background:
      uiColors.sideBar.background ||
      uiColors.editor.background ||
      codesandboxColors.sideBar.background,
    foreground:
      uiColors.sideBar.foreground ||
      uiColors.editor.foreground ||
      codesandboxColors.sideBar.foreground,
    border:
      uiColors.sideBar.border ||
      uiColors.editor.lineHighlightBackground ||
      codesandboxColors.sideBar.border,
  };

  uiColors.input = {
    background: uiColors.input.background || uiColors.sideBar.border,
    foreground: uiColors.input.foreground || uiColors.sideBar.foreground,
    border: uiColors.input.border || uiColors.sideBar.border,
    placeholderForeground:
      uiColors.input.placeholderForeground ||
      codesandboxColors.input.placeholderForeground,
  };

  uiColors.inputOption.activeBorder =
    uiColors.inputOption.activeBorder || uiColors.input.placeholderForeground;

  uiColors.button = {
    background:
      uiColors.button.background || codesandboxColors.button.background,
    foreground:
      uiColors.button.foreground || codesandboxColors.button.foreground,
  };

  // Step 3. Infer values that are not defined by vscode theme

  // Step 3.1
  // As all VSCode themes are built for a code editor,
  // the design decisions made in them might not work well
  // for an interface like ours which has other ui elements as well.
  // To make sure the UI looks great, we change some of these design decisions
  // made by the theme author

  const decreaseContrast = type === 'dark' ? lighten : darken;

  const mutedForeground = withContrast(
    uiColors.input.placeholderForeground,
    uiColors.sideBar.background,
    type
  );

  if (uiColors.sideBar.border === uiColors.sideBar.background) {
    uiColors.sideBar.border = decreaseContrast(
      uiColors.sideBar.background,
      0.25
    );
  }

  if (uiColors.sideBar.hoverBackground === uiColors.sideBar.background) {
    uiColors.sideBar.hoverBackground = decreaseContrast(
      uiColors.sideBar.background,
      0.25
    );
  }

  uiColors.list.foreground = uiColors.list.foreground || mutedForeground;
  uiColors.list.hoverForeground =
    uiColors.list.hoverForeground || uiColors.sideBar.foreground;
  uiColors.list.hoverBackground =
    uiColors.list.hoverBackground || uiColors.sideBar.hoverBackground;

  // Step 3.2
  // On the same theme of design decisions for interfaces,
  // we add a bunch of extra elements and interaction.
  // To make these elements look natural with the theme,
  // we infer them from the theme

  const addedColors = {
    mutedForeground,
    activityBar: {
      selected: uiColors.sideBar.foreground,
      inactiveForeground: mutedForeground,
      hoverBackground: uiColors.sideBar.border,
    },
    avatar: { border: uiColors.sideBar.border },
    sideBar: { hoverBackground: uiColors.sideBar.border },
    button: {
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${uiColors.button.background}`,
    },
    secondaryButton: {
      background: uiColors.input.background,
      foreground: uiColors.input.foreground,
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${uiColors.sideBar.border}`,
    },
    dangerButton: {
      background: designLanguage.colors.reds[300],
      foreground: 'white',
      hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${designLanguage.colors.reds[300]}`,
    },
    icon: {
      foreground: uiColors.foreground,
    },
    switch: {
      backgroundOff: uiColors.input.background,
      backgroundOn: uiColors.button.background,
      toggle: designLanguage.colors.white,
    },
  };

  uiColors = deepmerge(uiColors, addedColors);

  if (uiColors.switch.backgroundOff === uiColors.sideBar.background) {
    uiColors.switch.backgroundOff = uiColors.sideBar.border;
  }

  if (uiColors.switch.toggle === uiColors.switch.backgroundOff) {
    // default is white, we make it a little darker
    uiColors.switch.toggle = designLanguage.colors.grays[200];
  }

  return uiColors;
};

export default polyfillTheme;

const guessType = theme => {
  if (theme.name && theme.name.toLowerCase().includes('light')) return 'light';
  return 'dark';
};

const lighten = (color, value) =>
  Color(color)
    .lighten(value)
    .hex();

const darken = (color, value) =>
  Color(color)
    .darken(value)
    .hex();

const withContrast = (color, background, type) => {
  if (Color(color).contrast(Color(background)) > 4.5) return color;

  // can't fix that
  if (color === '#FFFFFF' || color === '#000000') return color;

  // recursively increase contrast
  const increaseContrast = type === 'dark' ? lighten : darken;
  return withContrast(increaseContrast(color, 0.1), background, type);
};
