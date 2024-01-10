import { colors, colorsV2 } from './colors';
import { fontSizes, fontWeights } from './typography';

const theme = {
  colors,
  colorsV2,
  fontSizes,
  fontWeights,
  // we use a 4 point grid
  // 0 - 0
  // 1 - 4
  // 2 - 8
  // 3 - 12
  // 4 - 16
  // 5 - 20
  // 6 - 24
  // 7 - 28
  // 8 - 32
  // 9 - 36
  // 10 - 40
  // 11 - 44
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  sizes: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],

  // transition speeds in ms
  speeds: [0, '75ms', '100ms', '150ms', '200ms', '300ms', '500ms'],

  // mobile first
  breakpoints: ['576px', '768px', '992px'],

  radii: {
    small: 2,
    medium: 4,
    large: 16,
    round: '50%',
  },

  shadows: {
    // based on elevation levels
    0: 'none',
    1: '0px 8px 4px rgba(0, 0, 0, 0.12), 0px 8px 16px rgba(0, 0, 0, 0.24)',
    2: '0px 4px 4px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.24)',

    // this part is ugly, this can be improved.
    // bonus: these are terrible names
    active: `inset 0px -2px 0px ${colors.blues[300]}`,
    underline: `inset 0px -2px 0px ${colors.grays[100] + '1a'}`,
    fadeunder: `inset 0px 8px 8px 0px ${colors.grays[700] + 'cc'}`,
  },
};

export default theme;
