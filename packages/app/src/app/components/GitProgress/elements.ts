import styled, { css, keyframes } from 'styled-components';
import delayInEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
import { OpaqueLogo as BaseOpaqueLogo } from 'app/components/OpaqueLogo';
import { GitHubLogo as BaseGitHubLogo } from 'app/components/GitHubLogo';
import { Cube as BaseCube } from '../Cube';

export const Container = styled.div`
  ${({ theme }) => css`
    position: relative;
    padding: 1rem 2rem;
    background-color: ${theme.background};
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.125rem;
    font-weight: 500;
    text-align: center;
  `}
`;

export const DeployAnimationContainer = styled.div<{ deploying: boolean }>`
  ${({ deploying }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    ${deploying && delayInEffect(0, false)};
  `}
`;

export const GitHubLogo = styled(BaseGitHubLogo)`
  position: absolute;
  color: white;
  font-size: 4rem;
  transform: translateY(10px) translateX(80px);
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

export const Cube = styled(BaseCube)<{ delay: number }>`
  ${({ delay }) => css`
    position: absolute;
    animation: ${cubeAnimation} 2s ease-in infinite;
    animation-delay: ${delay * 0.5}s;
    transform: translateY(20px) translateX(-100px) scale(0, 0);
  `}
`;

export const OpaqueLogo = styled(BaseOpaqueLogo)`
  position: absolute;
  z-index: 10;
  transform: translateY(15px) translateX(-100px);
`;

export const DeployText = styled.div`
  ${delayInEffect()};
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 1.125rem;
`;

export const Result = styled.div`
  ${delayInEffect(0.25)};
  margin-bottom: 1rem;
  font-size: 1.125rem;
`;
