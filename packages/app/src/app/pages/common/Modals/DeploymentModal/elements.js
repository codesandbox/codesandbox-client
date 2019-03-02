import styled, { keyframes } from 'styled-components';
import delayInEffect from 'common/lib/utils/animation/delay-effect';
import delayOutEffect from 'common/lib/utils/animation/delay-out-effect';
import NowLogo from 'app/components/NowLogo';
import OpaqueLogo from 'app/components/OpaqueLogo';
import Cube from './Cube';

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

export const ButtonContainer = styled.div`
  margin: 2rem 4rem;
  margin-bottom: 3rem;
  ${delayInEffect()} ${({ deploying }) =>
    deploying && delayOutEffect(0, false)};
`;

export const DeployAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 16px;
  bottom: 10px;
  right: 0;
  left: 0;

  ${({ deploying }) => deploying && delayInEffect(0, false)};
`;

export const StyledNowLogo = styled(NowLogo)`
  position: absolute;
  font-size: 4rem;
  transform: translateY(10px) translateX(80px);
`;

export const StyledCube = styled(Cube)`
  position: absolute;
  animation: ${cubeAnimation} 2s ease-in infinite;
  animation-delay: ${({ i }) => i * 0.5}s;
  transform: translateY(20px) translateX(-100px) scale(0, 0);
`;

export const StyledLogo = styled(OpaqueLogo)`
  position: absolute;
  transform: translateY(15px) translateX(-100px);
  z-index: 10;
`;

export const DeployText = styled.div`
  ${delayInEffect()};
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
`;

export const DeployedLink = styled.a`
  ${delayInEffect(0.25)};
  font-size: 1.25rem;
`;

export const DeploymentManagementNotice = styled.div`
  ${delayInEffect(0.45)};
  font-size: 0.75rem;
  margin-top: 1rem;
`;
