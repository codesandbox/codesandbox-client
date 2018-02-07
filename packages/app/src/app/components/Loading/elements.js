import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  0%, 10% { transform: rotateZ(0deg); }
  90%, 100% { transform: rotateZ(360deg); }
`;

export const LogoContainer = styled.div`
  animation-name: ${animation};
  animation-duration: 800ms;
`;
