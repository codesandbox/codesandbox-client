import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { sortBy } from 'lodash-es';
import React, { FocusEvent, FunctionComponent } from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import AddIcon from 'react-icons/lib/md/add';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import RemoveIcon from 'react-icons/lib/md/remove';

import { useOvermind } from 'app/overmind';

import { Description, WorkspaceInputContainer } from '../../../elements';

import LiveButton from '../LiveButton';

import Countdown from './Countdown';
import { User } from './User';

import {
  Container,
  IconContainer,
  Input,
  Mode,
  ModeDetails,
  ModeSelect,
  ModeSelector,
  Preference,
  PreferencesContainer,
  SubTitle,
  Title,
  Users,
} from './elements';

const noop = () => undefined;

export const LiveInfo: FunctionComponent = () => {
  const {
    actions: {
      live: {
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
      live: {
        followingUserId,
        isOwner,
        isTeam,
        liveUserId,
        notificationsHidden,
        reconnecting,
        roomInfo: {
          chatEnabled,
          editorIds,
          mode,
          ownerIds,
          roomId,
          startTime,
          users,
        },
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

      <Margin top={1}>
        <SubTitle>Preferences</SubTitle>

        {isOwner && (
          <PreferencesContainer>
            <Preference>Chat enabled</Preference>

            <Switch
              offMode
              onClick={() => onChatEnabledChange(!chatEnabled)}
              right={chatEnabled}
              secondary
              small
            />
          </PreferencesContainer>
        )}

        <PreferencesContainer>
          <Preference>Hide notifications</Preference>

          <Switch
            offMode
            onClick={() => onToggleNotificationsHidden()}
            right={notificationsHidden}
            secondary
            small
          />
        </PreferencesContainer>
      </Margin>

      <Margin top={1}>
        <SubTitle>Live Mode</SubTitle>

        <ModeSelect>
          <ModeSelector i={mode === 'open' ? 0 : 1} />

          <Mode
            onClick={isOwner ? () => onModeChanged('open') : noop}
            selected={mode === 'open'}
          >
            <div>Open</div>

            <ModeDetails>Everyone can edit</ModeDetails>
          </Mode>

          <Mode
            onClick={isOwner ? () => onModeChanged('classroom') : noop}
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
                user={owner}
                type="Owner"
                sideView={
                  owner.id !== liveUserId && (
                    <IconContainer>
                      {followingUserId === owner.id ? (
                        <Tooltip content="Stop following">
                          <UnFollowIcon onClick={() => onFollow(null)} />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Follow along">
                          <FollowIcon onClick={() => onFollow(owner.id)} />
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
                key={user.id}
                user={user}
                type="Editor"
                sideView={
                  <>
                    {user.id !== liveUserId && (
                      <IconContainer>
                        {followingUserId === user.id ? (
                          <Tooltip content="Stop following">
                            <UnFollowIcon onClick={() => onFollow(null)} />
                          </Tooltip>
                        ) : (
                          <Tooltip content="Follow along">
                            <FollowIcon onClick={() => onFollow(user.id)} />
                          </Tooltip>
                        )}
                      </IconContainer>
                    )}

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
                    {mode !== 'classroom' && user.id !== liveUserId && (
                      <IconContainer>
                        {followingUserId === user.id ? (
                          <Tooltip content="Stop following">
                            <UnFollowIcon onClick={() => onFollow(null)} />
                          </Tooltip>
                        ) : (
                          <Tooltip content="Follow along">
                            <FollowIcon onClick={() => onFollow(user.id)} />
                          </Tooltip>
                        )}
                      </IconContainer>
                    )}

                    {isOwner && mode === 'classroom' && (
                      <IconContainer style={{ marginLeft: '0.25rem' }}>
                        <Tooltip content="Make editor">
                          <AddIcon
                            onClick={() => onAddEditorClicked(user.id)}
                          />
                        </Tooltip>
                      </IconContainer>
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
