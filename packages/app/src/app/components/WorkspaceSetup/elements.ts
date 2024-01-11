import styled, { keyframes, css } from 'styled-components';

export const fadeIn = keyframes`
  0% { opacity: 0; translate: 20px 0; }
  100% { opacity: 1; translate: 0 0; }
`;

export const fadeAnimation = () =>
  css`
    ${fadeIn} 0.2s ease-out;
  `;

export const AnimatedStep = styled.div`
  animation: ${fadeAnimation};
  max-width: 1360px;
  margin: auto;
`;
