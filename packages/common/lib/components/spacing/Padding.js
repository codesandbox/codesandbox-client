'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
const get_spacing_1 = require('./get-spacing');
exports.default = styled_components_1.default.div`
  padding: ${get_spacing_1.default};
  box-sizing: border-box;
`;
