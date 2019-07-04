import { resolveDirectory } from '@codesandbox/common/lib/sandbox/modules';
import React from 'react';
import LightningIcon from 'react-icons/lib/md/flash-on';

import { useStore } from 'app/store';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';

import {
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../../../elements';

import { Deploys, Deploy, Name, Link } from '../../elements';

import { Actions } from './Actions';
import { SiteInfoWrapper, SubTitle } from './elements';
import { ViewLogsButton } from './ViewLogsButton';

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
  const {
    deployment: { building, netlifyLogs, netlifySite },
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

            <Actions />

            {netlifyLogs ? <ViewLogsButton /> : null}
          </Deploy>
        </Deploys>
      </WorkspaceInputContainer>
    </SiteInfoWrapper>
  );
};
