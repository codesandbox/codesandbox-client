import { keyframes, css } from 'styled-components';

const animation = keyframes`
  0%   { opacity: 1; transform: translateY(10px); }
  100% { opacity: 0; transform: translateY(0px); }
`;

const reverseAnimation = keyframes`
  0%   { opacity: 1; transform: translateY(0px); }
  100% { opacity: 0; transform: translateY(10px); }
`;

export default (delay: number = 0, reverse: boolean = true) =>
  css`
    animation: ${reverse ? reverseAnimation : animation} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 1;
  `;
