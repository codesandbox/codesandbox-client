import * as React from 'react';
import { connect } from 'app/fluent';
import Button from 'app/components/Button';

import ZeitIntegration from '../../../../../common/ZeitIntegration';
import { Description, WorkspaceInputContainer } from '../../elements';

export default connect()
  .with(({ state, signals }) => ({
    zeit: state.user.integrations.zeit,
    deploySandboxClicked: signals.deployment.deploySandboxClicked
  }))
  .to(
    function Deployment ({ zeit, deploySandboxClicked }) {
      return (
        <div>
          <Description>
            You can deploy a production version of your sandbox using{' '}
            <a href="https:zeit.co/now" target="_blank" rel="noreferrer noopener">
              ZEIT Now
            </a>.
            {!zeit &&
              ' You need to add ZEIT to your integrations to deploy.'}
          </Description>

          {zeit ? (
            <WorkspaceInputContainer style={{ marginTop: '1rem' }}>
              <Button block onClick={() => deploySandboxClicked()}>
                Deploy Sandbox
              </Button>
            </WorkspaceInputContainer>
          ) : (
            <div style={{ margin: '1rem' }}>
              <ZeitIntegration small />
            </div>
          )}
        </div>
      );
    }
  )
