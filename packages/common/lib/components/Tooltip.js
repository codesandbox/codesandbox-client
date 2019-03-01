'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const styled_components_1 = require('styled-components');
require('react-tippy/dist/tippy.css');
const react_tippy_1 = require('react-tippy');
exports.withTooltip = react_tippy_1.withTooltip;
const theme_1 = require('../theme');
// eslint-disable-next-line
const GlobalStyle = styled_components_1.createGlobalStyle`
  .tippy-popper {
    position: absolute;
  }

  .tippy-popper,
  .tippy-popper * {
    pointer-events: none;
  }

  .tippy-tooltip [x-circle] {
    background-color: rgb(21, 24, 25) !important;
  }

  .tippy-tooltip.update-theme {
    .arrow-regular {
      border-bottom: 7px solid ${theme_1.default.green()} !important;
    }

    background-color: ${theme_1.default.green()};
    border-radius: 2px;
    padding: 0 !important;
  }
`;
exports.default = props =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(GlobalStyle, null),
    React.createElement(react_tippy_1.Tooltip, Object.assign({}, props))
  );
