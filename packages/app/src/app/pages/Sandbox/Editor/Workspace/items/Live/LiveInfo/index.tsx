import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { sortBy } from 'lodash-es';
import React, { FocusEvent, FunctionComponent } from 'react';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import RemoveIcon from 'react-icons/lib/md/remove';

import { useOvermind } from 'app/overmind';

import { Description, WorkspaceInputContainer } from '../../../elements';

import LiveButton from '../LiveButton';

import Countdown from './Countdown';
import {
  Container,
  IconContainer,
  Input,
  SubTitle,
  Title,
  Users,
} from './elements';
import { FollowButton } from './FollowButton';
import { LiveMode } from './LiveMode';
import { MakeEditorButton } from './MakeEditorButton';
import { Preferences } from './Preferences';
import { User } from './User';

export const LiveInfo: FunctionComponent = () => {
  const {
    actions: {
      live: { onRemoveEditorClicked, onSessionCloseClicked },
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
        <div
          style={{
            fontSize: '1rem',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {reconnecting ? (
            'Reconnecting...'
          ) : (
            <>
              <RecordIcon /> {getLiveMessage()}
            </>
          )}
        </div>

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
                      <IconContainer style={{ marginLeft: '0.25rem' }}>
                        <Tooltip content="Make spectator">
                          <RemoveIcon
                            onClick={() => onRemoveEditorClicked(user.id)}
                          />
                        </Tooltip>
                      </IconContainer>
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
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: '.875rem',
                marginTop: '0.25rem',
              }}
            >
              No other users in session, invite them!
            </div>
          )}
        </Users>
      </Margin>
    </Container>
  );
};
