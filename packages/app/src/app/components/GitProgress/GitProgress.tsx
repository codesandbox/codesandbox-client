import React from 'react';
import {
  Container,
  Cube,
  DeployAnimationContainer,
  DeployText,
  GitHubLogo,
  OpaqueLogo,
  Result,
} from './elements';

interface IGitProgressProps {
  result: string | null;
  message: string;
}

export const GitProgress: React.FC<IGitProgressProps> = ({
  message,
  result,
}) => (
  <Container>
    {result ? (
      <Result>{result}</Result>
    ) : (
      <>
        <DeployAnimationContainer deploying>
          <OpaqueLogo width={70} height={70} />
          {[0, 1, 2, 3].map(i => (
            <Cube key={i} delay={i} size={20} />
          ))}
          <GitHubLogo />
        </DeployAnimationContainer>
        <DeployText>{message}</DeployText>
      </>
    )}
  </Container>
);
