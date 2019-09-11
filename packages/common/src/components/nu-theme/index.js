// new theme based on redesign
// this follows the System UI Theme Specification
// Ref: https://system-ui.com/theme

import components from './components';

const colors = {
  white: '#fff',
  grays: {
    100: '#fff9f9', // found this lingering around
    200: '#e6e6e6', // danny's gray-0
    300: '#999999', // danny's gray-1
    400: '#757575', // danny's gray-2
    500: '#242424', // danny's dark-3
    600: 'pink', // doesn't exist yet
    700: '#151515', // danny's dark-2
    800: '#040404', // danny's dark-1
    900: '#111111', // danny's dark-0
  },
  blues: {
    300: '#6CC7F6', // danny's teal
    600: '#0971f1', // danny's blue
  },
};

const theme = {
  components,
  colors,
  space: [0, 4, 8, 16, 32],
  fontSizes: [0, 12, 13, 14, 16, 20, 24, 32],

  shadows: {
    // this part is ugly, this can be improved
    active: `inset 0px -2px 0px ${colors.blues[300]}`,
    underline: `inset 0px -2px 0px ${colors.grays[100] + '1a'}`,
  },
};

export default theme;
