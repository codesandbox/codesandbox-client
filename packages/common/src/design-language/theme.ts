import { colors } from './colors';
import { fontSizes, fontWeights } from './typography';

const theme = {
  colors,
  fontSizes,
  fontWeights,

  // we use a 4 point grid
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],

  // transition speeds in ms
  speeds: [0, '75ms', '100ms', '150ms', '200ms', '300ms', '500ms'],

  radii: {
    small: 2,
    medium: 4,
    large: 16,
    round: '50%',
  },

  shadows: {
    // this part is ugly, this can be improved.
    // bonus: these are terrible names
    active: `inset 0px -2px 0px ${colors.blues[300]}`,
    underline: `inset 0px -2px 0px ${colors.grays[100] + '1a'}`,
    fadeunder: `inset 0px 8px 8px 0px ${colors.grays[700] + 'cc'}`,
  },
};

export default theme;
