import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import TrashIcon from 'react-icons/lib/fa/trash';

import ZeitIntegration from 'app/pages/common/ZeitIntegration';
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

import { DeployButton } from './DeployButton';

export const Zeit = observer(() => {
  const {
    deployment: { aliasDeployment, setDeploymentToDelete },
    modalOpened,
  } = useSignals();
  const { deployment, user } = useStore();

  const [isVisible, setVisible] = useState(false);

  return user.integrations.zeit ? (
    <Wrapper loading={deployment.deploying}>
      <DeployButton
        isOpen={isVisible}
        toggle={() => setVisible(show => !show)}
      />

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
                    <Link href={`https://${deploy.url}`}>
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
