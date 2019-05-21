import React from 'react';
import { observer } from 'mobx-react-lite';
import { sortBy } from 'lodash-es';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import AddIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/md/remove';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { useSignals, useStore } from 'app/store';
import { Description, WorkspaceInputContainer } from '../../../elements';
import { LiveButton } from '../LiveButton';
import { SessionTimer } from './SessionTimer';
import { User } from './User';
import {
  Container,
  Title,
  ConnectionStatus,
  StyledInput,
  SubTitle,
  Users,
  ModeSelect,
  Mode,
  ModeDetails,
  ModeSelector,
  PreferencesContainer,
  Preference,
  IconContainer,
  NoUsers,
} from './elements';

export const LiveInfo = observer(() => {
  const {
    live: {
      onModeChanged,
      onAddEditorClicked,
      onChatEnabledChange,
      onRemoveEditorClicked,
      onSessionCloseClicked,
      onToggleNotificationsHidden,
      onFollow,
    },
  } = useSignals();
  const {
    live: {
      isOwner,
      isTeam,
      roomInfo: {
        chatEnabled,
        users,
        ownerIds,
        editorIds,
        startTime,
        roomId,
        mode,
      },
      liveUserId,
      reconnecting,
      notificationsHidden,
      followingUserId,
    },
  } = useStore();

  const toggleChatEnabled = () => {
    onChatEnabledChange({
      enabled: !chatEnabled,
    });
  };

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
        onFocus={e => {
          e.target.select();
        }}
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

      <Margin top={1}>
        <SubTitle>Preferences</SubTitle>

        {isOwner && (
          <PreferencesContainer>
            <Preference>Chat enabled</Preference>
            <Switch
              right={chatEnabled}
              onClick={toggleChatEnabled}
              small
              offMode
              secondary
            />
          </PreferencesContainer>
        )}
        <PreferencesContainer>
          <Preference>Hide notifications</Preference>
          <Switch
            right={notificationsHidden}
            onClick={onToggleNotificationsHidden}
            small
            offMode
            secondary
          />
        </PreferencesContainer>
      </Margin>

      <Margin top={1}>
        <SubTitle>Live Mode</SubTitle>
        <ModeSelect>
          <ModeSelector i={mode === 'open' ? 0 : 1} />
          <Mode
            onClick={
              isOwner ? () => onModeChanged({ mode: 'open' }) : undefined
            }
            selected={mode === 'open'}
          >
            <div>Open</div>
            <ModeDetails>Everyone can edit</ModeDetails>
          </Mode>
          <Mode
            onClick={
              isOwner ? () => onModeChanged({ mode: 'classroom' }) : undefined
            }
            selected={mode === 'classroom'}
          >
            <div>Classroom</div>
            <ModeDetails>Take control over who can edit</ModeDetails>
          </Mode>
        </ModeSelect>
      </Margin>

      {owners && (
        <Margin top={1}>
          <SubTitle>Owners</SubTitle>
          <Users>
            {owners.map(owner => (
              <User
                key={owner.id}
                currentUserId={liveUserId}
                user={owner}
                users={users}
                type="Owner"
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
                user={user}
                users={users}
                type="Editor"
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
                user={user}
                users={users}
                type="Spectator"
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
