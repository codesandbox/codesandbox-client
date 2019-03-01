'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
exports.default = ({ width = 35, height = 35, className }) =>
  React.createElement(
    'svg',
    {
      className: className,
      width: `${width}px`,
      height: `${height}px`,
      viewBox: '0 0 256 221',
    },
    React.createElement(
      'g',
      null,
      React.createElement('path', {
        d:
          'M204.8,0 L256,0 L128,220.8 L0,0 L50.56,0 L97.92,0 L128,51.2 L157.44,0 L204.8,0 Z',
        fill: '#41B883',
      }),
      React.createElement('path', {
        d: 'M0,0 L128,220.8 L256,0 L204.8,0 L128,132.48 L50.56,0 L0,0 Z',
        fill: '#41B883',
      }),
      React.createElement('path', {
        d:
          'M50.56,0 L128,133.12 L204.8,0 L157.44,0 L128,51.2 L97.92,0 L50.56,0 Z',
        fill: '#35495E',
      })
    )
  );
