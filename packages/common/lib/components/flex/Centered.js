'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
exports.default = styled_components_1.default.div`
  position: relative;
  display: flex;
  ${props => props.vertical && 'justify-content: center;'};
  ${props => props.horizontal && 'align-items: center;'};

  flex-direction: column;
  width: 100%;
`;
