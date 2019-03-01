'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const elements_1 = require('./elements');
function format(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return `${count}`;
}
function Stat({ Icon, text, textOne, count, vertical }) {
  return React.createElement(
    elements_1.CenteredText,
    { text: text, disableCenter: vertical },
    Icon,
    React.createElement(
      'span',
      {
        style: {
          marginLeft: '0.5em',
        },
      },
      format(count),
      ' ',
      text && (count === 1 ? textOne || text : text)
    )
  );
}
exports.default = Stat;
