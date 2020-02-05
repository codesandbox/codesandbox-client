import React from 'react';

import { Title, SubContainer, PreferenceContainer } from '../elements';
import { NewSidebar } from './NewSidebar';

export const Experiments: React.FunctionComponent = () => (
  <div>
    <Title>Experiments</Title>

    <SubContainer>
      <PreferenceContainer>
        <NewSidebar />
      </PreferenceContainer>
    </SubContainer>
  </div>
);
