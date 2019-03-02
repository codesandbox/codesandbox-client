import styled, { keyframes } from 'styled-components';

import delayInEffect from 'common/lib/utils/animation/delay-effect';
import OpaqueLogo from 'app/components/OpaqueLogo';
import LocalLogo from 'react-icons/lib/md/laptop';
import Cube from './Cube';

export const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};

  text-align: center;

  font-size: 1.125rem;
  padding: 1rem 2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

export const DeployAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  ${({ deploying }) => deploying && delayInEffect(0, false)};
`;

export const StyledLocalLogo = styled(LocalLogo)`
  position: absolute;
  font-size: 4rem;
  transform: translateY(15px) translateX(-100px);
  background-color: ${props => props.theme.background};
  color: white;
  z-index: 20;
`;

const cubeAnimation = keyframes`
0% {
  transform: translateY(20px) translateX(-100px) scale(0, 0);
}

20% {
  transform: translateY(20px) translateX(-100px) scale(1, 1);
}

80% {
  transform: translateY(20px) translateX(80px) scale(1, 1);
}

100% {
  transform: translateY(20px) translateX(80px) scale(1, 1);
}
`;

export const StyledCube = styled(Cube)`
  position: absolute;
  animation: ${cubeAnimation} 2s ease-in infinite;
  animation-delay: ${({ i }) => i * 0.5}s;
  transform: translateY(20px) translateX(-100px) scale(0, 0);
`;

export const StyledLogo = styled(OpaqueLogo)`
  position: absolute;
  z-index: 10;
  transform: translateY(10px) translateX(80px);
`;

export const DeployText = styled.div`
  ${delayInEffect()};
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 1.125rem;
`;

export const Result = styled.div`
  ${delayInEffect(0.25)};
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;
