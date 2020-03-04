import React from 'react';

import { PreferenceContainer, Rule, SubContainer, Title } from '../elements';
import { NewSidebar } from './NewSidebar';
import { Comments } from './Comments';
import { ContainerLSP } from './ContainerLSP';

export const Experiments: React.FunctionComponent = () => (
  <div>
    <Title>Experiments</Title>
    <SubContainer>
      <PreferenceContainer>
        {process.env.NODE_ENV === 'development' && (
          <>
            <Comments /> <Rule />
          </>
        )}
        <NewSidebar />
        <Rule />
        <ContainerLSP />
      </PreferenceContainer>
    </SubContainer>
  </div>
);
