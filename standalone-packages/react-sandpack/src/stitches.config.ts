import { createStyled } from '@stitches/react';

export const { styled, css } = createStyled({
  prefix: 'sandpack',
  tokens: {
    colors: {
      $neutral100: '#5B6776', // primary text
      $neutral500: '#999999', // secondary text
      $neutral800: '#E5E7EB', // separators
      $neutral900: '#f8f9fb', // panels
      $neutral1000: '#ffffff', // background
      $accent500: '#6caedd', // highlight
    },
    space: {
      $1: '4px',
      $2: '8px',
      $3: '12px',
      $4: '16px',
      $5: '20px',
      $6: '24px',
    },
    fontSizes: {
      $1: '13px',
      $2: '14px',
      $3: '16px',
    },
    fonts: {
      $body:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
      $mono:
        '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace;',
    },
    radii: {
      $default: '4px',
    },
  },
  breakpoints: {},
  utils: {},
});

export const csbLightTheme = css.theme({
  colors: {
    $neutral100: '#5B6776',
    $neutral500: '#999999',
    $neutral800: '#E5E7EB',
    $neutral900: '#f8f9fb',
    $neutral1000: '#ffffff',
    $accent500: '#6caedd',
  },
});

export const csbDarkTheme = css.theme({
  colors: {
    $neutral100: '#FFFFFF',
    $neutral500: '#999999',
    $neutral800: '#343434',
    $neutral900: '#040404',
    $neutral1000: '#242424',
    $accent500: '#6caedd',
  },
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
