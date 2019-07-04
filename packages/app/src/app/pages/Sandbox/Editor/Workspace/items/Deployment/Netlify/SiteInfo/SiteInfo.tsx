import { Button } from '@codesandbox/common/lib/components/Button';
import { resolveDirectory } from '@codesandbox/common/lib/sandbox/modules';
import React from 'react';
import LinkIcon from 'react-icons/lib/fa/external-link';
import Cogs from 'react-icons/lib/fa/cogs';
import LightningIcon from 'react-icons/lib/md/flash-on';

import { useSignals, useStore } from 'app/store';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';

import {
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../../../elements';

import { Deploys, Deploy, Name, Link, ButtonContainer } from '../../elements';

import { SiteInfoWrapper, SubTitle } from './elements';

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

export const SiteInfo = () => {
  const { modalOpened } = useSignals();
  const {
    deployment: { building, netlifyClaimUrl, netlifyLogs, netlifySite },
    editor,
  } = useStore();

  const functionDirectory = getFunctionDir(editor.currentSandbox);
  const functions = editor.currentSandbox.modules.filter(
    m => m.directoryShortid === functionDirectory.shortid
  );

  return (
    <SiteInfoWrapper>
      <WorkspaceSubtitle>Sandbox Site</WorkspaceSubtitle>

      <WorkspaceInputContainer>
        <Deploys>
          <Deploy key={netlifySite.uid}>
            <Name light>{netlifySite.name}</Name>

            {!building && <div>Building</div>}

            {functions.length ? (
              <>
                <SubTitle>Functions</SubTitle>

                <section
                  css={`
                    display: flex;
                    margin-bottom: 0.5rem;
                  `}
                >
                  {functions.map(file => (
                    <Link
                      css={`
                        margin-right: 0.5rem;
                      `}
                      disabled={building}
                      href={`${netlifySite.url}/.netlify/functions/${
                        file.title.split('.js')[0]
                      }`}
                    >
                      <LightningIcon />

                      <span>{file.title.split('.js')[0]}</span>
                    </Link>
                  ))}
                </section>
              </>
            ) : null}

            <>
              <SubTitle>Actions</SubTitle>

              <ButtonContainer>
                <Link disabled={building} href={netlifySite.url}>
                  {building ? (
                    <>
                      <Cogs /> Building...
                    </>
                  ) : (
                    <>
                      <LinkIcon /> Visit
                    </>
                  )}
                </Link>

                {netlifyClaimUrl ? (
                  <Link disabled={building} href={netlifyClaimUrl}>
                    Claim Site
                  </Link>
                ) : null}
              </ButtonContainer>
            </>

            {netlifyLogs ? (
              <Button
                css={`
                  margin-top: 20px;
                `}
                onClick={() => modalOpened({ modal: 'netlifyLogs' })}
                small
              >
                View Logs
              </Button>
            ) : null}
          </Deploy>
        </Deploys>
      </WorkspaceInputContainer>
    </SiteInfoWrapper>
  );
};
