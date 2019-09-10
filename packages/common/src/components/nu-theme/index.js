// new theme based on redesign
// this follows the System UI Theme Specification
// Ref: https://system-ui.com/theme
import components from './components';

const colors = {
  white: '#fff',
  grays: [
    '#fff9f9',
    '#e6e6e6', // danny's gray-0
    '#999999', // danny's gray-1
    '#757575', // danny's gray-2
    '#242424', // danny's dark-3
    '#151515', // danny's dark-2
    '#040404', // danny's dark-1
    '#111111', // danny's dark-0
  ],
  blues: [
    '#6CC7F6', // danny's teal
    '#0971f1', // danny's blue
  ],
};

const theme = {
  components,
  colors,
  space: [0, 4, 8, 12, 16, 32],
  fontSizes: [0, 12, 13, 14, 16, 20, 24, 32],
  shadows: {
    // this part is ugly, this can be improved
    active: `inset 0px -2px 0px ${colors.blues[0]}`,
    underline: `inset 0px -2px 0px ${colors.grays[0] + '1a'}`,
  },
};

export default theme;
