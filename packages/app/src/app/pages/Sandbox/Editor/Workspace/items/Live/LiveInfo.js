import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { sortBy } from 'lodash-es';

import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import Input from 'common/components/Input';
import Margin from 'common/components/spacing/Margin';
import delay from 'common/utils/animation/delay-effect';
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

const Container = styled.div`
  ${delay()};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  box-sizing: border-box;
`;

const Title = styled.div`
  color: #fd2439fa;
  font-weight: 800;
  display: flex;
  align-items: center;
  vertical-align: middle;

  padding: 0.5rem 1rem;
  padding-top: 0;

  svg {
    margin-right: 0.25rem;
  }
`;

const StyledInput = styled(Input)`
  width: calc(100% - 1.5rem);
  margin: 0 0.75rem;
  font-size: 0.875rem;
`;

const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);

  padding-left: 1rem;
  font-size: 0.875rem;
`;

const Users = styled.div`
  padding: 0.25rem 1rem;
  padding-top: 0;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

const ModeSelect = styled.div`
  position: relative;
  margin: 0.5rem 1rem;
`;

const Mode = styled.button`
  display: block;
  text-align: left;
  transition: 0.3s ease opacity;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 4px;
  width: 100%;

  font-weight: 600;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: ${props => (props.onClick ? 'pointer' : 'inherit')};
  color: white;
  opacity: ${props => (props.selected ? 1 : 0.6)};
  margin: 0.25rem 0;

  z-index: 3;

  ${props =>
    props.onClick &&
    `
  &:hover {
    opacity: 1;
  }`};
`;

const ModeDetails = styled.div`
  font-size: 0.75rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  margin-top: 0.25rem;
`;

const ModeSelector = styled.div`
  transition: 0.3s ease transform;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 48px;

  border: 2px solid rgba(253, 36, 57, 0.6);
  background-color: rgba(253, 36, 57, 0.6);
  border-radius: 4px;
  z-index: -1;

  transform: translateY(${props => props.i * 55}px);
`;

const PreferencesContainer = styled.div`
  margin: 1rem;
  display: flex;
`;

const Preference = styled.div`
  flex: 1;
  font-weight: 400;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const IconContainer = styled.div`
  transition: 0.3s ease color;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

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
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {reconnecting ? (
              'Reconnecting...'
            ) : (
              <React.Fragment>
                <RecordIcon /> {liveMessage}
              </React.Fragment>
            )}
          </div>
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

        {isOwner &&
          !isTeam && (
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

        {editors.length > 0 &&
          roomInfo.mode === 'classroom' && (
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
                        {isOwner &&
                          roomInfo.mode === 'classroom' && (
                            <IconContainer style={{ marginLeft: '0.25rem' }}>
                              <Tooltip title={'Make spectator'}>
                                <RemoveIcon
                                  onClick={() =>
                                    removeEditor({ userId: user.id })
                                  }
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
                      {isOwner &&
                        roomInfo.mode === 'classroom' && (
                          <IconContainer style={{ marginLeft: '0.25rem' }}>
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
  }
}

export default inject('store')(observer(LiveInfo));
