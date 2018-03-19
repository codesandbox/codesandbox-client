import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';
import LiveInfo from './LiveInfo';
import LiveButton from './LiveButton';

import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';

const Live = ({ signals, store }) => {
  return (
    <div>
      {store.live.isLive ? (
        <LiveInfo
          setMode={signals.live.onModeChanged}
          isOwner={store.live.isOwner}
          roomInfo={store.live.roomInfo}
          ownerId={store.editor.currentSandbox.author.id}
        />
      ) : (
        <React.Fragment>
          <Description style={{ marginBottom: '1rem' }}>
            Invite others to live edit this sandbox with you. We{"'"}re doing it
            live!
          </Description>

          <WorkspaceSubtitle>Create live room</WorkspaceSubtitle>
          <Description>
            To invite others you need to generate a URL that others can join.
          </Description>
          <WorkspaceInputContainer>
            <LiveButton
              onClick={() => {
                signals.live.createLiveClicked({
                  sandboxId: store.editor.currentId,
                });
              }}
              isLoading={store.live.isLoading}
            />
          </WorkspaceInputContainer>
        </React.Fragment>
      )}
    </div>
  );
};

export default inject('signals', 'store')(observer(Live));
