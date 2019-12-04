import React, { FunctionComponent } from 'react';

import { DeploymentIntegration } from 'app/components/DeploymentIntegration';
import { NowLogo } from 'app/components/NowLogo';
import { useOvermind } from 'app/overmind';

import { DeployButtonContainer } from '../../elements';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export const DeployButton: FunctionComponent<Props> = ({ isOpen, toggle }) => {
  const {
    actions: {
      deployment: { deploySandboxClicked },
    },
  } = useOvermind();

  return (
    <DeployButtonContainer>
      <DeploymentIntegration
        bgColor="#000000"
        onDeploy={deploySandboxClicked}
        Icon={NowLogo}
        name="Now"
        open={isOpen}
        onToggle={toggle}
      >
        Deploy your sandbox on{' '}
        <a href="https://zeit.co/now" rel="noreferrer noopener" target="_blank">
          <span>ZEIT Now</span>
        </a>
      </DeploymentIntegration>
    </DeployButtonContainer>
  );
};
