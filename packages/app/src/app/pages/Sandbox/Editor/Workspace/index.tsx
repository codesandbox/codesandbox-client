import { ThemeProvider } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React from 'react';
import { withTheme } from 'styled-components';

import { Chat } from './Chat';
import { Container } from './elements';
import { Comments } from './screens/Comments';
import { ConfigurationFiles } from './screens/ConfigurationFiles';
import { Deployment } from './screens/Deployment/index';
import { Explorer } from './screens/Explorer';
import { GitHub } from './screens/GitHub';
import { GithubSummary } from './screens/GithubSummary';
import { Live } from './screens/Live';
import { NotOwnedSandboxInfo } from './screens/NotOwnedSandboxInfo';
import { ProjectInfo } from './screens/ProjectInfo';
import { Server } from './screens/Server';
import { SignInBanner } from './SgnInBanner';

const workspaceTabs = {
  project: ProjectInfo,
  'project-summary': NotOwnedSandboxInfo,
  'github-summary': GithubSummary,
  github: GitHub,
  files: Explorer,
  deploy: Deployment,
  config: ConfigurationFiles,
  live: Live,
  server: Server,
  comments: Comments,
};

export const WorkspaceComponent = ({ theme }) => {
  const { state } = useOvermind();
  const {
    live: { isLive, roomInfo },
    workspace: { openedWorkspaceItem: activeTab },
    user,
  } = state;

  if (!activeTab) {
    return null;
  }

  const Component = workspaceTabs[activeTab];
  const showSignInBanner = !user && activeTab === 'project-summary';

  return (
    <Container
      style={{
        // this does exist in webkit
        // @ts-ignore
        overflowY: showSignInBanner ? 'hidden' : 'overlay',
      }}
    >
      <ThemeProvider theme={theme.vscodeTheme}>
        <>
          <div
            style={{
              flex: showSignInBanner ? 1 : null,
              overflowY: 'auto',
              fontFamily: 'Inter, Roboto, sans-serif',
              height: 'calc(100% - 170px)',
            }}
          >
            {state.editor.currentSandbox && <Component />}
          </div>

          {isLive && roomInfo.chatEnabled && <Chat />}
          {showSignInBanner && <SignInBanner theme={theme.vscodeTheme} />}
        </>
      </ThemeProvider>
    </Container>
  );
};

export const Workspace = withTheme(WorkspaceComponent);
