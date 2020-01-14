import VERSION from '@codesandbox/common/lib/version';
import { SocialInfo } from 'app/components/SocialInfo';
import { useOvermind } from 'app/overmind';
import getWorkspaceItems, { getDisabledItems } from 'app/overmind/utils/items';
import React from 'react';
import { REDESIGNED_SIDEBAR } from '@codesandbox/common/lib/utils/feature-flags';
import { makeTheme } from '@codesandbox/components/lib/';
//  Fix css prop types in styled-components (see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-463640878)
import * as CSSProps from 'styled-components/cssprop'; // eslint-disable-line
import { withTheme, ThemeProvider } from 'styled-components';
import { Advertisement } from './Advertisement';
import { Chat } from './Chat';
import { ConnectionNotice } from './ConnectionNotice';
import {
  ContactContainer,
  Container,
  ItemTitle,
  VersionContainer,
} from './elements';
import ConfigurationFiles from './items/ConfigurationFilesOld';
import { ConfigurationFiles as ConfigurationFilesNew } from './items/ConfigurationFiles';
import { Deployment } from './items/Deployment';
import { FilesItem } from './items/Files';
import { GitHub } from './items/GitHub';
import { Live } from './items/Live';
import { More } from './items/More';
import { NotOwnedSandboxInfo } from './items/NotOwnedSandboxInfo';
import { ProjectInfo } from './items/ProjectInfo';
import { Server } from './items/Server';
import { SSEDownNotice } from './SSEDownNotice';
import { WorkspaceItem } from './WorkspaceItem';

const WorkspaceWrapper = REDESIGNED_SIDEBAR ? ThemeProvider : React.Fragment;

const workspaceTabs = {
  project: ProjectInfo,
  'project-summary': NotOwnedSandboxInfo,
  files: FilesItem,
  github: GitHub,
  deploy: Deployment,
  config: REDESIGNED_SIDEBAR ? ConfigurationFilesNew : ConfigurationFiles,
  live: Live,
  server: Server,
  more: More,
};

export const WorkspaceComponent = ({ theme }) => {
  const { state } = useOvermind();
  const {
    editor: {
      currentSandbox: { owned },
    },
    isPatron,
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
    <Container>
      {item && !item.hasCustomHeader && !REDESIGNED_SIDEBAR && (
        <ItemTitle>{item.name}</ItemTitle>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <WorkspaceWrapper theme={makeTheme(theme.vscodeTheme, '')}>
          <Component />
        </WorkspaceWrapper>
      </div>

      {isLive && roomInfo.chatEnabled && (
        <WorkspaceItem defaultOpen title="Chat">
          <Chat />
        </WorkspaceItem>
      )}

      {!zenMode && (
        <>
          {!(isPatron || owned) && <Advertisement />}

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
