'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
const react_input_autosize_1 = require('react-input-autosize');
const Input_1 = require('../Input');
exports.default = styled_components_1.default(react_input_autosize_1.default)`
  input {
    ${Input_1.styles};
  }
`;
