'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
exports.default = styled_components_1.default.div`
  display: flex;
  flex-direction: column;

  ${props => props.flex && `flex: ${props.flex}`};

  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
`;
