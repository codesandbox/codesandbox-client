'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const elements_1 = require('./elements');
function Tag({ tag, removeTag }) {
  return React.createElement(
    elements_1.Container,
    { canRemove: !!removeTag },
    tag,
    removeTag &&
      React.createElement(elements_1.DeleteIcon, {
        onClick: () => {
          removeTag({ tag });
        },
      })
  );
}
exports.default = Tag;
