import React from 'react';
import { Text, Element } from '@codesandbox/components';
import { Rule, SubContainer } from '../elements';
import { Comments } from './Comments';
import { ContainerLSP } from './ContainerLSP';

export const Experiments: React.FunctionComponent = () => (
  <>
    <Text size={4} marginBottom={4} block variant="muted" weight="bold">
      Experiments
    </Text>
    <SubContainer>
      <Element paddingTop={2}>
        {process.env.NODE_ENV === 'development' ||
          (process.env.NODE_ENV === 'staging' && (
            <>
              <Comments /> <Rule />
            </>
          ))}
        <ContainerLSP />
      </Element>
    </SubContainer>
  </>
);
