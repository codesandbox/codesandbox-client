import React from 'react';

import {
  Title,
  SubContainer,
  SubDescription,
  PreferenceContainer,
} from '../elements';

export const Experiments: React.FunctionComponent = () => (
  <div>
    <Title>Experiments</Title>

    <SubContainer>
      <PreferenceContainer>
        <SubDescription>
          There are no experiments running at the moment. Stay tuned for new
          experiments!
        </SubDescription>
      </PreferenceContainer>
    </SubContainer>
  </div>
);
