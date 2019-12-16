import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { RoomInfo } from '@codesandbox/common/lib/types';
import { sortBy } from 'lodash-es';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import AddIcon from 'react-icons/lib/md/add';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import RemoveIcon from 'react-icons/lib/md/remove';

import { Description, WorkspaceInputContainer } from '../../elements';
import Countdown from './Countdown';
import {
  Container,
  IconContainer,
  Mode,
  ModeDetails,
  ModeSelect,
  ModeSelector,
  Preference,
  PreferencesContainer,
  StyledInput,
  SubTitle,
  Title,
  Users,
} from './elements';
import LiveButton from './LiveButton';
import { User } from './User';

interface ILiveInfoProps {
  roomInfo: RoomInfo;
  isOwner: boolean;
  isTeam: boolean;
  ownerIds: Array<any>;
  setMode: ({ mode: string }) => void;
  addEditor: ({ liveUserId: string }) => void;
  removeEditor: ({ liveUserId: string }) => void;
  currentUserId: string;
  reconnecting: boolean;
  onSessionCloseClicked: () => void;
  notificationsHidden: boolean;
  toggleNotificationsHidden: () => void;
  chatEnabled: boolean;
  toggleChatEnabled: () => void;
  setFollowing: ({ liveUserId: string }) => void;
  followingUserId: string;
}

const LiveInfo: React.FunctionComponent<ILiveInfoProps> = ({
  roomInfo,
  roomInfo: { users, editorIds, startTime, roomId, mode } = {},
  isOwner,
  isTeam,
  ownerIds,
  setMode,
  addEditor,
  removeEditor,
  currentUserId,
  reconnecting,
  onSessionCloseClicked,
  notificationsHidden,
  toggleNotificationsHidden,
  chatEnabled,
  toggleChatEnabled,
  setFollowing,
  followingUserId,
}) => {
  const select: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.target.select();
  };

  const owners = users.filter(u => ownerIds.includes(u.id));

  const editors = sortBy(
    users.filter(u => editorIds.includes(u.id) && !ownerIds.includes(u.id)),
    'username'
  );

  const otherUsers = sortBy(
    users.filter(u => !ownerIds.includes(u.id) && !editorIds.includes(u.id)),
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
              <RecordIcon /> {liveMessage}
            </>
          )}
        </div>
        <div>{startTime != null && <Countdown time={startTime} />}</div>
      </Title>
      <Description>
        Share this link with others to invite them to the session:
      </Description>
      <StyledInput
        onFocus={select}
        value={`https://codesandbox.io/live/${roomId}`}
      />

      {isOwner && !isTeam && (
        <WorkspaceInputContainer>
          <LiveButton
            message="Stop Session"
            onClick={onSessionCloseClicked}
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
            onClick={toggleNotificationsHidden}
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
            onClick={isOwner ? () => setMode({ mode: 'open' }) : undefined}
            selected={mode === 'open'}
          >
            <div>Open</div>
            <ModeDetails>Everyone can edit</ModeDetails>
          </Mode>
          <Mode
            onClick={isOwner ? () => setMode({ mode: 'classroom' }) : undefined}
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
                currentUserId={currentUserId}
                user={owner}
                roomInfo={roomInfo}
                type="Owner"
                sideView={
                  owner.id !== currentUserId && (
                    <IconContainer>
                      {followingUserId === owner.id ? (
                        <Tooltip content="Stop following">
                          <UnFollowIcon
                            onClick={() => setFollowing({ liveUserId: null })}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Follow along">
                          <FollowIcon
                            onClick={() =>
                              setFollowing({ liveUserId: owner.id })
                            }
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
                currentUserId={currentUserId}
                key={user.id}
                user={user}
                roomInfo={roomInfo}
                type="Editor"
                sideView={
                  <>
                    {user.id !== currentUserId && (
                      <IconContainer>
                        {followingUserId === user.id ? (
                          <Tooltip content="Stop following">
                            <UnFollowIcon
                              onClick={() => setFollowing({ liveUserId: null })}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip content="Follow along">
                            <FollowIcon
                              onClick={() =>
                                setFollowing({ liveUserId: user.id })
                              }
                            />
                          </Tooltip>
                        )}
                      </IconContainer>
                    )}
                    {isOwner && mode === 'classroom' && (
                      <IconContainer style={{ marginLeft: '0.25rem' }}>
                        <Tooltip content="Make spectator">
                          <RemoveIcon
                            onClick={() =>
                              removeEditor({ liveUserId: user.id })
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
                currentUserId={currentUserId}
                key={user.id}
                user={user}
                roomInfo={roomInfo}
                type="Spectator"
                sideView={
                  <>
                    {mode !== 'classroom' && user.id !== currentUserId && (
                      <IconContainer>
                        {followingUserId === user.id ? (
                          <Tooltip content="Stop following">
                            <UnFollowIcon
                              onClick={() => setFollowing({ liveUserId: null })}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip content="Follow along">
                            <FollowIcon
                              onClick={() =>
                                setFollowing({ liveUserId: user.id })
                              }
                            />
                          </Tooltip>
                        )}
                      </IconContainer>
                    )}
                    {isOwner && mode === 'classroom' && (
                      <IconContainer style={{ marginLeft: '0.25rem' }}>
                        <Tooltip content="Make editor">
                          <AddIcon
                            onClick={() => addEditor({ liveUserId: user.id })}
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

export default LiveInfo;
