import React from 'react';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  SubDescription,
} from '../elements';

function Experiments() {
  return (
    <div>
      <Title>Experiments</Title>

      <SubContainer>
        <PreferenceContainer>
          <SubDescription>
            We have no experiments running currently! Tune in later to find some
            new goodies to test.
          </SubDescription>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
}

export default Experiments;
