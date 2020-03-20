import styled, { css, keyframes } from 'styled-components';
import LocalLogo from 'react-icons/lib/md/laptop';
import delayInEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
import { OpaqueLogo } from 'app/components/OpaqueLogo';
import { Cube } from '../Cube';

export const UploadAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  ${delayInEffect(0, false)}
`;

export const StyledLocalLogo = styled(LocalLogo)`
  position: absolute;
  z-index: 20;
  font-size: 4rem;
  transform: translateY(15px) translateX(-100px);
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

export const StyledCube = styled(Cube)<{ delay: number }>`
  ${({ delay }) => css`
    position: absolute;
    animation: ${cubeAnimation} 2s ease-in infinite;
    animation-delay: ${delay * 0.5}s;
    transform: translateY(20px) translateX(-100px) scale(0, 0);
  `}
`;

export const StyledLogo = styled(OpaqueLogo)`
  position: absolute;
  z-index: 10;
  transform: translateY(10px) translateX(80px);
`;
