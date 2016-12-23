import { keyframes } from 'styled-components';

const animation = keyframes`
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0px); }
`;

export default delay => (
  `
    animation: ${animation} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 0;
  `
);
