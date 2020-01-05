import React, { FunctionComponent } from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { useOvermind } from 'app/overmind';
import { ZeitIntegration } from 'app/pages/common/ZeitIntegration';
import { IntegrationModal } from 'app/components/IntegrationModal';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  ButtonContainer,
  DeployAnimationContainer,
  StyledNowLogo,
  StyledCube,
  StyledLogo,
  DeployText,
  DeployedLink,
  DeploymentManagementNotice,
} from './elements';

export const DeploymentModal: FunctionComponent = () => {
  const {
    state: {
      user: {
        integrations: { zeit },
      },
      deployment: { deploying, url },
    },
    actions: {
      deployment: { deployClicked },
    },
  } = useOvermind();

  const zeitSignedIn = !!zeit;

  return (
    <IntegrationModal
      name="ZEIT"
      Integration={ZeitIntegration}
      title="Deployment"
      subtitle={
        <div>
          {' '}
          Deploy a production version of your sandbox using{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://zeit.co/now"
          >
            ZEIT Now
          </a>
        </div>
      }
      signedIn={zeitSignedIn}
    >
      <Centered horizontal>
        {deploying && (
          <Margin top={1}>
            <DeployText>Deploying sandbox...</DeployText>
            <DeployAnimationContainer deploying={deploying}>
              <StyledLogo width={70} height={70} />
              {[0, 1, 2, 3].map(i => (
                <StyledCube key={i} i={i} size={20} />
              ))}
              <StyledNowLogo backgroundColor="#24282A" />
            </DeployAnimationContainer>
          </Margin>
        )}

        {url ? (
          <Margin top={1} bottom={2}>
            <Centered horizontal>
              <DeployText>Deployed!</DeployText>

              <DeployedLink
                href={url}
                rel="nofollow noreferrer"
                target="_blank"
              >
                {url}
              </DeployedLink>

              <DeploymentManagementNotice>
                You can manage your deployments{' '}
                <a
                  href="https://zeit.co/dashboard"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  here
                </a>
                .
              </DeploymentManagementNotice>
            </Centered>
          </Margin>
        ) : (
          <ButtonContainer deploying={deploying}>
            <Button
              onClick={() => {
                track('Deploy Clicked', { provider: 'zeit' });
                deployClicked();
              }}
              disabled={!zeitSignedIn || deploying}
            >
              Deploy Now
            </Button>
          </ButtonContainer>
        )}
      </Centered>
    </IntegrationModal>
  );
};
