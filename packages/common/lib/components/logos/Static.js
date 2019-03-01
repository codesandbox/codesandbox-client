'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const static_svg_1 = require('./static.svg');
exports.default = props =>
  React.createElement(
    'img',
    Object.assign({ alt: 'static', src: static_svg_1.default }, props)
  );
