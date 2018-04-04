import * as React from 'react';
import { inject, observer } from 'mobx-react';

import VERSION from 'common/version';

import getWorkspaceItems from 'app/store/modules/workspace/items';
import SocialInfo from 'app/components/SocialInfo';

import Input from 'common/components/Input';

import Files from './items/Files';
import ProjectInfo from './items/ProjectInfo';
import GitHub from './items/GitHub';
import Live from './items/Live';
import Deployment from './items/Deployment';
import ConfigurationFiles from './items/ConfigurationFiles';
import NotOwnedSandboxInfo from './items/NotOwnedSandboxInfo';

import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';
import WorkspaceItem from './WorkspaceItem';
// import DowntimeNotice from './DowntimeNotice';

import { Container, ContactContainer, ItemTitle } from './elements';

const idToItem = {
  project: ProjectInfo,
  files: Files,
  github: GitHub,
  deploy: Deployment,
  config: ConfigurationFiles,
  live: Live,
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
      <div style={{ flex: 1 }}>
        <Component />
      </div>
      <WorkspaceItem title="Chat">
        <div
          style={{
            minHeight: 200,
            maxHeight: 400,
            padding: '0 1rem',
            color: 'white',
            fontSize: '.875rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ height: '100%', flex: 1 }}>
            <div
              style={{
                color: 'rgb(230, 103, 103)',
                fontWeight: 600,
                marginBottom: '0.25rem',
              }}
            >
              Ives van Hoorne
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                marginBottom: '.25rem',
              }}
            >
              I think we should make the colors a bit brighter
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                marginBottom: '.25rem',
              }}
            >
              Or at least less bold
            </div>
          </div>
          <Input
            textarea
            placeholder="Send a message..."
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
        </div>
      </WorkspaceItem>
      {!preferences.settings.zenMode && (
        <div>
          {!store.isPatron && !sandbox.owned && <Advertisement />}
          <ContactContainer>
            <SocialInfo style={{ display: 'inline-block' }} />
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                float: 'right',
                fontSize: '.6rem',
                height: 28,
                verticalAlign: 'middle',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.3)',
              }}
              className="codesandbox-version"
            >
              {VERSION}
            </div>
          </ContactContainer>
          {/* <DowntimeNotice /> */}
          <ConnectionNotice />
        </div>
      )}
    </Container>
  );
}

export default inject('signals', 'store')(observer(Workspace));
