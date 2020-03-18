import React from 'react';
import { Text, Element } from '@codesandbox/components';
import { Rule, SubContainer } from '../elements';
import { NewSidebar } from './NewSidebar';
import { Comments } from './Comments';
import { ContainerLSP } from './ContainerLSP';

export const Experiments: React.FunctionComponent = () => (
  <>
    <Text size={4} marginBottom={6} block variant="muted" weight="bold">
      Experiments
    </Text>
    <SubContainer>
      <Element paddingTop={2}>
        {process.env.NODE_ENV === 'development' && (
          <>
            <Comments /> <Rule />
          </>
        )}
        <NewSidebar />
        <Rule />
        <ContainerLSP />
      </Element>
    </SubContainer>
  </>
);
