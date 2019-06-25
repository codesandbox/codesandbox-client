import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { observer } from 'mobx-react-lite';
import { sortBy } from 'lodash-es';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import AddIcon from 'react-icons/lib/md/add';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import RemoveIcon from 'react-icons/lib/md/remove';

import { useSignals, useStore } from 'app/store';

import { Description, WorkspaceInputContainer } from '../../../elements';

import { LiveButton } from '../LiveButton';

import {
  ConnectionStatus,
  Container,
  IconContainer,
  NoUsers,
  StyledInput,
  SubTitle,
  Title,
  Users,
} from './elements';
import { LiveMode } from './LiveMode';
import { Preferences } from './Preferences';
import { SessionTimer } from './SessionTimer';
import { User } from './User';

export const LiveInfo = observer(() => {
  const {
    live: {
      onAddEditorClicked,
      onFollow,
      onRemoveEditorClicked,
      onSessionCloseClicked,
    },
  } = useSignals();
  const {
    live: {
      followingUserId,
      isOwner,
      isTeam,
      liveUserId,
      reconnecting,
      roomInfo: { editorIds, mode, ownerIds, roomId, startTime, users },
    },
  } = useStore();

  const owners = users.filter(u => ownerIds.indexOf(u.id) > -1);

  const editors = sortBy(
    users.filter(
      u => editorIds.indexOf(u.id) > -1 && ownerIds.indexOf(u.id) === -1
    ),
    'username'
  );
  const otherUsers = sortBy(
    users.filter(
      u => ownerIds.indexOf(u.id) === -1 && editorIds.indexOf(u.id) === -1
    ),
    'username'
  );

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

      {owners && (
        <Margin top={1}>
          <SubTitle>Owners</SubTitle>

          <Users>
            {owners.map(owner => (
              <User
                currentUserId={liveUserId}
                key={owner.id}
                sideView={
                  owner.id !== liveUserId && (
                    <IconContainer>
                      {followingUserId === owner.id ? (
                        <Tooltip content="Stop following">
                          <UnFollowIcon
                            onClick={() => onFollow({ liveUserId: null })}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Follow along">
                          <FollowIcon
                            onClick={() => onFollow({ liveUserId: owner.id })}
                          />
                        </Tooltip>
                      )}
                    </IconContainer>
                  )
                }
                type="Owner"
                user={owner}
                users={users}
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
                currentUserId={liveUserId}
                key={user.id}
                sideView={
                  <>
                    {user.id !== liveUserId && (
                      <IconContainer>
                        {followingUserId === user.id ? (
                          <Tooltip content="Stop following">
                            <UnFollowIcon
                              onClick={() => onFollow({ liveUserId: null })}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip content="Follow along">
                            <FollowIcon
                              onClick={() => onFollow({ liveUserId: user.id })}
                            />
                          </Tooltip>
                        )}
                      </IconContainer>
                    )}

                    {isOwner && mode === 'classroom' && (
                      <IconContainer style={{ marginLeft: '0.25rem' }}>
                        <Tooltip content={'Make spectator'}>
                          <RemoveIcon
                            onClick={() =>
                              onRemoveEditorClicked({ liveUserId: user.id })
                            }
                          />
                        </Tooltip>
                      </IconContainer>
                    )}
                  </>
                }
                type="Editor"
                user={user}
                users={users}
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
                currentUserId={liveUserId}
                key={user.id}
                sideView={
                  <>
                    {mode !== 'classroom' && user.id !== liveUserId && (
                      <IconContainer>
                        {followingUserId === user.id ? (
                          <Tooltip content="Stop following">
                            <UnFollowIcon
                              onClick={() => onFollow({ liveUserId: null })}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip content="Follow along">
                            <FollowIcon
                              onClick={() => onFollow({ liveUserId: user.id })}
                            />
                          </Tooltip>
                        )}
                      </IconContainer>
                    )}

                    {isOwner && mode === 'classroom' && (
                      <IconContainer style={{ marginLeft: '0.25rem' }}>
                        <Tooltip content={'Make editor'}>
                          <AddIcon
                            onClick={() =>
                              onAddEditorClicked({ liveUserId: user.id })
                            }
                          />
                        </Tooltip>
                      </IconContainer>
                    )}
                  </>
                }
                type="Spectator"
                user={user}
                users={users}
              />
            ))
          ) : (
            <NoUsers>No other users in session, invite them!</NoUsers>
          )}
        </Users>
      </Margin>
    </Container>
  );
});
