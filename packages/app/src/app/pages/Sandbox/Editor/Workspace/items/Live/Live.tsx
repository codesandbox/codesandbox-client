import React from 'react';
import { observer } from 'mobx-react-lite';

import { useSignals, useStore } from 'app/store';

import {
  ErrorDescription,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';

import { More } from '../More';

import { Description } from './elements';
import { LiveButton } from './LiveButton';
import { LiveInfo } from './LiveInfo';

export const Live = observer(() => {
  const {
    live: { createLiveClicked },
  } = useSignals();
  const {
    editor: { currentId, currentSandbox, isAllModulesSynced },
    isLoggedIn,
    live: { isLive, isLoading },
  } = useStore();

  const showPlaceHolder = !(isLoggedIn && (isLive || currentSandbox.owned));
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

  const hasUnsyncedModules = !isAllModulesSynced;
  return (
    <div>
      {isLive ? (
        <LiveInfo />
      ) : (
        <>
          <Description>
            {`Invite others to live edit this sandbox with you. We're doing it live!`}
          </Description>

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
              disable={hasUnsyncedModules}
              isLoading={isLoading}
              onClick={() => {
                createLiveClicked({ sandboxId: currentId });
              }}
            />
          </WorkspaceInputContainer>
        </>
      )}
    </div>
  );
});
