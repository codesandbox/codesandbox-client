import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import TrashIcon from 'react-icons/lib/fa/trash';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';
import DeploymentIntegration from 'app/components/DeploymentIntegration';
import NowLogo from 'app/components/NowLogo';
import { useSignals, useStore } from 'app/store';

import { WorkspaceInputContainer, WorkspaceSubtitle } from '../../../elements';

import {
  Action,
  ButtonContainer,
  Deploy,
  Deploys,
  DeploysWrapper,
  Link,
  Name,
  State,
  Wrapper,
} from '../elements';

export const Zeit = observer(() => {
  const {
    deployment: {
      aliasDeployment,
      deploySandboxClicked,
      setDeploymentToDelete,
    },
    modalOpened,
  } = useSignals();
  const { deployment, user } = useStore();

  const [isVisible, setVisibility] = useState(false);

  return user.integrations.zeit ? (
    <Wrapper loading={deployment.deploying}>
      <WorkspaceInputContainer style={{ marginTop: '1rem', marginBottom: 0 }}>
        <DeploymentIntegration
          color="#000000"
          deploy={deploySandboxClicked}
          Icon={NowLogo}
          name="Now"
          open={isVisible}
          toggle={() => setVisibility(!isVisible)}
        >
          Deploy your sandbox on{' '}
          <a
            href="https://zeit.co/now"
            rel="noreferrer noopener"
            target="_blank"
          >
            <span>ZEIT Now</span>
          </a>
        </DeploymentIntegration>
      </WorkspaceInputContainer>

      {deployment.sandboxDeploys.length && isVisible ? (
        <DeploysWrapper>
          <WorkspaceSubtitle>Sandbox Deploys</WorkspaceSubtitle>

          <WorkspaceInputContainer>
            <Deploys>
              {deployment.sandboxDeploys.map(deploy => (
                <Deploy key={deploy.uid}>
                  <Name>
                    {deploy.name}

                    <span>{`(${distanceInWordsToNow(
                      deploy.created
                    )} ago)`}</span>
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
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          {a.alias}
                        </a>
                      ))}
                    </span>
                  ) : null}

                  <ButtonContainer>
                    <Link
                      href={`https://${deploy.url}`}
                      rel="noreferrer noopener"
                      target="_blank"
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
