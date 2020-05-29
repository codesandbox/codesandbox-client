import { Element, Text } from '@codesandbox/components';
import React from 'react';

import { SubContainer } from '../../elements';
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
