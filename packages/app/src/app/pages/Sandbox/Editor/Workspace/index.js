import * as React from 'react';
import { inject, observer } from 'mobx-react';

import VERSION from 'common/version';

import getWorkspaceItems from 'app/store/modules/workspace/items';
import SocialInfo from 'app/components/SocialInfo';

import Files from './items/Files';
import ProjectInfo from './items/ProjectInfo';
import GitHub from './items/GitHub';
import Live from './items/Live';
import More from './items/More';
import Deployment from './items/Deployment';
import ConfigurationFiles from './items/ConfigurationFiles';
import NotOwnedSandboxInfo from './items/NotOwnedSandboxInfo';

import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';
import WorkspaceItem from './WorkspaceItem';
import Chat from './Chat';
// import DowntimeNotice from './DowntimeNotice';

import {
  Container,
  ContactContainer,
  ItemTitle,
  VersionContainer,
} from './elements';

const idToItem = {
  project: ProjectInfo,
  files: Files,
  github: GitHub,
  deploy: Deployment,
  config: ConfigurationFiles,
  live: Live,
  more: More,
};

function Workspace({ store }) {
  const sandbox = store.editor.currentSandbox;
  const preferences = store.preferences;

  const currentItem = store.workspace.openedWorkspaceItem;

  if (!currentItem) {
    return null;
  }

  const Component = sandbox.owned ? idToItem[currentItem] : NotOwnedSandboxInfo;

  const item = getWorkspaceItems(store).find(i => i.id === currentItem);
  return (
    <Container>
      {sandbox.owned && <ItemTitle>{item.name}</ItemTitle>}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Component />
      </div>
      {store.live.isLive &&
        store.live.roomInfo.chatEnabled && (
          <WorkspaceItem defaultOpen title="Chat">
            <Chat />
          </WorkspaceItem>
        )}
      {!preferences.settings.zenMode && (
        <div>
          {!store.isPatron && !sandbox.owned && <Advertisement />}
          <ContactContainer>
            <SocialInfo style={{ display: 'inline-block' }} />
            <VersionContainer className="codesandbox-version">
              {VERSION}
            </VersionContainer>
          </ContactContainer>
          {/* <DowntimeNotice /> */}
          <ConnectionNotice />
        </div>
      )}
    </Container>
  );
}

export default inject('signals', 'store')(observer(Workspace));
