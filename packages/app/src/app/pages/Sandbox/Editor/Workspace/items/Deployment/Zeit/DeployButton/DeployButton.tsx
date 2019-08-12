import { observer } from 'mobx-react-lite';
import React from 'react';

import { DeploymentIntegration } from 'app/components/DeploymentIntegration';
import NowLogo from 'app/components/NowLogo';
import { useSignals } from 'app/store';

import { DeployButtonContainer } from '../../elements';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export const DeployButton = observer<Props>(({ isOpen, toggle }) => {
  const {
    deployment: { deploySandboxClicked },
  } = useSignals();

  return (
    <DeployButtonContainer>
      <DeploymentIntegration
        color="#000000"
        deploy={deploySandboxClicked}
        Icon={NowLogo}
        name="Now"
        open={isOpen}
        toggle={toggle}
      >
        Deploy your sandbox on{' '}
        <a href="https://zeit.co/now" rel="noreferrer noopener" target="_blank">
          <span>ZEIT Now</span>
        </a>
      </DeploymentIntegration>
    </DeployButtonContainer>
  );
});
