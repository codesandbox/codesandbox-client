import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import React from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import TrashIcon from 'react-icons/lib/fa/trash';

import { useSignals, useStore } from 'app/store';

import {
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../../../elements';

import {
  Action,
  ButtonContainer,
  Deploy,
  Deploys as DeploysWrapper,
  DeploysContainer,
  Link,
  Name,
  State,
} from '../../elements';

export const Deploys = () => {
  const {
    deployment: { aliasDeployment, setDeploymentToDelete },
    modalOpened,
  } = useSignals();
  const {
    deployment: { hasAlias, sandboxDeploys, ...deployment },
  } = useStore();

  return (
    <DeploysContainer>
      <WorkspaceSubtitle>Sandbox Deploys</WorkspaceSubtitle>

      <WorkspaceInputContainer>
        <DeploysWrapper>
          {sandboxDeploys.map(deploy => (
            <Deploy key={deploy.uid}>
              <Name>
                {deploy.name}

                <span>{`(${distanceInWordsToNow(deploy.created)} ago)`}</span>
              </Name>

              <State state={deploy.state}>{deploy.state.toLowerCase()}</State>

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

                {hasAlias && deploy.state === 'READY' ? (
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
        </DeploysWrapper>
      </WorkspaceInputContainer>
    </DeploysContainer>
  );
};
