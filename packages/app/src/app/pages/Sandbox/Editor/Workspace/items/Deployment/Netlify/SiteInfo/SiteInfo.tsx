import React from 'react';
import { useOvermind } from 'app/overmind';

import getNetlifyConfig from 'app/utils/getNetlifyConfig';

import { resolveDirectory } from '@codesandbox/common/lib/sandbox/modules';
import { Sandbox, Directory, Module } from '@codesandbox/common/lib/types';

import {
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../../../elements';

import { Deploys, Deploy, Name } from '../../elements';

import { Actions } from './Actions';
import { SiteInfoWrapper } from './elements';
import { Functions } from './Functions';
import { ViewLogsButton } from './ViewLogsButton';

const getFunctionDir = (sandbox: Sandbox): Directory | undefined => {
  try {
    return resolveDirectory(
      getNetlifyConfig(sandbox).functions,
      sandbox.modules,
      sandbox.directories
    );
  } catch {
    return undefined;
  }
};

export const SiteInfo: React.FC = () => {
  const {
    state: {
      deployment: {
        building,
        netlifyLogs,
        netlifySite: { id, name },
      },
      editor: { currentSandbox },
    },
  } = useOvermind();

  const functionDirectory: Directory = getFunctionDir(currentSandbox);
  const functions: Module[] = functionDirectory
    ? currentSandbox.modules.filter(
        ({ directoryShortid }) => directoryShortid === functionDirectory.shortid
      )
    : [];

  return (
    <SiteInfoWrapper>
      <WorkspaceSubtitle>Sandbox Site</WorkspaceSubtitle>

      <WorkspaceInputContainer>
        <Deploys>
          <Deploy key={id}>
            <Name light>{name}</Name>

            {!building && <div>Building</div>}

            {functions.length ? <Functions functions={functions} /> : null}

            <Actions />

            {netlifyLogs ? <ViewLogsButton /> : null}
          </Deploy>
        </Deploys>
      </WorkspaceInputContainer>
    </SiteInfoWrapper>
  );
};
