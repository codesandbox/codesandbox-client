import {
  COMMENTS,
  REDESIGNED_SIDEBAR,
} from '@codesandbox/common/lib/utils/feature-flags';
import VERSION from '@codesandbox/common/lib/version';
import { ThemeProvider } from '@codesandbox/components';
import { SocialInfo } from 'app/components/SocialInfo';
import { useOvermind } from 'app/overmind';
import getWorkspaceItems, { getDisabledItems } from 'app/overmind/utils/items';
import React from 'react';
import { withTheme } from 'styled-components';

import { Chat } from './Chat';
import { Chat as ChatOld } from './ChatOld';
import { ConnectionNotice } from './ConnectionNotice';
import {
  ContactContainer,
  Container,
  ItemTitle,
  VersionContainer,
} from './elements';
import { ConfigurationFiles } from './items/ConfigurationFiles';
import { Deployment } from './items/Deployment';
import { FilesItem } from './items/Files';
import { GitHub } from './items/GitHub';
import { Live } from './items/Live';
import { More } from './items/More';
import { NotOwnedSandboxInfo } from './items/NotOwnedSandboxInfo';
import { ProjectInfo } from './items/ProjectInfo';
import { Server } from './items/Server';
import { Comments } from './screens/Comments';
import { ConfigurationFiles as ConfigurationFilesNew } from './screens/ConfigurationFiles';
import { Deployment as DeploymentNew } from './screens/Deployment/index';
import { Explorer } from './screens/Explorer';
import { GitHub as GitHubNew } from './screens/GitHub';
import { Live as LiveNew } from './screens/Live';
import { NotOwnedSandboxInfo as NotOwnedSandboxInfoNew } from './screens/NotOwnedSandboxInfo';
import { ProjectInfo as ProjectInfoNew } from './screens/ProjectInfo';
import { Server as ServerNew } from './screens/Server';
import { SSEDownNotice } from './SSEDownNotice';
import { WorkspaceItem } from './WorkspaceItem';

const NEW_SIDEBAR = REDESIGNED_SIDEBAR === 'true';
const WorkspaceWrapper = NEW_SIDEBAR ? ThemeProvider : React.Fragment;

const workspaceTabs = {
  project: NEW_SIDEBAR ? ProjectInfoNew : ProjectInfo,
  'project-summary': NEW_SIDEBAR ? NotOwnedSandboxInfoNew : NotOwnedSandboxInfo,
  github: NEW_SIDEBAR ? GitHubNew : GitHub,
  files: NEW_SIDEBAR ? Explorer : FilesItem,
  deploy: NEW_SIDEBAR ? DeploymentNew : Deployment,
  config: NEW_SIDEBAR ? ConfigurationFilesNew : ConfigurationFiles,
  live: NEW_SIDEBAR ? LiveNew : Live,
  server: NEW_SIDEBAR ? ServerNew : Server,
  more: More,
};

if (COMMENTS && NEW_SIDEBAR) {
  // @ts-ignore
  workspaceTabs.comments = Comments;
}

export const WorkspaceComponent = ({ theme }) => {
  const { state } = useOvermind();
  const {
    live: { isLive, roomInfo },
    preferences: {
      settings: { zenMode },
    },
    workspace: { openedWorkspaceItem: activeTab },
  } = state;

  if (!activeTab) {
    return null;
  }

  const Component = workspaceTabs[activeTab];
  const item =
    getWorkspaceItems(state).find(({ id }) => id === activeTab) ||
    getDisabledItems(state).find(({ id }) => id === activeTab);

  return (
    <Container REDESIGNED_SIDEBAR={NEW_SIDEBAR}>
      {item && !item.hasCustomHeader && !NEW_SIDEBAR && (
        <ItemTitle>{item.name}</ItemTitle>
      )}
      <WorkspaceWrapper theme={theme.vscodeTheme}>
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

          {isLive &&
            roomInfo.chatEnabled &&
            (!NEW_SIDEBAR ? (
              <WorkspaceItem defaultOpen title="Chat">
                <ChatOld />
              </WorkspaceItem>
            ) : (
              <Chat />
            ))}
        </>
      </WorkspaceWrapper>

      {!zenMode && !NEW_SIDEBAR && (
        <>
          <ContactContainer>
            <SocialInfo style={{ display: 'inline-block' }} />

            <VersionContainer className="codesandbox-version">
              {VERSION}
            </VersionContainer>
          </ContactContainer>

          <SSEDownNotice />

          <ConnectionNotice />
        </>
      )}
    </Container>
  );
};

export const Workspace = withTheme(WorkspaceComponent);
