'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const elements_1 = require('./elements');
function Switch({
  right,
  onClick,
  secondary = false,
  offMode = false,
  small = false,
  className,
  style,
}) {
  return React.createElement(
    elements_1.Container,
    {
      style: style,
      small: small,
      secondary: secondary,
      offMode: offMode,
      onClick: onClick,
      right: right,
      className: className,
    },
    React.createElement(elements_1.Dot, { small: small, right: right })
  );
}
exports.default = Switch;
