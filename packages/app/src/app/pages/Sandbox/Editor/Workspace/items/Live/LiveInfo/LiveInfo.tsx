import { observer } from 'mobx-react-lite';
import React from 'react';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';

import { useSignals, useStore } from 'app/store';

import { Description, WorkspaceInputContainer } from '../../../elements';

import { LiveButton } from '../LiveButton';

import { ConnectionStatus, Container, StyledInput, Title } from './elements';
import { LiveMode } from './LiveMode';
import { Preferences } from './Preferences';
import { SessionTimer } from './SessionTimer';
import { Users } from './Users';

export const LiveInfo = observer(() => {
  const {
    live: { onSessionCloseClicked },
  } = useSignals();
  const {
    live: {
      isOwner,
      isTeam,
      reconnecting,
      roomInfo: { roomId, startTime },
    },
  } = useStore();

  const liveMessage = (() => {
    if (isTeam) {
      return 'Your team is live!';
    }

    if (isOwner) {
      return "You've gone live!";
    }

    return 'You are live!';
  })();

  return (
    <Container>
      <Title>
        <ConnectionStatus>
          {reconnecting ? (
            'Reconnecting...'
          ) : (
            <>
              <RecordIcon /> {liveMessage}
            </>
          )}
        </ConnectionStatus>

        <div>{startTime != null && <SessionTimer startTime={startTime} />}</div>
      </Title>

      <Description>
        Share this link with others to invite them to the session:
      </Description>

      <StyledInput
        onFocus={e => e.target.select()}
        value={`https://codesandbox.io/live/${roomId}`}
      />

      {isOwner && !isTeam && (
        <WorkspaceInputContainer>
          <LiveButton
            message="Stop Session"
            onClick={onSessionCloseClicked}
            tcon={false}
          />
        </WorkspaceInputContainer>
      )}

      <Preferences />

      <LiveMode />

      <Users />
    </Container>
  );
});
