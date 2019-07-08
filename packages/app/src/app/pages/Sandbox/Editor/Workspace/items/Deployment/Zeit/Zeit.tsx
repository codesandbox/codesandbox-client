import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';
import { useStore } from 'app/store';

import { Wrapper } from '../elements';

import { DeployButton } from './DeployButton';
import { Deploys } from './Deploys';

export const Zeit = observer(() => {
  const {
    deployment: { deploying, sandboxDeploys },
    user: { integrations },
  } = useStore();

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
    <div style={{ margin: '1rem' }}>
      <ZeitIntegration small />
    </div>
  );
});
