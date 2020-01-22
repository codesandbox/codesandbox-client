/**
 * Not live
 * Live
 * Not logged in
 */

import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import {
  Description,
  ErrorDescription,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';

// TODO: handle not logged in
// import { More } from '../More';

import LiveButton from './LiveButton';
import LiveInfo from './LiveInfo';

import { NotLive } from './NotLive';
import { LiveNow } from './LiveNow';

export const Live: FunctionComponent = () => {
  const {
    actions: {
      live: {
        createLiveClicked,
        onAddEditorClicked,
        onChatEnabledChange,
        onFollow,
        onModeChanged,
        onRemoveEditorClicked,
        onSessionCloseClicked,
        onToggleNotificationsHidden,
      },
    },
    state: {
      editor: {
        currentSandbox: { id, owned },
        isAllModulesSynced,
      },
      live: {
        followingUserId,
        isLive,
        isLoading,
        isOwner,
        isTeam,
        liveUserId,
        notificationsHidden,
        reconnecting,
        roomInfo,
      },
      isLoggedIn,
    },
  } = useOvermind();
  const showPlaceholder = (!isLive && !owned) || !isLoggedIn;

  if (showPlaceholder) {
    const message = isLoggedIn ? (
      <>
        You need to own this sandbox to open a live session to collaborate with
        others in real time.{' '}
        <p>Fork this sandbox to live share it with others!</p>
      </>
    ) : (
      `You need to be signed in to open a live session to collaborate with others in real time. Sign in to live share this sandbox!`
    );
    return <div>{message}</div>;
    // return <More message={message} id="live" />;
  }

  return (
    <div>
      {isLive ? (
        <>
          <LiveNow />
          <LiveInfo
            addEditor={onAddEditorClicked}
            chatEnabled={roomInfo.chatEnabled}
            currentUserId={liveUserId}
            followingUserId={followingUserId}
            isOwner={isOwner}
            isTeam={isTeam}
            notificationsHidden={notificationsHidden}
            onSessionCloseClicked={onSessionCloseClicked}
            ownerIds={roomInfo.ownerIds}
            reconnecting={reconnecting}
            removeEditor={onRemoveEditorClicked}
            roomInfo={roomInfo}
            setFollowing={onFollow}
            setMode={onModeChanged}
            toggleChatEnabled={() => onChatEnabledChange(!roomInfo.chatEnabled)}
            toggleNotificationsHidden={onToggleNotificationsHidden}
          />
        </>
      ) : (
        <NotLive />
      )}
    </div>
  );
};
