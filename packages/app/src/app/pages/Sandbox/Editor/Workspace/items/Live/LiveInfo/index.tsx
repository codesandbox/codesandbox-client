import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { sortBy } from 'lodash-es';
import React, { FocusEvent, FunctionComponent } from 'react';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';

import { useOvermind } from 'app/overmind';

import { Description, WorkspaceInputContainer } from '../../../elements';

import LiveButton from '../LiveButton';

import Countdown from './Countdown';
import {
  Container,
  Input,
  LiveMessage,
  NoOtherUsers,
  SubTitle,
  Title,
  Users,
} from './elements';
import { FollowButton } from './FollowButton';
import { LiveMode } from './LiveMode';
import { MakeEditorButton } from './MakeEditorButton';
import { MakeSpectatorButton } from './MakeSpectatorButton';
import { Preferences } from './Preferences';
import { User } from './User';

export const LiveInfo: FunctionComponent = () => {
  const {
    actions: {
      live: { onSessionCloseClicked },
    },
    state: {
      live: {
        isOwner,
        isTeam,
        reconnecting,
        roomInfo: { editorIds, mode, ownerIds, roomId, startTime, users },
      },
    },
  } = useOvermind();
  const select = ({ target }: FocusEvent<HTMLInputElement>) => target.select();

  const owners = users.filter(({ id }) => ownerIds.includes(id));
  const editors = sortBy(
    users.filter(({ id }) => editorIds.includes(id) && !ownerIds.includes(id)),
    'username'
  );
  const otherUsers = sortBy(
    users.filter(({ id }) => !ownerIds.includes(id) && !editorIds.includes(id)),
    'username'
  );
  const getLiveMessage = () => {
    if (isTeam) {
      return 'Your team is live!';
    }

    if (isOwner) {
      return "You've gone live!";
    }

    return 'You are live!';
  };

  return (
    <Container>
      <Title>
        <LiveMessage>
          {reconnecting ? (
            'Reconnecting...'
          ) : (
            <>
              <RecordIcon /> {getLiveMessage()}
            </>
          )}
        </LiveMessage>

        <div>{startTime !== null && <Countdown time={startTime} />}</div>
      </Title>

      <Description>
        Share this link with others to invite them to the session:
      </Description>

      <Input onFocus={select} value={`https://codesandbox.io/live/${roomId}`} />

      {isOwner && !isTeam && (
        <WorkspaceInputContainer>
          <LiveButton
            message="Stop Session"
            onClick={() => onSessionCloseClicked()}
            showIcon={false}
          />
        </WorkspaceInputContainer>
      )}

      <Preferences />

      <LiveMode />

      {owners && (
        <Margin top={1}>
          <SubTitle>Owners</SubTitle>

          <Users>
            {owners.map(owner => (
              <User
                key={owner.id}
                user={owner}
                type="Owner"
                sideView={<FollowButton user={owner} />}
              />
            ))}
          </Users>
        </Margin>
      )}

      {editors.length > 0 && mode === 'classroom' && (
        <Margin top={1}>
          <SubTitle>Editors</SubTitle>

          <Users>
            {editors.map(user => (
              <User
                key={user.id}
                user={user}
                type="Editor"
                sideView={
                  <>
                    <FollowButton user={user} />

                    {isOwner && mode === 'classroom' && (
                      <MakeSpectatorButton user={user} />
                    )}
                  </>
                }
              />
            ))}
          </Users>
        </Margin>
      )}

      <Margin top={1}>
        <SubTitle>Users</SubTitle>

        <Users>
          {otherUsers.length ? (
            otherUsers.map(user => (
              <User
                key={user.id}
                user={user}
                type="Spectator"
                sideView={
                  <>
                    {mode !== 'classroom' && <FollowButton user={user} />}

                    {isOwner && mode === 'classroom' && (
                      <MakeEditorButton user={user} />
                    )}
                  </>
                }
              />
            ))
          ) : (
            <NoOtherUsers>No other users in session, invite them!</NoOtherUsers>
          )}
        </Users>
      </Margin>
    </Container>
  );
};
