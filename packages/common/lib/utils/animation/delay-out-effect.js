'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
const animation = styled_components_1.keyframes`
  0%   { opacity: 1; transform: translateY(10px); }
  100% { opacity: 0; transform: translateY(0px); }
`;
const reverseAnimation = styled_components_1.keyframes`
  0%   { opacity: 1; transform: translateY(0px); }
  100% { opacity: 0; transform: translateY(10px); }
`;
exports.default = (delay = 0, reverse = true) => styled_components_1.css`
    animation: ${reverse ? reverseAnimation : animation} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 1;
  `;
