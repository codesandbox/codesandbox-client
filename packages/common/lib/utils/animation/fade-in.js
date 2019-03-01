'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
const animation = styled_components_1.keyframes`
  0%   { opacity: 0; }
  100% { opacity: 1; }
`;
exports.default = delay => styled_components_1.css`
    animation: ${animation} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 0;
  `;
