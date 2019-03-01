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
      viewBox: '0 0 250 250',
    },
    React.createElement('polygon', {
      className: 'st0',
      fill: '#DD0031',
      points:
        '125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2 \t',
    }),
    React.createElement('polygon', {
      className: 'st1',
      fill: '#C3002F',
      points:
        '125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30 \t',
    }),
    React.createElement('path', {
      className: 'st2',
      fill: '#FFFFFF',
      d:
        'M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z',
    })
  );
