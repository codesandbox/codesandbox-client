import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import {
  Description,
  ErrorDescription,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';

import { More } from '../More';

import LiveButton from './LiveButton';
import { LiveInfo } from './LiveInfo';

export const Live: FunctionComponent = () => {
  const {
    actions: {
      live: { createLiveClicked },
    },
    state: {
      editor: {
        currentSandbox: { id, owned },
        isAllModulesSynced,
      },
      isLoggedIn,
      live: { isLive, isLoading },
    },
  } = useOvermind();
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
        <LiveInfo />
      ) : (
        <>
          <Description style={{ marginBottom: '1rem' }}>
            Invite others to live edit this sandbox with you. We
            {"'"}
            re doing it live!
          </Description>

          <WorkspaceSubtitle>Create live room</WorkspaceSubtitle>

          <Description>
            To invite others you need to generate a URL that others can join.
          </Description>

          {!isAllModulesSynced && (
            <ErrorDescription>
              Save all your files before going live
            </ErrorDescription>
          )}

          <WorkspaceInputContainer>
            <LiveButton
              disable={!isAllModulesSynced}
              isLoading={isLoading}
              onClick={() => createLiveClicked(id)}
            />
          </WorkspaceInputContainer>
        </>
      )}
    </div>
  );
};
