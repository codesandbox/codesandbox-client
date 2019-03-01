'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Fullscreen_1 = require('../flex/Fullscreen');
const Centered_1 = require('../flex/Centered');
const theme_1 = require('../../theme');
const play_svg_1 = require('./play.svg');
const RunOnClick = ({ onClick }) =>
  React.createElement(
    Fullscreen_1.default,
    {
      style: { backgroundColor: theme_1.default.primary(), cursor: 'pointer' },
      onClick: onClick,
    },
    React.createElement(
      Centered_1.default,
      { horizontal: true, vertical: true },
      React.createElement('img', {
        width: 170,
        height: 170,
        src: play_svg_1.default,
        alt: 'Run Sandbox',
      }),
      React.createElement(
        'div',
        {
          style: {
            color: theme_1.default.red(),
            fontSize: '2rem',
            fontWeight: 700,
            marginTop: 24,
            textTransform: 'uppercase',
          },
        },
        'Click to run'
      )
    )
  );
exports.default = RunOnClick;
