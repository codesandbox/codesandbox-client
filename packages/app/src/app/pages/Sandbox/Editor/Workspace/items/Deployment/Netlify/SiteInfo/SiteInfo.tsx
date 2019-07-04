import { resolveDirectory } from '@codesandbox/common/lib/sandbox/modules';
import React from 'react';

import { useStore } from 'app/store';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';

import {
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../../../elements';

import { Deploys, Deploy, Name } from '../../elements';

import { Actions } from './Actions';
import { SiteInfoWrapper } from './elements';
import { Functions } from './Functions';
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

            {functions.length ? <Functions functions={functions} /> : null}

            <Actions />

            {netlifyLogs ? <ViewLogsButton /> : null}
          </Deploy>
        </Deploys>
      </WorkspaceInputContainer>
    </SiteInfoWrapper>
  );
};
