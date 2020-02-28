import React from 'react';

import { PreferenceContainer, Rule, SubContainer, Title } from '../elements';
import { NewSidebar } from './NewSidebar';
import { ContainerLSP } from './ContainerLSP';

export const Experiments: React.FunctionComponent = () => (
  <div>
    <Title>Experiments</Title>
    <SubContainer>
      <PreferenceContainer>
        <NewSidebar />
        <Rule />
        <ContainerLSP />
      </PreferenceContainer>
    </SubContainer>
  </div>
);
