import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% { opacity: 0; translate: 20px 0; }
  100% { opacity: 1; translate: 0 0; }
`;

export const AnimatedStep = styled.div`
  animation: ${fadeIn} 0.2s ease-out;
  max-width: 1360px;
  margin: auto;
`;
