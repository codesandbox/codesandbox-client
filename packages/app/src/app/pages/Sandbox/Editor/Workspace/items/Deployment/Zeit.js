import React, { Fragment, useState } from 'react';
import { observer } from 'mobx-react-lite';
import TrashIcon from 'react-icons/lib/fa/trash';
import LinkIcon from 'react-icons/lib/fa/external-link';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import NowLogo from 'app/components/NowLogo';
import { useStore, useSignals } from 'app/store';
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
  CreateFile,
  Overlay,
} from './Elements';

const ZeitDeployment = () => {
  const signals = useSignals();
  const { user, deployment, editor } = useStore();
  const [show, setShow] = useState(false);
  const nowFile = editor.currentSandbox.modules
    .toJSON()
    .filter(file => file.title === 'now.json');

  const createFile = () => {
    signals.files.moduleCreated({
      title: 'now.json',
      code: JSON.stringify({
        version: 2,
      }),
    });
  };

  return user.integrations.zeit ? (
    <Wrapper loading={deployment.deploying}>
      <WorkspaceInputContainer style={{ marginTop: '1rem', marginBottom: 0 }}>
        <DeploymentIntegration
          open={show}
          toggle={() => setShow(!show)}
          color="#000000"
          Icon={NowLogo}
          name="Now"
          loading={!nowFile.length}
          deploy={() => signals.deployment.deploySandboxClicked()}
        >
          {!nowFile.length && (
            <Overlay>
              It seems you don{"'"}t have{' '}
              <a
                href="https://zeit.co/docs/v2/deployments/configuration"
                target="_blank"
                rel="noreferrer noopener"
              >
                now.json
              </a>{' '}
              file. Please create{' '}
              <CreateFile onClick={createFile}>one</CreateFile> to be able to
              deploy to{' '}
              <a
                href="https://zeit.co/now"
                target="_blank"
                rel="noreferrer noopener"
              >
                <span>ZEIT Now</span>
              </a>
              .
            </Overlay>
          )}
          Deploy your sandbox on{' '}
          <a
            href="https://zeit.co/now"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>ZEIT Now</span>
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
};
export default observer(ZeitDeployment);
