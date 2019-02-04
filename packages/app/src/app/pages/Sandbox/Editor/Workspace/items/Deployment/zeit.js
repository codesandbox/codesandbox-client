import React, { Fragment, Component } from 'react';
import { inject, observer } from 'mobx-react';
import TrashIcon from 'react-icons/lib/fa/trash';
import LinkIcon from 'react-icons/lib/fa/external-link';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import NowLogo from 'app/components/NowLogo';
import DeploymentIntegration from 'app/components/DeploymentIntegration';
import ZeitIntegration from '../../../../../common/ZeitIntegration';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../../elements';
import {
  Deploys,
  Wrapper,
  Deploy,
  State,
  Name,
  Link,
  Action,
  ButtonContainer,
  DeploysWrapper,
} from './Elements';

class ZeitDeployment extends Component {
  state = { show: false };

  toggleZeit = () =>
    this.setState(state => ({
      show: !state.show,
    }));

  render() {
    const {
      signals,
      store: { user, deployment },
    } = this.props;

    const { show } = this.state;
    return user.integrations.zeit ? (
      <Wrapper loading={deployment.deploying}>
        <WorkspaceInputContainer style={{ marginTop: '1rem', marginBottom: 0 }}>
          <DeploymentIntegration
            open={show}
            toggle={() => this.toggleZeit()}
            color="#000000"
            Icon={NowLogo}
            name="Now"
            deploy={() => signals.deployment.deploySandboxClicked()}
          >
            Deploy your sandbox on{' '}
            <a
              href="https://zeit.co/now"
              target="_blank"
              rel="noreferrer noopener"
            >
              ZEIT Now
            </a>
          </DeploymentIntegration>
        </WorkspaceInputContainer>
        {deployment.sandboxDeploys.length && show ? (
          <DeploysWrapper
            css={`
              margin-top: -4px;
            `}
          >
            <WorkspaceSubtitle>Sandbox Deploys</WorkspaceSubtitle>
            <WorkspaceInputContainer>
              <Deploys>
                {deployment.sandboxDeploys.map(deploy => (
                  <Deploy key={deploy.uid}>
                    <Name>
                      {deploy.name}
                      <span>({distanceInWordsToNow(deploy.created)} ago)</span>
                    </Name>
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
                        <LinkIcon /> <span>Visit</span>
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
                            <TrashIcon /> <span>Delete</span>
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
          </DeploysWrapper>
        ) : null}
      </Wrapper>
    ) : (
      <div style={{ margin: '1rem' }}>
        <ZeitIntegration small />
      </div>
    );
  }
}
export default inject('signals', 'store')(observer(ZeitDeployment));
