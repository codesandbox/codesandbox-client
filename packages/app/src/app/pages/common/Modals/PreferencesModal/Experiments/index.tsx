import React from 'react';
import { Text, Element } from '@codesandbox/components';
import { Rule, SubContainer } from '../elements';
import { Comments } from './Comments';
import { ContainerLSP } from './ContainerLSP';

const dev = process.env.NODE_ENV === 'development';

export const Experiments: React.FunctionComponent = () => (
  <>
    <Text size={4} marginBottom={6} block variant="muted" weight="bold">
      Experiments
    </Text>
    <SubContainer>
      <Element paddingTop={2}>
        {dev && (
          <>
            <Comments /> <Rule />
          </>
        )}
        <ContainerLSP />
      </Element>
    </SubContainer>
  </>
);
