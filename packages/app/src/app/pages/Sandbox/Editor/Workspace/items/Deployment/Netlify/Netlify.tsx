import { Button } from '@codesandbox/common/lib/components/Button';
import { resolveDirectory } from '@codesandbox/common/lib/sandbox/modules';
import getTemplate from '@codesandbox/common/lib/templates';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import Cogs from 'react-icons/lib/fa/cogs';
import LightningIcon from 'react-icons/lib/md/flash-on';

import { useSignals, useStore } from 'app/store';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';

import { WorkspaceInputContainer, WorkspaceSubtitle } from '../../../elements';

import {
  Deploys,
  Deploy,
  Name,
  Link,
  DeploysWrapper,
  Wrapper,
  ButtonContainer,
} from '../elements';

import { DeployButton } from './DeployButton';

const getFunctionDir = sandbox => {
  try {
    return resolveDirectory(
      getNetlifyConfig(sandbox).functions,
      sandbox.modules,
      sandbox.directories
    );
  } catch {
    return null;
  }
};

export const Netlify = observer(() => {
  const {
    deployment: { getNetlifyDeploys },
    modalOpened,
  } = useSignals();
  const { deployment, editor } = useStore();

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    getNetlifyDeploys();
  }, [getNetlifyDeploys]);

  const template = getTemplate(editor.currentSandbox.template);
  const functionDirectory = getFunctionDir(editor.currentSandbox);

  const functions = editor.currentSandbox.modules.filter(
    m => m.directoryShortid === functionDirectory.shortid
  );

  return (
    template.netlify !== false && (
      <Wrapper loading={deployment.deploying}>
        <DeployButton
          isOpen={isVisible}
          toggle={() => setVisible(show => !show)}
        />

        {deployment.netlifySite && isVisible ? (
          <DeploysWrapper
            css={`
              background: #ffffff;
            `}
          >
            <WorkspaceSubtitle>Sandbox Site</WorkspaceSubtitle>

            <WorkspaceInputContainer>
              <Deploys>
                <Deploy key={deployment.netlifySite.uid}>
                  <Name light>{deployment.netlifySite.name}</Name>

                  {!deployment.building && <div>Building</div>}

                  {functions.length ? (
                    <>
                      <WorkspaceSubtitle
                        css={`
                          padding-left: 0;
                        `}
                      >
                        Functions
                      </WorkspaceSubtitle>

                      <section
                        css={`
                          display: flex;
                          margin-bottom: 0.5rem;
                        `}
                      >
                        {functions.map(file => (
                          <Link
                            css={`
                              margin-top: 0;
                              margin-right: 0.5rem;
                            `}
                            disabled={deployment.building}
                            href={`${
                              deployment.netlifySite.url
                            }/.netlify/functions/${file.title.split('.js')[0]}`}
                            rel="noreferrer noopener"
                            target="_blank"
                          >
                            <LightningIcon />

                            <span>{file.title.split('.js')[0]}</span>
                          </Link>
                        ))}
                      </section>
                    </>
                  ) : null}

                  <WorkspaceSubtitle
                    css={`
                      padding-left: 0;
                    `}
                  >
                    Actions
                  </WorkspaceSubtitle>

                  <ButtonContainer>
                    <Link
                      css={`
                        margin-top: 0;
                      `}
                      disabled={deployment.building}
                      href={deployment.netlifySite.url}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {deployment.building ? (
                        <>
                          <Cogs /> Building...
                        </>
                      ) : (
                        <>
                          <LinkIcon /> Visit
                        </>
                      )}
                    </Link>

                    {deployment.netlifyClaimUrl ? (
                      <Link
                        css={`
                          margin-top: 0;
                        `}
                        disabled={deployment.building}
                        href={deployment.netlifyClaimUrl}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        <span>Claim Site</span>
                      </Link>
                    ) : null}
                  </ButtonContainer>

                  {deployment.netlifyLogs ? (
                    <Button
                      css={`
                        margin-top: 20px;
                      `}
                      onClick={() => modalOpened({ modal: 'netlifyLogs' })}
                      small
                    >
                      <span>View Logs</span>
                    </Button>
                  ) : null}
                </Deploy>
              </Deploys>
            </WorkspaceInputContainer>
          </DeploysWrapper>
        ) : null}
      </Wrapper>
    )
  );
});
