import { observer } from 'mobx-react-lite';
import React from 'react';

import { DeploymentIntegration } from 'app/components/DeploymentIntegration';
import NetlifyLogo from 'app/components/NetlifyLogo';
import { useSignals, useStore } from 'app/store';

import { DeployButtonContainer } from '../../elements';

export const DeployButton = observer(({ isOpen, toggle }) => {
  const {
    deployment: { deployWithNetlify },
  } = useSignals();
  const {
    deployment: { building, deploying },
  } = useStore();

  return (
    <DeployButtonContainer>
      <DeploymentIntegration
        beta
        color="#FFFFFF"
        deploy={deployWithNetlify}
        Icon={NetlifyLogo}
        light
        loading={deploying || building}
        name="netlify"
        open={isOpen}
        toggle={toggle}
      >
        Deploy your sandbox site on{' '}
        <a href="https://netlify.com" rel="noreferrer noopener" target="_blank">
          <span>Netlify</span>
        </a>
      </DeploymentIntegration>
    </DeployButtonContainer>
  );
});
