import { createStyled } from '@stitches/react';

export const { styled, css } = createStyled({
  prefix: 'sandpack',
  tokens: {
    colors: {
      $highlightText: '#5B6776',
      $defaultText: '#999999',
      $inactive: '#E5E7EB',
      $mainBackground: '#f8f9fb',
      $inputBackground: '#ffffff',
      $accent: '#6caedd',
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
      $default: '14px',
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
    $highlightText: '#5B6776',
    $defaultText: '#999999',
    $inactive: '#E5E7EB',
    $mainBackground: '#f8f9fb',
    $inputBackground: '#ffffff',
    $accent: '#6caedd',
  },
});

export const csbDarkTheme = css.theme({
  colors: {
    $highlightText: '#FFFFFF',
    $defaultText: '#999999',
    $inactive: '#343434',
    $mainBackground: '#040404',
    $inputBackground: '#242424',
    $accent: '#6caedd',
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
