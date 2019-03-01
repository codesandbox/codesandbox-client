'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
const Input_1 = require('../Input');
exports.Container = styled_components_1.default.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
exports.StyledInput = styled_components_1.default(Input_1.default)`
  text-align: center;
`;
