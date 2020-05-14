import styled, { keyframes } from 'styled-components';

const loadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingAnimationContainer = styled.div`
  margin: auto;
  border: 8px solid #f3f3f3;
  border-top: 8px solid black;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${loadingAnimation} 2s linear infinite;
`;
