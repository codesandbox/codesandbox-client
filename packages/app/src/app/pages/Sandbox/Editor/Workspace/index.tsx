import { ThemeProvider } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import React, { useState, useEffect } from 'react';
import { withTheme } from 'styled-components';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';

import { Chat } from './Chat';
import { Container } from './elements';
import { Comments } from './screens/Comments';
import { ConfigurationFiles } from './screens/ConfigurationFiles';
import { Deployment } from './screens/Deployment/index';
import { Explorer } from './screens/Explorer';
import { GitHub } from './screens/GitHub';
import { Live } from './screens/Live';
import { NotOwnedSandboxInfo } from './screens/NotOwnedSandboxInfo';
import { ProjectInfo } from './screens/ProjectInfo';
import { Server } from './screens/Server';
import { Search } from './screens/Search';
import { SignInBanner } from './SignInBanner';

const workspaceTabs = {
  project: ProjectInfo,
  'project-summary': NotOwnedSandboxInfo,
  github: GitHub,
  files: Explorer,
  search: Search,
  deploy: Deployment,
  config: ConfigurationFiles,
  live: Live,
  server: Server,
  comments: Comments,
};

export const WorkspaceComponent = ({ theme }) => {
  const {
    live: { isLive, roomInfo },
    workspace: { openedWorkspaceItem: activeTab },
    user,
    editor,
  } = useAppState();

  /**
   * A/B
   */
  const experimentPromise = useExperimentResult('fixed-signin-banner');
  const [newSignInBanner, setNewSignInBanner] = useState(false);
  useEffect(() => {
    /* Wait for the API */
    experimentPromise.then(experiment => {
      if (experiment === ExperimentValues.A) {
        /**
         * A
         */
        setNewSignInBanner(false);
      } else if (experiment === ExperimentValues.B) {
        /**
         * B
         */
        setNewSignInBanner(true);
      }
    });
  }, [experimentPromise]);

  if (!activeTab) {
    return null;
  }

  const Component = workspaceTabs[activeTab];

  return (
    <Container
      style={{
        // this does exist in webkit
        // @ts-ignore
        overflowY: !user ? 'hidden' : 'overlay',
      }}
    >
      <ThemeProvider theme={theme.vscodeTheme}>
        <>
          <div
            style={{
              flex: !user ? 1 : null,
              overflowY: 'auto',
              fontFamily: 'Inter, Roboto, sans-serif',
              height: user ? '100%' : 'calc(100% - 170px)',
            }}
          >
            {editor.currentSandbox && <Component />}
          </div>

          {isLive && roomInfo.chatEnabled && <Chat />}
          {!user && !newSignInBanner && (
            <SignInBanner theme={theme.vscodeTheme} />
          )}
        </>
      </ThemeProvider>
    </Container>
  );
};

export const Workspace = withTheme(WorkspaceComponent);
