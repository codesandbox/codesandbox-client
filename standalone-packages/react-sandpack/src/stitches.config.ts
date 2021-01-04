import { createStyled } from '@stitches/react';

export const { styled, css } = createStyled({
  prefix: 'sandpack',
  tokens: {
    colors: {
      $neutral0: '#000',
      $neutral100: '#24282a',
      $neutral400: '#909090',
      $neutral500: '#aaaaaa',
      $neutral700: '#dcdddf',
      $neutral800: '#ebecee',
      $neutral900: '#f8f9fb',
      $neutral1000: '#ffffff',
      $accent500: '#6caedd',
    },
    space: {
      $1: '4px',
      $2: '8px',
      $3: '12px',
      $4: '16px',
    },
    fontSizes: {
      $1: '12px',
      $2: '14px',
      $3: '16px',
    },
    fonts: {
      $body: 'Helvetica, sans-serif',
      $editor: 'Menlo, Source Code Pro, monospace',
    },
    radii: {
      $default: '4px',
    },
    transitions: {
      $fade: 'all 0.3s ease',
    },
  },
  breakpoints: {},
  utils: {},
});

css.global({
  '.sandpack': {
    fontFamily: '$body',

    WebkitFontSmoothing: 'auto',
    MozFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'grayscale',
    fontSmoothing: 'auto',
    textRendering: 'optimizeLegibility',
    fontSmooth: 'always',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',

    '*': {
      boxSizing: 'border-box',
    },
  },
});
