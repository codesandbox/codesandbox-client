import React, { FunctionComponent, ReactNode } from 'react';
import { Element, Text } from '@codesandbox/components';
import {
  Cube,
  DeployAnimationContainer,
  GitHubLogo,
  OpaqueLogo,
} from './elements';

type Props = {
  message: string;
  result: ReactNode;
};
export const GitProgress: FunctionComponent<Props> = ({ message, result }) => (
  <Element padding={4} paddingTop={6}>
    {result ? (
      <Text marginBottom={4} size={3} block>
        {result}
      </Text>
    ) : (
      <>
        <DeployAnimationContainer deploying>
          <OpaqueLogo height={70} width={70} />

          {[0, 1, 2, 3].map(i => (
            <Cube delay={i} key={i} size={20} />
          ))}

          <GitHubLogo />
        </DeployAnimationContainer>
        <Text align="center" weight="bold" block size={4} marginTop={4}>
          {message}
        </Text>
      </>
    )}
  </Element>
);
