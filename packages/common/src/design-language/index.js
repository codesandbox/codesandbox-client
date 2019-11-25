// this theme follows the System UI Theme Specification
// Ref: https://system-ui.com/theme

import { colors } from './colors';

export const theme = {
  colors,
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32],
  fontSizes: [
    0,
    9, // not used yet.
    11,
    13,
    16,
  ],
  fonts: {
    body: 'Inter, sans-serif',
    code: 'Source Code Pro, monospace',
  },
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
  speeds: [0, '75ms', '100ms', '150ms', '200ms', '300ms', '500ms'],

  shadows: {
    // this part is ugly, this can be improved.
    // bonus: these are terrible names
    active: `inset 0px -2px 0px ${colors.blues[300]}`,
    underline: `inset 0px -2px 0px ${colors.grays[100] + '1a'}`,
    fadeunder: `inset 0px 8px 8px 0px ${colors.grays[700] + 'cc'}`,
  },

  radii: {
    small: 2,
    medium: 4,
    large: 16,
    round: '50%',
  },
};
