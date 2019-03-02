import React from 'react';
import { inject, observer } from 'mobx-react';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';
import Button from 'app/components/Button';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import IntegrationModal from 'app/components/IntegrationModal';

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

function DeploymentModal({ store, signals }) {
  const { user } = store;

  const zeitSignedIn = user.integrations.zeit;

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
        {store.deployment.deploying && (
          <Margin top={1}>
            <DeployText>Deploying sandbox...</DeployText>
            <DeployAnimationContainer deploying={store.deployment.deploying}>
              <StyledLogo width={70} height={70} />
              {[0, 1, 2, 3].map(i => <StyledCube key={i} i={i} size={20} />)}
              <StyledNowLogo backgroundColor="#24282A" />
            </DeployAnimationContainer>
          </Margin>
        )}

        {store.deployment.url ? (
          <Margin top={1} bottom={2}>
            <Centered horizontal>
              <DeployText>Deployed!</DeployText>

              <DeployedLink
                href={store.deployment.url}
                rel="nofollow noreferrer"
                target="_blank"
              >
                {store.deployment.url}
              </DeployedLink>

              <DeploymentManagementNotice>
                You can manage your deployments{' '}
                <a
                  href="https://zeit.co/dashboard"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  here
                </a>.
              </DeploymentManagementNotice>
            </Centered>
          </Margin>
        ) : (
          <ButtonContainer deploying={store.deployment.deploying}>
            <Button
              onClick={() => signals.deployment.deployClicked()}
              disabled={!zeitSignedIn || store.deployment.deploying}
            >
              Deploy Now
            </Button>
          </ButtonContainer>
        )}
      </Centered>
    </IntegrationModal>
  );
}

export default inject('store', 'signals')(observer(DeploymentModal));
