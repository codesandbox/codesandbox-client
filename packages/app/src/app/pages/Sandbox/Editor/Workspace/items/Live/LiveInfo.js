import React from 'react';
import { inject, observer } from 'mobx-react';
import { sortBy } from 'lodash-es';

import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import Margin from 'common/components/spacing/Margin';
import Switch from 'common/components/Switch';

import Tooltip from 'common/components/Tooltip';

import AddIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/md/remove';
import FollowIcon from 'react-icons/lib/ti/user-add';
import UnFollowIcon from 'react-icons/lib/ti/user-delete';

import User from './User';
import Countdown from './Countdown';
import LiveButton from './LiveButton';

import { Description, WorkspaceInputContainer } from '../../elements';
import {
  Invite,
  Container,
  Title,
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
  Reconnecting,
} from './elements';

class LiveInfo extends React.Component {
  select = e => {
    e.target.select();
  };

  render() {
    const {
      roomInfo,
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
    } = this.props;

    const owners = roomInfo.users.filter(u => ownerIds.indexOf(u.id) > -1);

    const editors = sortBy(
      roomInfo.users.filter(
        u =>
          roomInfo.editorIds.indexOf(u.id) > -1 && ownerIds.indexOf(u.id) === -1
      ),
      'username'
    );
    const otherUsers = sortBy(
      roomInfo.users.filter(
        u =>
          ownerIds.indexOf(u.id) === -1 &&
          roomInfo.editorIds.indexOf(u.id) === -1
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
          <Reconnecting>
            {reconnecting ? (
              'Reconnecting...'
            ) : (
              <React.Fragment>
                <RecordIcon /> {liveMessage}
              </React.Fragment>
            )}
          </Reconnecting>
          <div>
            {roomInfo.startTime != null && (
              <Countdown time={roomInfo.startTime} />
            )}
          </div>
        </Title>
        <Description>
          Share this link with others to invite them to the session:
        </Description>
        <StyledInput
          onFocus={this.select}
          value={`https://codesandbox.io/live/${roomInfo.roomId}`}
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
            <ModeSelector i={roomInfo.mode === 'open' ? 0 : 1} />
            <Mode
              onClick={isOwner ? () => setMode({ mode: 'open' }) : undefined}
              selected={roomInfo.mode === 'open'}
            >
              <div>Open</div>
              <ModeDetails>Everyone can edit</ModeDetails>
            </Mode>
            <Mode
              onClick={
                isOwner ? () => setMode({ mode: 'classroom' }) : undefined
              }
              selected={roomInfo.mode === 'classroom'}
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
                          <Tooltip title="Stop following">
                            <UnFollowIcon
                              onClick={() => setFollowing({ userId: null })}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Follow along">
                            <FollowIcon
                              onClick={() => setFollowing({ userId: owner.id })}
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

        {editors.length > 0 && roomInfo.mode === 'classroom' && (
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
                    <React.Fragment>
                      {user.id !== currentUserId && (
                        <IconContainer>
                          {followingUserId === user.id ? (
                            <Tooltip title="Stop following">
                              <UnFollowIcon
                                onClick={() => setFollowing({ userId: null })}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Follow along">
                              <FollowIcon
                                onClick={() =>
                                  setFollowing({ userId: user.id })
                                }
                              />
                            </Tooltip>
                          )}
                        </IconContainer>
                      )}
                      {isOwner && roomInfo.mode === 'classroom' && (
                        <IconContainer
                          css={`
                            margin-left: 0.25rem;
                          `}
                        >
                          <Tooltip title={'Make spectator'}>
                            <RemoveIcon
                              onClick={() => removeEditor({ userId: user.id })}
                            />
                          </Tooltip>
                        </IconContainer>
                      )}
                    </React.Fragment>
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
                    <React.Fragment>
                      {roomInfo.mode !== 'classroom' &&
                        user.id !== currentUserId && (
                          <IconContainer>
                            {followingUserId === user.id ? (
                              <Tooltip title="Stop following">
                                <UnFollowIcon
                                  onClick={() => setFollowing({ userId: null })}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Follow along">
                                <FollowIcon
                                  onClick={() =>
                                    setFollowing({ userId: user.id })
                                  }
                                />
                              </Tooltip>
                            )}
                          </IconContainer>
                        )}
                      {isOwner && roomInfo.mode === 'classroom' && (
                        <IconContainer
                          css={`
                            margin-left: 0.25rem;
                          `}
                        >
                          <Tooltip title={'Make editor'}>
                            <AddIcon
                              onClick={() => addEditor({ userId: user.id })}
                            />
                          </Tooltip>
                        </IconContainer>
                      )}
                    </React.Fragment>
                  }
                />
              ))
            ) : (
              <Invite>No other users in session, invite them!</Invite>
            )}
          </Users>
        </Margin>
      </Container>
    );
  }
}

export default inject('store')(observer(LiveInfo));
