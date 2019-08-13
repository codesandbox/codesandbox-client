import React from 'react';
import { inject, observer } from 'app/componentConnectors';

import LiveInfo from './LiveInfo';
import LiveButton from './LiveButton';

import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
  ErrorDescription,
} from '../../elements';
import { More } from '../More';

const Live = ({ signals, store }) => {
  const hasUnsyncedModules = !store.editor.isAllModulesSynced;

  const showPlaceHolder =
    (!store.live.isLive && !store.editor.currentSandbox.owned) ||
    !store.isLoggedIn;

  if (showPlaceHolder) {
    const message = store.isLoggedIn ? (
      <>
        You need to own this sandbox to open a live session to collaborate with
        others in real time.{' '}
        <p>Fork this sandbox to live share it with others!</p>
      </>
    ) : (
      `You need to be signed in to open a live session to collaborate with others in real time. Sign in to live share this sandbox!`
    );

    return <More message={message} id="live" />;
  }

  return (
    <div>
      {store.live.isLive ? (
        <LiveInfo
          setMode={signals.live.onModeChanged}
          addEditor={signals.live.onAddEditorClicked}
          removeEditor={signals.live.onRemoveEditorClicked}
          isOwner={store.live.isOwner}
          isTeam={store.live.isTeam}
          roomInfo={store.live.roomInfo}
          ownerIds={store.live.roomInfo.ownerIds}
          currentUserId={store.live.liveUserId}
          reconnecting={store.live.reconnecting}
          onSessionCloseClicked={signals.live.onSessionCloseClicked}
          notificationsHidden={store.live.notificationsHidden}
          toggleNotificationsHidden={signals.live.onToggleNotificationsHidden}
          chatEnabled={store.live.roomInfo.chatEnabled}
          toggleChatEnabled={() => {
            signals.live.onChatEnabledChange({
              enabled: !store.live.roomInfo.chatEnabled,
            });
          }}
          setFollowing={signals.live.onFollow}
          followingUserId={store.live.followingUserId}
        />
      ) : (
        <React.Fragment>
          <Description style={{ marginBottom: '1rem' }}>
            Invite others to live edit this sandbox with you. We
            {"'"}
            re doing it live!
          </Description>

          <React.Fragment>
            <WorkspaceSubtitle>Create live room</WorkspaceSubtitle>
            <Description>
              To invite others you need to generate a URL that others can join.
            </Description>

            {hasUnsyncedModules && (
              <ErrorDescription>
                Save all your files before going live
              </ErrorDescription>
            )}
            <WorkspaceInputContainer>
              <LiveButton
                onClick={() => {
                  signals.live.createLiveClicked({
                    sandboxId: store.editor.currentId,
                  });
                }}
                isLoading={store.live.isLoading}
                disable={hasUnsyncedModules}
              />
            </WorkspaceInputContainer>
          </React.Fragment>
        </React.Fragment>
      )}
    </div>
  );
};

export default inject('signals', 'store')(observer(Live));
