import track from '@codesandbox/common/lib/utils/analytics';
import React, { FunctionComponent } from 'react';

import { DeploymentIntegration } from 'app/components/DeploymentIntegration';
import { NetlifyLogo } from 'app/components/NetlifyLogo';
import { useOvermind } from 'app/overmind';

import { DeployButtonContainer } from '../../elements';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};
export const DeployButton: FunctionComponent<Props> = ({ isOpen, toggle }) => {
  const {
    actions: {
      deployment: { deployWithNetlify },
    },
    state: {
      deployment: { building, deploying },
    },
  } = useOvermind();

  return (
    <DeployButtonContainer>
      <DeploymentIntegration
        beta
        bgColor="#FFFFFF"
        onDeploy={() => {
          track('Deploy Clicked', { provider: 'netlify' });
          deployWithNetlify();
        }}
        Icon={NetlifyLogo}
        light
        loading={deploying || building}
        name="netlify"
        open={isOpen}
        onToggle={toggle}
      >
        Deploy your sandbox site on{' '}
        <a href="https://netlify.com" rel="noreferrer noopener" target="_blank">
          <span>Netlify</span>
        </a>
      </DeploymentIntegration>
    </DeployButtonContainer>
  );
};
