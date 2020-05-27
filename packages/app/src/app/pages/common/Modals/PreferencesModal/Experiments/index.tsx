import React from 'react';
import { Text, Element } from '@codesandbox/components';
import { SubContainer } from '../elements';
import { ContainerLSP } from './ContainerLSP';

export const Experiments: React.FunctionComponent = () => (
  <>
    <Text size={4} marginBottom={6} block variant="muted" weight="bold">
      Experiments
    </Text>
    <SubContainer>
      <Element paddingTop={2}>
        <ContainerLSP />
      </Element>
    </SubContainer>
  </>
);
