/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* @flow */
const black = '#293238',
  darkGray = '#878e91',
  red = '#ce1126',
  redTransparent = 'rgba(206, 17, 38, 0.05)',
  lightRed = '#fccfcf',
  yellow = '#fbf5b4',
  yellowTransparent = 'rgba(251, 245, 180, 0.3)',
  whiteTranslucent = 'rgba(244, 244, 244, 0.9)';

const iframeStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  border: 'none',
  'z-index': 2147483647 - 1, // below the compile error overlay
};

const overlayStyle = {
  width: '100%',
  height: '100%',
  'box-sizing': 'border-box',
  'text-align': 'center',
  'background-color': whiteTranslucent,
  '-webkit-font-smoothing': 'antialiased',
  '-moz-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',
  'font-smoothing': 'antialiased',
  'text-rendering': 'optimizeLegibility',
  'font-smooth': 'always',
  '-webkit-tap-highlight-color': 'transparent',
  '-webkit-touch-callout': 'none',
};

const containerStyle = {
  position: 'relative',
  display: 'inline-flex',
  'flex-direction': 'column',
  height: '100%',
  width: '1024px',
  'max-width': '100%',
  'overflow-x': 'hidden',
  'overflow-y': 'auto',
  padding: '0.5rem',
  'box-sizing': 'border-box',
  'text-align': 'left',
  'font-family': 'Consolas, Menlo, monospace',
  'font-size': '11px',
  'white-space': 'pre-wrap',
  'word-break': 'break-word',
  'line-height': 1.5,
  color: black,
};

const hintsStyle = {
  color: darkGray,
};

const hintStyle = {
  padding: '0.5em 1em',
  cursor: 'pointer',
};

const closeButtonStyle = {
  color: black,
  'line-height': '1rem',
  'font-size': '1.5rem',
  padding: '1rem',
  cursor: 'pointer',
  position: 'absolute',
  right: 0,
  top: 0,
};

const additionalChildStyle = {
  'margin-bottom': '0.5rem',
};

const headerStyle = {
  'font-size': '2em',
  'font-family': 'Roboto, sans-serif',
  color: red,
  'white-space': 'pre-wrap',
  // Top bottom margin spaces header
  // Right margin revents overlap with close button
  margin: '0 2rem 0.5rem 0',
  flex: '0 0 auto',
  'max-height': '50%',
  overflow: 'auto',
  'font-weight': '400',
};

const messageHeaderStyle = {
  ...headerStyle,
  color: 'black',
  'font-weight': '300',
  'font-size': '1.5em',
  'font-family': 'Consolas, Menlo, monospace',
  margin: 0,
  'padding-bottom': '1rem',
  'border-bottom': '1px solid #ddd',
};

const originalHeaderStyle = {
  color: 'rgba(0, 0, 0, 0.7)',
  'font-size': '.75em',
  'padding-top': '1rem',
  'padding-bottom': '.5rem',
};

const originalMessageHeaderStyle = {
  color: 'black',
  'font-size': '.875em',
  'font-family': 'Consolas, Menlo, monospace',
  margin: 0,
  'white-space': 'pre-wrap',
  overflow: 'auto',
};

const functionNameStyle = {};

const linkStyle = {
  'font-size': '0.9em',
  'margin-bottom': '0.9em',
};

const anchorStyle = {
  'text-decoration': 'none',
  color: darkGray,
};

const traceStyle = {
  'font-size': '1em',
  flex: '0 1 auto',
  'min-height': '0px',
  overflow: 'auto',
  'padding-top': '1rem',
};

const depStyle = {};

const primaryErrorStyle = {
  'background-color': lightRed,
};

const secondaryErrorStyle = {
  'background-color': yellow,
};

const omittedFramesCollapsedStyle = {
  color: black,
  cursor: 'pointer',
  'margin-bottom': '1.5em',
};

const omittedFramesExpandedStyle = {
  color: black,
  cursor: 'pointer',
  'margin-bottom': '0.6em',
};

const _preStyle = {
  display: 'block',
  padding: '0.5em',
  'margin-top': '0.5em',
  'margin-bottom': '0.5em',
  'overflow-x': 'auto',
  'white-space': 'pre-wrap',
  'border-radius': '0.25rem',
};
const primaryPreStyle = Object.assign({}, _preStyle, {
  'background-color': redTransparent,
});
const secondaryPreStyle = Object.assign({}, _preStyle, {
  'background-color': yellowTransparent,
});

const toggleStyle = {
  'margin-bottom': '1.5em',
  color: darkGray,
  cursor: 'pointer',
};

const codeStyle = {
  'font-family': 'Consolas, Menlo, monospace',
};

const hiddenStyle = {
  display: 'none',
};

const groupStyle = {
  'margin-right': '1em',
};

const _groupElemStyle = {
  'background-color': redTransparent,
  color: red,
  border: 'none',
  'border-radius': '4px',
  padding: '3px 6px',
  cursor: 'pointer',
};

const groupElemLeft = Object.assign({}, _groupElemStyle, {
  'border-top-right-radius': '0px',
  'border-bottom-right-radius': '0px',
  'margin-right': '1px',
});

const groupElemRight = Object.assign({}, _groupElemStyle, {
  'border-top-left-radius': '0px',
  'border-bottom-left-radius': '0px',
});

const footerStyle = {
  'font-family': 'sans-serif',
  color: darkGray,
  'margin-top': '0.5rem',
  flex: '0 0 auto',
};

const suggestionsContainerStyle = {
  'font-family': 'Roboto, sans-serif',
  'padding-top': '1rem',
};

const suggestionsTitleStyle = {
  'font-size': '1rem',
  'font-weight': '300',
};

const suggestionsButtonStyle = {
  transition: '0.3s ease all',
  'background-color': '#B6E7FF',
  color: 'rgba(0, 0, 0, 0.6)',
  padding: '0.5rem',
  margin: '.5rem 0',
  'margin-bottom': '.5rem',
  'font-size': '.75rem',
  'border-radius': '4px',
  'margin-right': '.5rem',
  border: '1px solid #6CAEDD',
  cursor: 'pointer',
};

export {
  containerStyle,
  iframeStyle,
  overlayStyle,
  hintsStyle,
  hintStyle,
  closeButtonStyle,
  additionalChildStyle,
  headerStyle,
  messageHeaderStyle,
  functionNameStyle,
  linkStyle,
  anchorStyle,
  traceStyle,
  depStyle,
  primaryErrorStyle,
  primaryPreStyle,
  secondaryErrorStyle,
  secondaryPreStyle,
  omittedFramesCollapsedStyle,
  omittedFramesExpandedStyle,
  originalHeaderStyle,
  originalMessageHeaderStyle,
  toggleStyle,
  codeStyle,
  hiddenStyle,
  groupStyle,
  groupElemLeft,
  groupElemRight,
  footerStyle,
  suggestionsContainerStyle,
  suggestionsTitleStyle,
  suggestionsButtonStyle,
};
