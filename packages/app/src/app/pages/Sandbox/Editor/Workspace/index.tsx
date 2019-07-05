import VERSION from '@codesandbox/common/lib/version';
import { observer } from 'mobx-react-lite';
import React from 'react';
import SocialInfo from 'app/components/SocialInfo';
import { useStore } from 'app/store';
import getWorkspaceItems from 'app/store/modules/workspace/items';
import Files from './items/Files';
import { GitHub } from './items/GitHub';
import Server from './items/Server';
import Live from './items/Live';
import { More } from './items/More';
import Deployment from './items/Deployment';
import ConfigurationFiles from './items/ConfigurationFiles';
import { NotOwnedSandboxInfo } from './items/NotOwnedSandboxInfo';
import { ProjectInfo } from './items/ProjectInfo';
import { Advertisement } from './Advertisement';
import Chat from './Chat';
import { ConnectionNotice } from './ConnectionNotice';
import { SSEDownNotice } from './SSEDownNotice';
import WorkspaceItem from './WorkspaceItem';
import {
  Container,
  ContactContainer,
  ItemTitle,
  VersionContainer,
} from './elements';

const workspaceTabs = {
  project: ProjectInfo,
  'project-summary': NotOwnedSandboxInfo,
  files: Files,
  github: GitHub,
  deploy: Deployment,
  config: ConfigurationFiles,
  live: Live,
  server: Server,
  more: More,
};

const Workspace = () => {
  const store = useStore();
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
  } = store;

  if (!activeTab) {
    return null;
  }

  const Component = workspaceTabs[activeTab];
  const item = getWorkspaceItems(store).find(({ id }) => id === activeTab);

  return (
    <Container>
      {item && !item.hasCustomHeader && <ItemTitle>{item.name}</ItemTitle>}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Component />
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

export default observer(Workspace);
