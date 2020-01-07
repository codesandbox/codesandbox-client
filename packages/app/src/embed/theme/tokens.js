// this theme follows the System UI Theme Specification
// Ref: https://system-ui.com/theme

const colors = {
  white: '#fff',
  grays: {
    100: '#fff9f9', // found this lingering around
    200: '#e6e6e6', // danny's gray-0
    300: '#999999', // danny's gray-1
    400: '#757575', // danny's gray-2
    500: '#242424', // danny's dark-3
    600: '#343434', // danny's dark-?
    700: '#151515', // danny's dark-2
    800: '#040404', // danny's dark-1
    900: '#111111', // danny's dark-0
  },
  blues: {
    300: '#6CC7F6', // danny's teal
    600: '#0971f1', // danny's blue
  },
  reds: {
    300: '#FF453A', // heart
    500: '#E1270E', // danny's red
  },
};

const theme = {
  colors,
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32],
  fontSizes: [
    0,
    9, // not used yet.
    11,
    13,
    16,
  ],
  fontWeights: {
    // matches Inter weights
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // transition speeds in ms
  speed: [0, '75ms', '100ms', '150ms', '200ms', '300ms', '500ms'],

  shadows: {
    // this part is ugly, this can be improved.
    // bonus: these are terrible names
    active: `inset 0px -2px 0px ${colors.blues[300]}`,
    underline: `inset 0px -2px 0px ${colors.grays[100] + '1a'}`,
    fadeunder: `inset 0px 8px 8px 0px ${colors.grays[700] + 'cc'}`,
  },
};

export default theme;
