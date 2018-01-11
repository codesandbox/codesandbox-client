import React from 'react';
import { inject, observer } from 'mobx-react';
import Button from 'app/components/Button';

import { Description, WorkspaceInputContainer } from '../../elements';

const Deployment = ({ signals, store }) => (
  <div>
    <Description>
      You can deploy a production version of your sandbox using{' '}
      <a href="https://zeit.co/now" target="_blank" rel="noreferrer noopener">
        ZEIT Now
      </a>.
      {!store.user.integrations.zeit &&
        ' You need to add ZEIT to your integrations to deploy.'}
    </Description>

    {store.user.integrations.zeit ? (
      <div>Hey</div>
    ) : (
      <WorkspaceInputContainer>
        <Button
          onClick={() => signals.workspace.integrationsOpened()}
          small
          block
        >
          Open Integrations
        </Button>
      </WorkspaceInputContainer>
    )}
  </div>
);

export default inject('signals', 'store')(observer(Deployment));
