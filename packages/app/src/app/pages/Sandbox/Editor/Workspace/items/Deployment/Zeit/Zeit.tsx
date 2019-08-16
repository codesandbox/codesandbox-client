import { inject, hooksObserver } from 'app/componentConnectors';
import React, { useState } from 'react';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';

import { Wrapper } from '../elements';

import { DeployButton } from './DeployButton';
import { Deploys } from './Deploys';
import { NoIntegrationWrapper } from './elements';

export const Zeit = inject('store')(
  hooksObserver(
    ({
      store: {
        deployment: { deploying, sandboxDeploys },
        user: { integrations },
      },
    }) => {
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
    }
  )
);
