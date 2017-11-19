// @flow

import React from 'react';
import styled, { keyframes } from 'styled-components';

import delayInEffect from 'common/utils/animation/delay-effect';
import OpaqueLogo from 'app/components/OpaqueLogo';

import GitHubLogo from './GitHubLogo';
import Cube from './Cube';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};

  text-align: center;

  font-size: 1.125rem;
  padding: 1rem 2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const DeployAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  ${({ deploying }) => deploying && delayInEffect(0, false)};
`;

const StyledGitHubLogo = styled(GitHubLogo)`
  position: absolute;
  font-size: 4rem;
  transform: translateY(10px) translateX(80px);
  color: white;
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

const StyledCube = styled(Cube)`
  position: absolute;
  animation: ${cubeAnimation} 2s ease-in infinite;
  animation-delay: ${({ i }) => i * 0.5}s;
  transform: translateY(20px) translateX(-100px) scale(0, 0);
`;

const StyledLogo = styled(OpaqueLogo)`
  position: absolute;
  transform: translateY(15px) translateX(-100px);
  z-index: 10;
`;

const DeployText = styled.div`
  ${delayInEffect()};
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 1.125rem;
`;

const Result = styled.div`
  ${delayInEffect(0.25)};
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

type Props = {
  message: string,
  result: React.Element<'div'>,
};

export default ({ message, result }: Props) => (
  <Container>
    {result ? (
      <Result>{result}</Result>
    ) : (
      <div>
        <DeployAnimationContainer deploying>
          <StyledLogo width={70} height={70} />
          {[0, 1, 2, 3].map(i => <StyledCube key={i} i={i} size={20} />)}
          <StyledGitHubLogo />
        </DeployAnimationContainer>
        <DeployText>{message}</DeployText>
      </div>
    )}
  </Container>
);
