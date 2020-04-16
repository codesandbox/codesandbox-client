import React from 'react';
import { withTheme } from 'styled-components';

import { useOvermind } from 'app/overmind';
import { COMMENTS } from '@codesandbox/common/lib/utils/feature-flags';
import { ThemeProvider } from '@codesandbox/components';

import { Chat } from './Chat';
import { Container } from './elements';

import { ProjectInfo as ProjectInfoNew } from './screens/ProjectInfo';
import { NotOwnedSandboxInfo as NotOwnedSandboxInfoNew } from './screens/NotOwnedSandboxInfo';
import { GitHub as GitHubNew } from './screens/GitHub';
import { Explorer } from './screens/Explorer';
import { Deployment as DeploymentNew } from './screens/Deployment/index';
import { ConfigurationFiles as ConfigurationFilesNew } from './screens/ConfigurationFiles';
import { Live as LiveNew } from './screens/Live';
import { Server as ServerNew } from './screens/Server';
import { Comments } from './screens/Comments';
import { More } from './items/More';

const workspaceTabs = {
  project: ProjectInfoNew,
  'project-summary': NotOwnedSandboxInfoNew,
  github: GitHubNew,
  files: Explorer,
  deploy: DeploymentNew,
  config: ConfigurationFilesNew,
  live: LiveNew,
  server: ServerNew,
  more: More,
};

if (COMMENTS) {
  // @ts-ignore
  workspaceTabs.comments = Comments;
}

export const WorkspaceComponent = ({ theme }) => {
  const { state } = useOvermind();
  const {
    live: { isLive, roomInfo },
    workspace: { openedWorkspaceItem: activeTab },
  } = state;

  if (!activeTab) {
    return null;
  }

  const Component = workspaceTabs[activeTab];

  return (
    <Container>
      <ThemeProvider theme={theme.vscodeTheme}>
        <>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: 'Inter, Roboto, sans-serif',
            }}
          >
            <Component />
          </div>

          {isLive && roomInfo.chatEnabled && <Chat />}
        </>
      </ThemeProvider>
    </Container>
  );
};

export const Workspace = withTheme(WorkspaceComponent);
