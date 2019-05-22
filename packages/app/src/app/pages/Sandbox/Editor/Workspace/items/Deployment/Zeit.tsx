import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import TrashIcon from 'react-icons/lib/fa/trash';
import LinkIcon from 'react-icons/lib/fa/external-link';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import NowLogo from 'app/components/NowLogo';
import DeploymentIntegration from 'app/components/DeploymentIntegration';
import { useSignals, useStore } from 'app/store';
import ZeitIntegration from 'app/pages/common/ZeitIntegration';
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
} from './elements';

export const Zeit = observer(() => {
  const {
    deployment: {
      deploySandboxClicked,
      setDeploymentToDelete,
      aliasDeployment,
    },
    modalOpened,
  } = useSignals();
  const { user, deployment } = useStore();
  const [isVisible, setVisibility] = useState(false);

  return user.integrations.zeit ? (
    <Wrapper loading={deployment.deploying}>
      <WorkspaceInputContainer style={{ marginTop: '1rem', marginBottom: 0 }}>
        <DeploymentIntegration
          open={isVisible}
          toggle={() => setVisibility(!isVisible)}
          color="#000000"
          Icon={NowLogo}
          name="Now"
          deploy={() => deploySandboxClicked()}
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
      {deployment.sandboxDeploys.length && isVisible ? (
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
                        setDeploymentToDelete({ id: deploy.uid });
                        modalOpened({ modal: 'deleteDeployment' });
                      }}
                    >
                      {deployment[`${deploy.uid}Deleting`] ? (
                        'Deleting'
                      ) : (
                        <>
                          <TrashIcon /> <span>Delete</span>
                        </>
                      )}
                    </Action>
                    {deployment.hasAlias && deploy.state === 'READY' ? (
                      <Action
                        disabled={deploy.alias.length}
                        onClick={() => aliasDeployment({ id: deploy.uid })}
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
});
