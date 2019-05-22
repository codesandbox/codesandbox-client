import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import LinkIcon from 'react-icons/lib/fa/external-link';
import Cogs from 'react-icons/lib/fa/cogs';
import LightningIcon from 'react-icons/lib/md/flash-on';
import getTemplate from '@codesandbox/common/lib/templates';
import { Button } from '@codesandbox/common/lib/components/Button';
import { resolveDirectory } from '@codesandbox/common/lib/sandbox/modules';
import NetlifyLogo from 'app/components/NetlifyLogo';
import DeploymentIntegration from 'app/components/DeploymentIntegration';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';
import { useSignals, useStore } from 'app/store';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../../elements';
import {
  Deploys,
  Deploy,
  Name,
  Link,
  DeploysWrapper,
  Wrapper,
  ButtonContainer,
} from './elements';

const getFunctionDir = sandbox => {
  try {
    return resolveDirectory(
      getNetlifyConfig(sandbox).functions,
      sandbox.modules,
      sandbox.directories
    );
  } catch (e) {
    return [];
  }
};

export const Netlify = observer(() => {
  const {
    deployment: { getNetlifyDeploys, deployWithNetlify },
    modalOpened,
  } = useSignals();
  const { deployment, editor } = useStore();
  const [isVisible, setVisibility] = useState(false);

  useEffect(() => getNetlifyDeploys(), []); // eslint-disable-line

  const template = getTemplate(editor.currentSandbox.template);
  const functionDirectory = getFunctionDir(editor.currentSandbox);

  const functions = editor.currentSandbox.modules.filter(
    m => m.directoryShortid === functionDirectory.shortid
  );

  return (
    template.netlify !== false && (
      <Wrapper loading={deployment.deploying}>
        <WorkspaceInputContainer style={{ marginTop: '1rem', marginBottom: 0 }}>
          <DeploymentIntegration
            loading={deployment.deploying || deployment.building}
            open={isVisible}
            toggle={() => setVisibility(!isVisible)}
            color="#fff"
            light
            Icon={NetlifyLogo}
            name="netlify"
            beta
            deploy={() => deployWithNetlify()}
          >
            Deploy your sandbox site on{' '}
            <a
              href="https://netlify.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              Netlify
            </a>
          </DeploymentIntegration>
        </WorkspaceInputContainer>
        {deployment.netlifySite && isVisible ? (
          <DeploysWrapper
            css={`
              background: #fff;
              margin-top: -4px;
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
                            disabled={deployment.building}
                            href={`${
                              deployment.netlifySite.url
                            }/.netlify/functions/${file.title.split('.js')[0]}`}
                            css={`
                              margin-top: 0;
                              margin-right: 0.5rem;
                            `}
                            target="_blank"
                            rel="noreferrer noopener"
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
                      disabled={deployment.building}
                      href={deployment.netlifySite.url}
                      target="_blank"
                      css={`
                        margin-top: 0;
                      `}
                      rel="noreferrer noopener"
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
                        disabled={deployment.building}
                        href={deployment.netlifyClaimUrl}
                        target="_blank"
                        css={`
                          margin-top: 0;
                        `}
                        rel="noreferrer noopener"
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
                      small
                      onClick={() =>
                        modalOpened({
                          modal: 'netlifyLogs',
                        })
                      }
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
