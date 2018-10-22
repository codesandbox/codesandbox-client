import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import TrashIcon from 'react-icons/lib/fa/trash';
import Button from 'app/components/Button';

import ZeitIntegration from '../../../../../common/ZeitIntegration';
import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';
import {
  Deploys,
  Deploy,
  State,
  Name,
  Link,
  Action,
  ButtonContainer,
} from './Elements';

class Deployment extends Component {
  componentDidMount = () => {
    this.props.signals.deployment.getDeploys();
  };

  render() {
    const {
      signals,
      store: { user, deployment },
    } = this.props;
    return (
      <div>
        <Description>
          You can deploy a production version of your sandbox using{' '}
          <a
            href="https://zeit.co/now"
            target="_blank"
            rel="noreferrer noopener"
          >
            ZEIT Now
          </a>.
          {!user.integrations.zeit &&
            ' You need to add ZEIT to your integrations to deploy.'}
        </Description>

        {user.integrations.zeit ? (
          <Fragment>
            <WorkspaceInputContainer style={{ marginTop: '1rem' }}>
              <Button
                block
                onClick={() => signals.deployment.deploySandboxClicked()}
              >
                Deploy Sandbox
              </Button>
            </WorkspaceInputContainer>
            <WorkspaceSubtitle style={{ margin: '1rem 0' }}>
              Sandbox Deploys
            </WorkspaceSubtitle>
            <WorkspaceInputContainer>
              <Deploys>
                {deployment.gettingDeploys && !deployment.sandboxDeploys.length
                  ? 'Getting your deploys'
                  : null}
                {deployment.sandboxDeploys.reverse().map(deploy => (
                  <Deploy key={deploy.uid}>
                    <Name>{deploy.name}</Name>
                    <State state={deploy.state}>
                      {deploy.state.toLowerCase()}
                    </State>
                    {deploy.alias.length ? (
                      <span>
                        Aliased to{' '}
                        {deploy.alias.map(a => (
                          <a
                            href={`https://${a.alias}`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {a.alias}
                          </a>
                        ))}
                      </span>
                    ) : null}
                    <ButtonContainer>
                      <Link
                        href={`https://${deploy.url}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Go to Deploy
                      </Link>
                      <Action
                        disabled={deployment[`${deploy.uid}Deleting`]}
                        onClick={() => {
                          signals.deployment.setDeploymentToDelete({
                            id: deploy.uid,
                          });
                          signals.modalOpened({
                            modal: 'deleteDeployment',
                          });
                        }}
                      >
                        {deployment[`${deploy.uid}Deleting`] ? (
                          'Deleting'
                        ) : (
                          <Fragment>
                            <TrashIcon />
                          </Fragment>
                        )}
                      </Action>
                      {deployment.hasAlias && deploy.state === 'READY' ? (
                        <Action
                          disabled={deploy.alias.length}
                          onClick={() => {
                            signals.deployment.aliasDeployment({
                              id: deploy.uid,
                            });
                          }}
                        >
                          {deploy.alias.length ? 'Aliased' : 'Alias'}
                        </Action>
                      ) : null}
                    </ButtonContainer>
                  </Deploy>
                ))}
              </Deploys>
            </WorkspaceInputContainer>
          </Fragment>
        ) : (
          <div style={{ margin: '1rem' }}>
            <ZeitIntegration small />
          </div>
        )}
      </div>
    );
  }
}

export default inject('signals', 'store')(observer(Deployment));
