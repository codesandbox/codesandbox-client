import VERSION from '@codesandbox/common/lib/version';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
//  Fix css prop types in styled-components (see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-463640878)
import {} from 'styled-components/cssprop'; // eslint-disable-line

import SocialInfo from 'app/components/SocialInfo';
import { useStore } from 'app/store';
import getWorkspaceItems from 'app/store/modules/workspace/items';

import Files from './items/Files';
import ProjectInfo from './items/ProjectInfo';
import { GitHub } from './items/GitHub';
import Server from './items/Server';
import Live from './items/Live';
import { More } from './items/More';
import Deployment from './items/Deployment';
import ConfigurationFiles from './items/ConfigurationFiles';
import NotOwnedSandboxInfo from './items/NotOwnedSandboxInfo';

import Advertisement from './Advertisement';
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

const idToItem = {
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
    workspace: { openedWorkspaceItem: currentItem },
  } = store;

  if (!currentItem) {
    return null;
  }

  const Component = idToItem[currentItem];
  const item = getWorkspaceItems(store).find(({ id }) => id === currentItem);

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
        <div>
          {!(isPatron || owned) && <Advertisement />}

          <ContactContainer>
            <SocialInfo style={{ display: 'inline-block' }} />

            <VersionContainer className="codesandbox-version">
              {VERSION}
            </VersionContainer>
          </ContactContainer>

          <SSEDownNotice />

          <ConnectionNotice />
        </div>
      )}
    </Container>
  );
};

export default observer(Workspace);
