import { createStyled } from '@stitches/react';

export const { styled, css } = createStyled({
  prefix: 'sandpack',
  tokens: {},
  breakpoints: {},
  utils: {},
});

css.global({
  '.sandpack': {
    fontFamily: 'Helvetica, sans-serif',

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
