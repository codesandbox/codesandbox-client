import React, { FunctionComponent, ReactNode } from 'react';

import {
  Container,
  Cube,
  DeployAnimationContainer,
  DeployText,
  GitHubLogo,
  OpaqueLogo,
  Result,
} from './elements';

type Props = {
  message: string;
  result: ReactNode;
};
export const GitProgress: FunctionComponent<Props> = ({ message, result }) => (
  <Container>
    {result ? (
      <Result>{result}</Result>
    ) : (
      <>
        <DeployAnimationContainer deploying>
          <OpaqueLogo height={70} width={70} />

          {[0, 1, 2, 3].map(i => (
            <Cube delay={i} key={i} size={20} />
          ))}

          <GitHubLogo />
        </DeployAnimationContainer>

        <DeployText>{message}</DeployText>
      </>
    )}
  </Container>
);
