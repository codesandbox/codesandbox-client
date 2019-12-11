import React, { FunctionComponent, useState } from 'react';

import { useOvermind } from 'app/overmind';
import { ZeitIntegration } from 'app/pages/common/ZeitIntegration';

import { Wrapper } from '../elements';

import { DeployButton } from './DeployButton';
import { Deploys } from './Deploys';
import { NoIntegrationWrapper } from './elements';

export const Zeit: FunctionComponent = () => {
  const {
    state: {
      deployment: { deploying, sandboxDeploys },
      user: { integrations },
    },
  } = useOvermind();
  const [isVisible, setVisible] = useState(false);

  return integrations.zeit ? (
    <Wrapper loading={deploying}>
      <DeployButton
        isOpen={isVisible}
        toggle={() => setVisible(show => !show)}
      />

      {sandboxDeploys.length && isVisible ? <Deploys /> : null}
    </Wrapper>
  ) : (
    <NoIntegrationWrapper>
      <ZeitIntegration small />
    </NoIntegrationWrapper>
  );
};
