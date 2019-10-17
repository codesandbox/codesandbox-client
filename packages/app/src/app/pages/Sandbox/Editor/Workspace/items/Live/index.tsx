import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import LiveInfo from './LiveInfo';
import LiveButton from './LiveButton';

import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
  ErrorDescription,
} from '../../elements';
import { More } from '../More';

export const Live: FunctionComponent = () => {
  const {
    state: {
      isLoggedIn,
      live: {
        isLive,
        isOwner,
        isTeam,
        roomInfo,
        liveUserId,
        reconnecting,
        notificationsHidden,
        followingUserId,
        isLoading,
      },
      editor: {
        isAllModulesSynced,
        currentSandbox: { owned },
        currentId,
      },
    },
    actions: {
      live: {
        onModeChanged,
        onAddEditorClicked,
        onRemoveEditorClicked,
        onSessionCloseClicked,
        onToggleNotificationsHidden,
        onChatEnabledChange,
        onFollow,
        createLiveClicked,
      },
    },
  } = useOvermind();
  const hasUnsyncedModules = !isAllModulesSynced;

  const showPlaceHolder = (!isLive && !owned) || !isLoggedIn;

  if (showPlaceHolder) {
    const message = isLoggedIn ? (
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
      {isLive ? (
        <LiveInfo
          setMode={onModeChanged}
          addEditor={onAddEditorClicked}
          removeEditor={onRemoveEditorClicked}
          isOwner={isOwner}
          isTeam={isTeam}
          roomInfo={roomInfo}
          ownerIds={roomInfo.ownerIds}
          currentUserId={liveUserId}
          reconnecting={reconnecting}
          onSessionCloseClicked={onSessionCloseClicked}
          notificationsHidden={notificationsHidden}
          toggleNotificationsHidden={onToggleNotificationsHidden}
          chatEnabled={roomInfo.chatEnabled}
          toggleChatEnabled={() => {
            onChatEnabledChange({
              enabled: !roomInfo.chatEnabled,
            });
          }}
          setFollowing={onFollow}
          followingUserId={followingUserId}
        />
      ) : (
        <>
          <Description style={{ marginBottom: '1rem' }}>
            Invite others to live edit this sandbox with you. We
            {"'"}
            re doing it live!
          </Description>

          <>
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
                  createLiveClicked({
                    sandboxId: currentId,
                  });
                }}
                isLoading={isLoading}
                disable={hasUnsyncedModules}
              />
            </WorkspaceInputContainer>
          </>
        </>
      )}
    </div>
  );
};
