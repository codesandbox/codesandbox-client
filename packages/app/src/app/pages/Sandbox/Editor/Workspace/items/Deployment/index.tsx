import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import Button from 'app/components/Button';

import ZeitIntegration from '../../../../../common/ZeitIntegration';
import { Description, WorkspaceInputContainer } from '../../elements';

type Props = WithCerebral;

const Deployment: React.SFC<Props> = ({ signals, store }) => (
    <div>
        <Description>
            You can deploy a production version of your sandbox using{' '}
            <a href="https:zeit.co/now" target="_blank" rel="noreferrer noopener">
                ZEIT Now
            </a>.
            {!store.user.integrations.zeit && ' You need to add ZEIT to your integrations to deploy.'}
        </Description>

        {store.user.integrations.zeit ? (
            <WorkspaceInputContainer style={{ marginTop: '1rem' }}>
                <Button block onClick={() => signals.deployment.deploySandboxClicked()}>
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

export default connect<Props>()(Deployment);
